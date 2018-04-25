import * as Collections from "typescript-collections";
import * as Immutable from "immutable";
import {ModelComponent} from "./modelTaskMetadata";

/**
 * A causal chain is complex interconnection of links. Each link has a number of
 * incoming links and a number of outgoing links. The chain keeps track of causal relations
 * between entities of type T. By keeping track of these causal relationships, loops can be
 * avoided, i.e. entities causing themselves to reoccur, thereby potentially creating an
 * infinite loop of recurrence.
 *
 * Adding new entities to the causal chain occurs in two phases. First, we try to
 * introduce the entity into the staging area. This is where we check for potential
 * periodicity. After a given round (a time step in the causal chain), all staged entities
 * are integrated into the chain. At this point we also check whether there has been a break in
 * causality for any of the entities at the tail of the chain. If so, then all paths leading to
 * these entities must be severed.
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
     * Stage an entity for integration into the chain.
     * Returns whether or not the entity can be integrated.
     * @param {T} node
     * @param {Immutable.Set<ModelComponent>} incoming
     * @param {Immutable.Set<ModelComponent>} outgoing
     * @returns {boolean}
     */
    public stage(node: T,
               incoming: Immutable.Set<S>,
               outgoing: Immutable.Set<S>): boolean {

        let periodic = false;
        let newLink = new Link<S, T>(node, incoming, outgoing);
        // try to find a link to connect with from among the tails
        this.tails.forEach(link => {
            if (link) {
                let success = link.linkTo(newLink);
                if (success) {
                    console.log(link.getEntity() + " will be linked to " + newLink.getEntity());
                    let ancestor;
                    if (ancestor = newLink.hasSimilarAncestor(newLink)) {
                        console.log("Similar ancestor found.");
                        // if periodicity is detected, sever the link
                        newLink.sever(ancestor);
                        periodic = periodic || true;
                    } else {
                        periodic = periodic || false;
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
     * Fully integrate the staged entities into the chain, thereby
     * updating the tails and clearing the staging area for the
     * next integration round.
     */
    public finalize(): void {
        let forRemoval = new Collections.Set<Link<S, T>>();
        this.tails.forEach(link => {
            // there has been a break in the causality
            // so this link needs to be severed
            // as far as we can
            if (link.following.isEmpty()) {
                link.sever();
                forRemoval.add(link);
            }
        });

        forRemoval.forEach(toBeRemoved => {
            this.tails.remove(toBeRemoved);
        });

        this.stagingArea.forEach(link => {
            // make sure that the newly added tail is in fact a tail
            link.preceding.forEach(ancestor => {
                console.log("ancestor " + ancestor.getEntity() + " will be removed.");
                this.tails.remove(ancestor);
            });
            console.log(link.getEntity() + " is a new tail.");
            this.tails.add(link);
        });

        this.stagingArea.clear();
    }

    /**
     * Retrieve the entities residing in the tail.
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
            link.preceding.forEach(ancestor => {
                chain += "(" + ancestor.toString() + ", " + ancestor.getEntity() + ")";
            });
            chain += "] => (";
            chain += link.toString() + ", " + link.getEntity();
            chain += ")\n";
        });

        return chain;
    }
}

/**
 * A link in a causal chain, representing an entity of type T,
 * caused by events of type S and causing events also of type S.
 */
export class Link<S, T> {

    private static counter: number = 0;
    private identifier: number;
    private previous: Collections.Set<Link<S, T>>;
    private next: Collections.Set<Link<S, T>>;

    /**
     * Create a new Link.
     * @param {T} entity
     * @param {Immutable.Set<S>} ingress
     * @param {Immutable.Set<S>} egress
     */
    public constructor(private readonly entity: T,
                       private readonly ingress: Immutable.Set<S>,
                       private readonly egress: Immutable.Set<S>) {
        this.identifier = Link.counter;
        Link.counter++;
        this.previous = new Collections.Set<Link<S, T>>();
        this.next = new Collections.Set<Link<S, T>>();
    }

    /**
     * The causes.
     * @returns {Immutable.Set<S>}
     */
    public get incoming(): Immutable.Set<S> {
        return this.ingress;
    }

    /**
     * The effects.
     * @returns {Immutable.Set<S>}
     */
    public get outgoing(): Immutable.Set<S> {
        return this.egress;
    }

    /**
     * The causally antecedent links.
     * @returns {Set<Link<S, T>>}
     */
    public get preceding(): Collections.Set<Link<S, T>> {
        return this.previous;
    }

    /**
     * The incident links.
     * @returns {Set<Link<S, T>>}
     */
    public get following(): Collections.Set<Link<S, T>> {
        return this.next;
    }

    /**
     * Retrieve the entity represented by this chain.
     * @returns {T}
     */
    public getEntity(): T {
        return this.entity;
    }

    /**
     * Link this chain to another chain,
     * which will then exhibit causal incidence.
     * Returns whether or not the linking was successful.
     * @param {Link<S, T>} other
     * @returns {boolean}
     */
    public linkTo(other: Link<S, T>): boolean {
        let reachable = false;
        this.outgoing.forEach(c => {
            if (c !== undefined && other.incoming.contains(c)) {
                reachable = true;
            }
        });

        if (reachable) {
            this.next.add(other);
            other.previous.add(this);
            return true;
        }

        return false;
    }

    /**
     * Find an ancestor of this link with an entity similar to that of a given link.
     * Returns the found ancestor, if possible.
     * @param {Link<S, T>} toMatch
     * @returns {Link<S, T> | undefined}
     */
    public hasSimilarAncestor(toMatch: Link<S, T>): Link<S, T> | undefined {
        if (this.getEntity() === toMatch.getEntity() && this.identifier !== toMatch.identifier) {
            return this;
        }

        let match;
        this.preceding.forEach(link => {
            match = link.hasSimilarAncestor(toMatch);
            if (match) {
                return;
            }
        });

        return match;
    }

    /**
     * Sever the current link up to a given link.
     * If there is no stopping point, then we sever as much as possible.
     * @param {Link<S, T>} upTo
     */
    public sever(upTo?: Link<S, T>): void {
        this.preceding.forEach(ancestor => {
            ancestor.following.remove(this);
            // if ancestor is reachable from severance origin,
            // then continue severance along that path
            if (upTo !== undefined) {
                if (ancestor.hasSimilarAncestor(upTo)) {
                    ancestor.sever(upTo);
                }
            } else {
                ancestor.sever(); // sever as much as possible
            }
        });
    }

    /**
     * Retrieve a string representation of this link.
     * Used simply to uniquely differentiate from other links.
     * @returns {string}
     */
    public toString(): string {
        return "" + this.identifier;
    }
}