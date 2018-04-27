import * as Immutable from "immutable";
import {CausalChain, Link} from "../src/entities/causalChain";
import {ModelComponent} from "../src/entities/modelTaskMetadata";

describe("CausalChain Class", () => {
    it("should avoid loops.",
        () => {
            let chain = new CausalChain<ModelComponent, number>();

            let incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            expect(chain.stage(1, incoming, outgoing)).toEqual(false);
            expect(chain.getTails().size()).toEqual(0);
            chain.finalize();
            expect(chain.getTails().size()).toEqual(1);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            expect(chain.stage(2, incoming, outgoing)).toEqual(false);
            expect(chain.getTails().size()).toEqual(1);
            chain.finalize();
            expect(chain.getTails().size()).toEqual(1);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            expect(chain.stage(3, incoming, outgoing)).toEqual(false);
            expect(chain.getTails().size()).toEqual(1);
            chain.finalize();
            expect(chain.getTails().size()).toEqual(1);

            // at this point a loop should be detected
            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            expect(chain.stage(1, incoming, outgoing)).toEqual(true);
            expect(chain.getTails().size()).toEqual(1);
            chain.finalize();
            expect(chain.getTails().size()).toEqual(0);

            // in the next time step the same event that caused a loop
            // should be again addable
            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            expect(chain.stage(1, incoming, outgoing)).toEqual(false);
            expect(chain.getTails().size()).toEqual(0);
            chain.finalize();
            expect(chain.getTails().size()).toEqual(1);

            // a break in causality should also cause a reset
            chain.finalize();
            expect(chain.getTails().size()).toEqual(0);
        });
});

describe("Link Class", () => {
    it("can be created.",
        () => {
            let link = new Link<ModelComponent, number>(1, Immutable.Set([ModelComponent.DataGraph]),
                Immutable.Set([ModelComponent.SHACLShapesGraph]));

            expect(link.causes.contains(ModelComponent.DataGraph)).toBe(true);
            expect(link.effects.contains(ModelComponent.SHACLShapesGraph)).toBe(true);
            expect(link.getEvent()).toBe(1);
            expect(link.antecedent.isEmpty()).toBe(true);
            expect(link.incident.isEmpty()).toBe(true);
        });

    it("can link correctly.",
        () => {
            let link = new Link<ModelComponent, number>(1, Immutable.Set([ModelComponent.DataGraph]),
                Immutable.Set([ModelComponent.SHACLShapesGraph]));

            let canBeLinked = new Link<ModelComponent, number>(1, Immutable.Set([ModelComponent.SHACLShapesGraph]),
                Immutable.Set([ModelComponent.IO]));

            let cannotBeLinked = new Link<ModelComponent, number>(1, Immutable.Set([ModelComponent.DataGraph]),
                Immutable.Set([ModelComponent.IO]));

            expect(link.linkTo(canBeLinked)).toBe(true);
            expect(link.linkTo(cannotBeLinked)).toBe(false);

            expect(link.incident.size()).toBe(1);
            expect(link.incident.contains(canBeLinked)).toBe(true);
            expect(canBeLinked.antecedent.size()).toBe(1);
            expect(canBeLinked.antecedent.contains(link)).toBe(true);
            expect(cannotBeLinked.antecedent.size()).toBe(0);
            expect(cannotBeLinked.antecedent.contains(link)).toBe(false);
        });

    it("can detect similar ancestors.",
        () => {
            let incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let link1 = new Link<ModelComponent, number>(1, incoming, outgoing);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            let link2 = new Link<ModelComponent, number>(2, incoming, outgoing);
            link1.linkTo(link2);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let link3 = new Link<ModelComponent, number>(3, incoming, outgoing);
            link2.linkTo(link3);

            expect(link3.hasSimilarAncestor(link3)).toBe(undefined);
            expect(link3.hasSimilarAncestor(link1)).toBe(link1);
        });

    it("can be severed up to a given point.",
        () => {
            let incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let link1 = new Link<ModelComponent, number>(1, incoming, outgoing);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            let link2 = new Link<ModelComponent, number>(2, incoming, outgoing);
            link1.linkTo(link2);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let link3 = new Link<ModelComponent, number>(3, incoming, outgoing);
            link2.linkTo(link3);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.IO]);
            let link4 = new Link<ModelComponent, number>(4, incoming, outgoing);
            link1.linkTo(link4);

            link3.severLinks(link1);

            expect(link1.incident.contains(link2)).toBe(false);
            expect(link2.antecedent.contains(link1)).toBe(false);

            expect(link1.incident.contains(link4)).toBe(true);
            expect(link4.antecedent.contains(link1)).toBe(true);

            expect(link2.incident.contains(link3)).toBe(false);
            expect(link3.antecedent.contains(link2)).toBe(false);

            link4.severLinks(link1);

            expect(link1.incident.contains(link4)).toBe(false);
            expect(link4.antecedent.contains(link1)).toBe(false);

            link1.linkTo(link2);
            link2.linkTo(link3);

            // should sever up to link 1, as link 1 has no meaning at this point
            link3.severLinks(link2);

            expect(link1.incident.contains(link2)).toBe(false);
            expect(link2.antecedent.contains(link1)).toBe(false);

            expect(link2.incident.contains(link3)).toBe(false);
            expect(link3.antecedent.contains(link2)).toBe(false);
        });

    it("can be severed as far as possible.",
        () => {
            let incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let link1 = new Link<ModelComponent, number>(1, incoming, outgoing);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            let link2 = new Link<ModelComponent, number>(2, incoming, outgoing);
            link1.linkTo(link2);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let link3 = new Link<ModelComponent, number>(3, incoming, outgoing);
            link2.linkTo(link3);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.IO]);
            let link4 = new Link<ModelComponent, number>(4, incoming, outgoing);
            link1.linkTo(link4);

            link3.severLinks();

            expect(link1.incident.contains(link2)).toBe(false);
            expect(link2.antecedent.contains(link1)).toBe(false);

            expect(link1.incident.contains(link4)).toBe(true);
            expect(link4.antecedent.contains(link1)).toBe(true);

            expect(link2.incident.contains(link3)).toBe(false);
            expect(link3.antecedent.contains(link2)).toBe(false);
        });

    it("can sever individual ancestral ties.",
        () => {
            let incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let link1 = new Link<ModelComponent, number>(1, incoming, outgoing);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            let link2 = new Link<ModelComponent, number>(2, incoming, outgoing);
            link1.linkTo(link2);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let link3 = new Link<ModelComponent, number>(3, incoming, outgoing);
            link2.linkTo(link3);

            link2.severLink(link1);

            expect(link1.incident.contains(link2)).toBe(false);
            expect(link2.antecedent.contains(link1)).toBe(false);

            // as link3 is not an ancestor of link2,
            // this should have no effect
            link2.severLink(link3);

            expect(link2.incident.contains(link3)).toBe(true);
            expect(link3.antecedent.contains(link2)).toBe(true);
        });
});