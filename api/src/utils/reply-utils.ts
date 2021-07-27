export class ReplyUtils {

  /**
   * Create a JSON error response.
   */
  static error(msg: string, error?: Error): { error: string, errorObject: Error | undefined } {
    return {
      error: `${msg}`,
      errorObject: error ? error : undefined
    };
  }

  /**
   * Create a JSON error response.
   */
  static errorOnly(error: Error): { error: string, errorObject: Error | undefined } {
    return {
      error: `${error.message}`,
      errorObject: error ? error : undefined
    };
  }

  static success(msg: string) {
    return {
      message: msg
    };
  }
}
