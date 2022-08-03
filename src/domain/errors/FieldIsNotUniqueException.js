export class FieldIsNotUniqueException extends Error {
  constructor() {
    super(`FieldIsNotUniqueException: Um dos campos informados precisa ser único`);
  }
}
