export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    mensaje: string,
  ) {
    super(mensaje);
  }
}