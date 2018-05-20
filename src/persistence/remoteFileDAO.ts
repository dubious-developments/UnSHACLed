import {DataAccessObject} from "./dataAccessObject";
import {ModelComponent, ModelTaskMetadata} from "../entities/modelTaskMetadata";
import {LoadTask, LoadWorkspaceTask, LocalFileModule} from "./localFileDAO";
import {Model} from "../entities/model";
import * as Collections from "typescript-collections";
import {GraphParser} from "./graphParser";
import {WorkspaceParser} from "./workspaceParser";
import {Graph, ImmutableGraph} from "./graph";
import {ModelData} from "../entities/modelData";
import {Task} from "../entities/task";
import {Component} from "./component";
import RequestModule from "../requests/RequestModule";
import PollingService from "../services/PollingService";

/**
 * Provides basic DAO functionality for accessing/altering remote files.
 */
export class RemoteFileDAO implements DataAccessObject {

    private model: Model;
    private parsers: Collections.Dictionary<ModelComponent, Parser<any>>;

    /**
     * Create a new RemoteFileDAO.
     * @param {Model} model
     */
    public constructor(model: Model) {
        this.model = model;
        this.parsers = new Collections.Dictionary<ModelComponent, Parser<any>>();

        // register parsers
        this.registerParser(ModelComponent.DataGraph, new GraphParser());
        this.registerParser(ModelComponent.SHACLShapesGraph, new GraphParser());
        this.registerParser(ModelComponent.Workspace, new WorkspaceParser());
    }

    /**
     * Register a parser with this DAO.
     * @param {ModelComponent} label
     * @param {Parser<Graph>} parser
     */
    public registerParser(label: ModelComponent, parser: Parser<any>) {
        this.parsers.setValue(label, parser);
    }

    /**
     * Retrieve the parsers associated with this DAO.
     * @returns {Dictionary<ModelComponent, Parser<any>>}
     */
    public getParsers(): Collections.Dictionary<ModelComponent, Parser<any>> {
        return this.parsers;
    }

    /**
     * Start listening for remote changes.
     * @param {string} username
     * @param reponame
     * @param token
     */
    public start(username: string, reponame: string, token: string) {
        let self = this;
        let service = new PollingService(2000, function () {
            RequestModule.getFilesFromRepo(username, reponame, token).then(files => {
                files.forEach(file => {
                    RequestModule.pollForChanges(username, reponame, token, file).then(changes => {
                        if (changes.isModified) {
                            // TODO: atm everything is put inside the DataGraph component!!!
                            // Need a way to get this information from the server...
                            self.find(new RemoteFileModule(ModelComponent.DataGraph, username, file, reponame, token));
                        }
                    });
                });
            });
        });
        service.startPolling();
    }

    /**
     * Create a new remote file.
     * @param {RemoteFileModule} module
     */
    public insert(module: RemoteFileModule): void {
        let parser = this.parsers.getValue(module.getTarget());
        if (parser && parser instanceof GraphParser) {
            this.model.tasks.schedule(new SaveTask(parser, module));
            this.model.tasks.processAllTasks();
        }
    }

    /**
     * Create a new remote file containing the current workspace.
     * @param {RemoteFileModule} module
     */
    public insertWorkspace(module: RemoteFileModule): void {
        let parser = this.parsers.getValue(ModelComponent.Workspace);
        if (parser && parser instanceof WorkspaceParser) {
            this.model.tasks.schedule(new SaveWorkspaceTask(parser, module));
            this.model.tasks.processAllTasks();
        }
    }

    /**
     * Load an existing remote file.
     * @param {RemoteFileModule} module
     */
    public find(module: RemoteFileModule): void {
        let self = this;
        RequestModule.readFile(module.getUserName(),
            module.getRepoName(),
            module.getToken(),
            module.getIdentifier())
            .then(content => {
                let parser = this.parsers.getValue(module.getTarget());
                if (parser) {
                    parser.parse(content, module.getMime(), function (result: Graph) {
                        self.model.tasks.schedule(new LoadTask(result.asImmutable(), module));
                        self.model.tasks.processAllTasks();
                    });
                }
            });
    }

