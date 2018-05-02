import * as Collections from "typescript-collections";
import * as Immutable from "immutable";

/**
 * A causal chain is a complex interconnection of links. Each link has a number of
 * incoming links and a number of outgoing links. The chain keeps track of causal relations
 * between events of type T. By keeping track of these causal relationships, loops
 * (i.e. events causing themselves to reoccur, thereby potentially creating an
 * infinite loop of recurrence) can be detected and summarily avoided.
 *
 * Adding new events to the causal chain occurs in two phases. First, we try to
 * introduce the event into the staging area. This is where we check for potential
 * periodicity. After a given round (a time step in the causal chain), all staged events
 * are integrated into the chain. At this point we also check whether there has been a break in
 * causality for any of the events at the tail end of the chain. If so, then all paths leading
 * (unidirectionally) to these events must be severed.
 */
export class CausalChain<S, T> {

    private stagingArea: Collections.Set<Link<S, T>>;
    private tails: Collections.Set<Link<S, T>>;

    /**
     * Create a new CausalChain.
     */
    public constructor() {
        this.stagingArea = new Collections.Set<Link<S, T>>();
        this.tails = new Collections.Set<Link<S, T>>();
    }

    /**
     * Stage an event for integration into the chain.
     * Returns whether or not the event can be integrated.
     * @param {T} event
     * @param {Immutable.Set<ModelComponent>} before
     * @param {Immutable.Set<ModelComponent>} after
     * @returns {boolean}
     */
    public stage(event: T,
                 before: Immutable.Set<S>,
                 after: Immutable.Set<S>): boolean {

        let periodic = false;
        let newLink = new Link<S, T>(event, before, after);
        // try to find a link to connect with from among the tails
        this.tails.forEach(link => {
            if (link) {
                let success = link.linkTo(newLink);
                if (success) {
                    if (newLink.hasSimilarAncestor(newLink)) {
                        // if the new link causes periodicity
                        // sever all newly made ties
                        newLink.antecedent.forEach(ancestor => {
                            newLink.severLink(ancestor);
                        });
                        periodic = true;
                        return;
                    }
                }
            }
        });

        // if the new link does not become part of the
        // execution chain because it causes periodicity,
        // then it shouldn't be staged
        if (!periodic) {
            this.stagingArea.add(newLink);
        }

        return periodic;
    }

    /**
     * Fully integrate the staged events into the chain, thereby
     * updating the tails and clearing the staging area for the
     * next integration round.
     */
    public finalize(): void {
        let forRemoval = new Collections.Set<Link<S, T>>();
        this.tails.forEach(link => {
            // there has been a break in the causality
            // so this link should be removed from
            // the tail end of the chain
            if (link.incident.isEmpty()) {
                forRemoval.add(link);
            }
        });

        forRemoval.forEach(toBeRemoved => {
            this.tails.remove(toBeRemoved);
        });

        this.stagingArea.forEach(link => {
            // make sure that the newly added tail is in fact a tail
            // i.e. remove the antecedent links of the new tail
            // from the list of tails
            link.antecedent.forEach(ancestor => {
                this.tails.remove(ancestor);
            });
            this.tails.add(link);
        });

        this.stagingArea.clear();
    }

    /**
     * Retrieve the events residing in the tail.
     * @returns {Set<Link<S, T>>}
     */
    public getTails(): Collections.Set<Link<S, T>> {
        return this.tails;
    }

    /**
     * Retrieve a string representation of the tail of this chain.
     * Ideal for visualising incremental progress.
     * @returns {string}
     */
    public toString(): string {
        let chain = "";
        this.tails.forEach(link => {
            chain += "[";
            link.antecedent.forEach(ancestor => {
                chain += `( ${ancestor}, ${ancestor.getEvent()}, effects:`;
                ancestor.effects.forEach(effect => {
                   chain += ` ${effect}`;
                });
                chain += ')';
            });
            chain += `] ==> ( causes:`;
            link.causes.forEach(cause => {
                chain += ` ${cause} `;
            });
            chain += `, ${link}, ${link.getEvent()}, effects:`;
            link.effects.forEach(effect => {
                chain += ` ${effect}`;
            });
            chain += `)\n`;
        });

        return chain;
    }
}

/**
 * A link in a causal chain, representing an event of type T,
 * with causes of type S and effects also of type S.
 *  TODO: At the moment, there is no recycling of identifiers,
 *  so this number will grow ad infinitum.
 */
export class Link<S, T> {

    private static counter: number = 0;
    private identifier: number;
    private ingress: Collections.Set<Link<S, T>>;
    private egress: Collections.Set<Link<S, T>>;

    /**
     * Create a new Link.
     * @param event
     * @param before
     * @param after
     */
    public constructor(private readonly event: T,
                       private readonly before: Immutable.Set<S>,
                       private readonly after: Immutable.Set<S>) {
        this.identifier = Link.counter;
        Link.counter++;
        this.ingress = new Collections.Set<Link<S, T>>();
        this.egress = new Collections.Set<Link<S, T>>();
    }

    /**
     * The causes.
     * @returns {Immutable.Set<S>}
     */
    public get causes(): Immutable.Set<S> {
        return this.before;
    }

    /**
     * The effects.
     * @returns {Immutable.Set<S>}
     */
    public get effects(): Immutable.Set<S> {
        return this.after;
    }

    /**
     * The causally antecedent links.
     * @returns {Set<Link<S, T>>}
     */
    public get antecedent(): Collections.Set<Link<S, T>> {
        return this.ingress;
    }

    /**
     * The causally incident links.
     * @returns {Set<Link<S, T>>}
     */
    public get incident(): Collections.Set<Link<S, T>> {
        return this.egress;
    }

    /**
     * Retrieve the event represented by this link.
     * @returns {T}
     */
    public getEvent(): T {
        return this.event;
    }

    /**
     * Link this chain to another chain,
     * which will then exhibit causal incidence.
     * Returns whether or not the act of linking was successful.
     * @param {Link<S, T>} other
     * @returns {boolean}
     */
    public linkTo(other: Link<S, T>): boolean {
        let reachable = false;
        this.effects.forEach(c => {
            if (c !== undefined && other.causes.contains(c)) {
                reachable = true;
            }
        });

        if (reachable) {
            this.incident.add(other);
            other.antecedent.add(this);
            return true;
        }

        return false;
    }

    /**
     * Find an ancestor of this link with an event identical to that of a given link.
     * Returns whether a similar ancestor was found.
     * @param {Link<S, T>} toMatch
     * @returns {boolean}
     */
    public hasSimilarAncestor(toMatch: Link<S, T>): boolean {
        let matchFound = false;
        this.antecedent.forEach(ancestor => {
            if (ancestor.getEvent() === toMatch.getEvent()) {
                matchFound = true;
                return;
            } else {
                matchFound = ancestor.hasSimilarAncestor(toMatch);
                if (matchFound) {
                    return;
                }
            }
        });

        return matchFound;
    }

    /**
     * Severs the connection between this link and an ancestor link.
     * Does nothing when the given link is not an ancestor of the current link.
     * @param {Link<S, T>} ancestor
     */
    public severLink(ancestor: Link<S, T>): void {
        ancestor.incident.remove(this);
        this.antecedent.remove(ancestor);
    }

    /**
     * Retrieve a string representation of this link.
     * Used simply to uniquely differentiate from other links.
     * @returns {string}
     */
    public toString(): string {
        return this.identifier.toString();
    }
}