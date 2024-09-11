export class ErrorObject extends Error {
    public statusCode: number;
    public status: string;
    public operational: boolean;

    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? "fail" : "error";
      this.operational = true;

      Error.captureStackTrace(this, this.constructor);
    }
  }
