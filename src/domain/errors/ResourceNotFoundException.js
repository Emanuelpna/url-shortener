export class ResourceNotFoundException extends Error {
  constructor() {
    super("ResourceNotFoundException: Recurso não encontrado");
  }
}