    /**
     * Load the workspace from a remote file.
     * @param {RemoteFileModule} module
     */
    public findWorkspace(module: RemoteFileModule): void {
        let self = this;
        RequestModule.fetchWorkspace(module.getToken())
            .then(workspace => {
                let parser = this.parsers.getValue(ModelComponent.Workspace);
                if (parser) {
                    parser.parse(workspace, "application/json", function (result: ModelData) {
                        self.model.tasks.schedule(new LoadWorkspaceTask(result));
                        self.model.tasks.processAllTasks();
                    });
                }
            });
    }
}

/**
 * A directive for accessing a remote file.
 */
export class RemoteFileModule extends LocalFileModule {

    private username: string;
    private reponame: string;
    private token: string;

    /**
     * Create a new RemoteFileModule.
     * @param {ModelComponent} target
     * @param {string} username
     * @param {string} filename
     * @param {string} repo
     * @param {string} token
     */
    public constructor(target: ModelComponent,
                       username: string, filename: string, reponame: string,
                       token: string) {
        super(target, filename, new Blob([]));
        this.username = username;
        this.reponame = reponame;
        this.token = token;
    }

    /**
     * Return the user name of the account used for remote access.
     * @returns {string}
     */
    public getUserName(): string {
        return this.username;
    }

    /**
     * Return the repository that is to be the database for remote access.
     * @returns {string}
     */
    public getRepoName(): string {
        return this.reponame;
    }

    /**
     * Return the token used for authentication/authorization during remote access.
     * @returns {string}
     */
    public getToken(): string {
        return this.token;
    }
}

/**
 * A Task that retrieves a component from the Model and writes its contents to a remote file.
 */
class SaveTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new SaveTask.
     * @param parser
     * @param {RemoteFileModule} module
     */
    public constructor(private readonly parser: GraphParser,
                       private readonly module: RemoteFileModule) {
        super();
    }

    /**
     * Executes this task.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {
        let component = data.getOrCreateComponent<Component<ImmutableGraph>>(
            this.module.getTarget(),
            () => new Component<ImmutableGraph>());

        let part = component.getPart(this.module.getIdentifier());
        if (!part) {
            part = new Graph().asImmutable();
            component.withPart(this.module.getTarget(), part);
            data.setComponent(this.module.getTarget(), component);
        }

        let self = this;
        this.parser.serialize(part.toMutable(), this.module.getMime(), function (result: string) {
            RequestModule.updateFile(
                self.module.getUserName(),
                self.module.getRepoName(),
                self.module.getToken(),
                self.module.getIdentifier(),
                result);
        });
    }

    /**
     * Gets the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata(
            [this.module.getTarget(), ModelComponent.IO],
            [this.module.getTarget(), ModelComponent.IO]);
    }
}

/**
 * A task that saves the workspace to a remote file.
 */
class SaveWorkspaceTask extends Task<ModelData, ModelTaskMetadata> {

    /**
     * Create a new SaveWorkspaceTask.
     */
    public constructor(private readonly parser: WorkspaceParser,
                       private readonly module: RemoteFileModule) {
        super();
    }

    /**
     * Executes this task.
     * @param data The data the task takes as input.
     */
    public execute(data: ModelData): void {
        let self = this;
        this.parser.serialize(data, "application/json", function (result: string) {
            RequestModule.setWorkspace(self.module.getToken(), result);
        });
    }

    /**
     * Gets the metadata for this task.
     */
    public get metadata(): ModelTaskMetadata {
        return new ModelTaskMetadata([ModelComponent.SHACLShapesGraph, ModelComponent.DataGraph, ModelComponent.IO],
            [ModelComponent.SHACLShapesGraph, ModelComponent.DataGraph, ModelComponent.IO]);
    }

}