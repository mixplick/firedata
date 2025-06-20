
/**
 * Represents an event occurring in Firestore.
 *
 * @property id - The unique identifier of the event.
 * @property type - The type of the event (e.g., 'create', 'update', 'delete').
 * @property database - The name or identifier of the Firestore database.
 * @property document - The path or identifier of the affected document.
 * @property collection - The name or path of the collection containing the document.
 */
export interface IFirestoreEvent {
    id: string;
    type: string;
    database: string;
    document: string;
    collection: string;
}

/**
 * Represents a workspace within a repository, including its project, location, repository, and workspace identifiers.
 *
 * @property project - The name or identifier of the project.
 * @property location - The geographical or logical location of the workspace.
 * @property repository - The name or identifier of the repository.
 * @property workspace - The name or identifier of the workspace.
 */
export interface IWorkspace {
    project: string;
    location: string;
    repository: string;
    workspace: string;
}