export class ReplyUtils {

  /**
   * Cheaply create a JSON error response.
   */
  static error(msg: string, error?: Error): string {
    return `{"error": "${msg}"${error ? `,"errorObject": ${JSON.stringify(error)}` : ``}}`;
  }

  static success(msg: string) {
    return `{"message": "${msg}"}`;
  }
}
