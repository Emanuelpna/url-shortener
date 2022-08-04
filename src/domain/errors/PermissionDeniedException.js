export class PermissionDeniedException extends Error {
  constructor() {
    super(
      "PermissionDeniedException: Você não tem permissão para acessar esse recurso"
    );
  }
}
