import type {ErrorInterface} from "@/lib/error/index.ts";

export class HttpError extends Error implements ErrorInterface {
  type: string = "HttpError";
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
