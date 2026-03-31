/**
 * Envelope genérico para todas las respuestas de la API.
 * Garantiza un contrato uniforme para el cliente Android.
 */
export class ApiResponseDto<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T, message = 'OK'): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  static fail(message: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, message, null);
  }
}
