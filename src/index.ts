import * as functions from '@google-cloud/functions-framework';
import { FirestoreService } from './firestore-service.js';
import { DataformService } from './dataform-service.js';
const dfService = new DataformService();

/**
 * Cloud Function that triggers on Firestore events.
 *
 * @remarks
 * This function listens for changes in Firestore documents and processes them accordingly.
 *
 * @example
 * ```typescript
 * functions.cloudEvent('init', async (cloudEvent) => {
 *   // Your processing logic here
 * });
 * ```
 *
 * @see {@link https://cloud.google.com/functions/docs/writing/typescript}
 */
functions.cloudEvent('init', async (cloudEvent: any): Promise<any> => {
  try {
    const id: string = cloudEvent.id;
    const type: string = cloudEvent.type;
    const database: string = cloudEvent.database;
    const documentSrc: string = cloudEvent.document;
    const collection: string = documentSrc ? documentSrc.split('/')[0] : '';
    const document: string = documentSrc ? documentSrc.split('/')[1] : '';

    console.log(`Received event: ${JSON.stringify({ id, type, database, collection, document })}`);


    /**
     * Instance of the FirestoreService configured with the specified project and database IDs.
     *
     * @remarks
     * This instance connects to the Firestore database using the provided `projectId` and `databaseId`.
     *
     * @example
     * ```typescript
     * const db = new FirestoreService({
     *   projectId: 'your-project-id',
     *   databaseId: 'your-database-id',
     * });
     * ```
     */
    const db = new FirestoreService({
      projectId: 'projectId',
      databaseId: database, // Use o ID do banco de dados padrão
    });

    /**
     * Reads a document from Firestore.
     *
     * @remarks
     * This method reads a document from Firestore based on the provided parameters.
     * It returns the document data if found, or logs an error if not.
     *
     * @param document - The document to read, containing id, type, database, collection, and document fields.
     * @returns A promise that resolves to the document data or undefined if not found.
     * @throws Error - Throws an error if there is an issue reading the document from Firestore.
     *
     * @example
     * ```typescript
     * const tableConfigData = await db.readDocument({
     *   id: 'some-id',
     *   type: 'some-type',
     *   database: 'your-database-id',
     *   collection: 'your-collection-name',
     *   document: 'your-document-id',
     * });
     * ```
     */
    const tableConfigData = await db.readDocument({ id, type, database, collection, document });

    console.info(tableConfigData);

    // precisa fazer primeiro um pull para garantir que o repositório esteja atualizado
    // se houver conflitos, não faz nada
    // se não houver conflitos, cria o arquivo
    // apos criar o arquivo, faz um commit para o repositório por ultimo faz um push para o repositório remoto.

    const hasConflicts = await dfService.fetchFileGitStatuses('teste', 'autoDeploy');
    if (!hasConflicts) return;

    await dfService.createFile({
      repositoryId: 'teste',
      filePath: `includes/${document}.json`,
      fileContents: JSON.stringify(tableConfigData, null, 2),
      workspaces: 'autoDeploy',
    });


  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
  }
});
