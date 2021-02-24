export class ReplyUtils {

  /**
   * Create a JSON error response.
   */
  static error(msg: string, error?: Error): string {
    return `{"error": "${msg}"${error ? `,"errorObject": ${JSON.stringify(error)}` : ``}}`;
  }

  /**
   * Create a JSON error response.
   */
  static errorOnly(error: Error): string {
    return `{"error": "${error.message}"${error ? `,"errorObject": ${JSON.stringify(error)}` : ``}}`;
  }

  static success(msg: string) {
    return `{"message": "${msg}"}`;
  }
}
