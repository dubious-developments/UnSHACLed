import * as Immutable from "immutable";
import {CausalChain} from "../src/entities/causalChain";
import {ModelComponent} from "../src/entities/modelTaskMetadata";

describe("CausalChain Class", () => {
    it("should avoid loops.",
        () => {
            let chain = new CausalChain<ModelComponent, number>();

            let incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            let outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            expect(chain.stage(1, incoming, outgoing)).toEqual(false);
            expect(chain.getTails().size()).toEqual(0);
            console.log(chain.toString());
            chain.finalize();
            console.log(chain.toString());
            expect(chain.getTails().size()).toEqual(1);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            expect(chain.stage(2, incoming, outgoing)).toEqual(false);
            expect(chain.getTails().size()).toEqual(1);
            console.log(chain.toString());
            chain.finalize();
            console.log(chain.toString());
            expect(chain.getTails().size()).toEqual(1);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.SHACLShapesGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            expect(chain.stage(3, incoming, outgoing)).toEqual(false);
            expect(chain.getTails().size()).toEqual(1);
            console.log(chain.toString());
            chain.finalize();
            console.log(chain.toString());
            expect(chain.getTails().size()).toEqual(1);

            incoming = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            outgoing = Immutable.Set<ModelComponent>([ModelComponent.DataGraph]);
            expect(chain.stage(1, incoming, outgoing)).toEqual(true);
            expect(chain.getTails().size()).toEqual(1);
            console.log(chain.toString());
            chain.finalize();
            console.log(chain.toString());
            expect(chain.getTails().size()).toEqual(0);
        });
});
