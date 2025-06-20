import {
    DataformClient,
    protos,
} from '@google-cloud/dataform';


export class DataformService {
    private readonly client: DataformClient;
    private readonly projectId: string;
    private readonly location: string;

    constructor(private configService?: any) {
        this.projectId = 'pessoal-312700';
        this.location = 'us-central1';
        this.client = new DataformClient();
    }

    /**
     * Creates a new file in the specified Dataform repository.
     *
     * @param createFileRequest - The request object containing repository ID, file path, and file contents.
     * @returns A promise that resolves when the file is created.
     */
    async createFile(createFileRequest: any): Promise<boolean> {
        const { repositoryId, filePath, fileContents, workspaces } = createFileRequest;
        try {
            const parent = `projects/${this.projectId}/locations/${this.location}/repositories/${repositoryId}/workspaces/${workspaces}`;
            const request: protos.google.cloud.dataform.v1beta1.IWriteFileRequest = {
                workspace: parent,
                path: filePath,
                contents: Buffer.from(fileContents, 'utf-8'),
            };

            await this.client.writeFile(request);
            console.info(`File created: ${filePath}`);
            return true;
        } catch (error) {
            console.error(`Error creating file: ${filePath}`, error);
            return false;
        }

    }


    async fetchFileGitStatuses(repositoryId: string, workspaces: string): Promise<any> {
        const name = `projects/${this.projectId}/locations/${this.location}/repositories/${repositoryId}/workspaces/${workspaces}`;

        const request = {
            name,
        };

        // Run request
        const response = await this.client.fetchFileGitStatuses(request);

        // 1. Extrair a lista de mudanças
        const fileChanges = response[0]?.uncommittedFileChanges || [];

        // 2. Verificar se há algum conflito
        const hasConflicts = fileChanges.some(response => response.state === "HAS_CONFLICTS");
        if (hasConflicts) {
            console.warn(`Repository ${repositoryId} has conflicts in uncommitted file changes.`);
        } else {
            console.info(`Repository ${repositoryId} has no conflicts in uncommitted file changes.`);
        }
        return !hasConflicts;
    }


    async commitRepositoryChanges(commitChangesRequest: any): Promise<boolean> {
        const { repositoryId, filePath, fileContents } = commitChangesRequest;
        try {

            const name = `projects/${this.projectId}/locations/${this.location}/repositories/${repositoryId}/workspaces/autoDeploy`;

            // const request: protos.google.cloud.dataform.v1beta1.ICommitChangesRequest = {
            //     workspace: name,
            //     commitMessage: commitChangesRequest.commitMessage,
            // };

            const response = await this.client.commitRepositoryChanges(commitChangesRequest);
            return true;

        } catch (error) {
            console.error(`Error committing changes to repository: ${repositoryId}`, error);
            return false;
        }

        //         const { repositoryId, commitMessage } = commitChangesRequest;
        //         const parent = `projects/${this.projectId}/locations/${this.location}/repositories/${repositoryId}/workspaces/autoDeploy`;
        //         const request: protos.google.cloud.dataform.v1beta1.ICommitChangesRequest = {
        //             workspace: parent,
        //             commitMessage,
        //         };

        //         await this.client.commitChanges(request);
        //         console.log(`Changes committed with message: ${commitMessage}`);
        //     }
        // )
    }


}