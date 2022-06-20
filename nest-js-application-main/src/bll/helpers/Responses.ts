import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';

type IBaseResponse = {
  statusCode: number;
  statusMessage: string;
};

type IBaseResponseWithMessage = IBaseResponse & {
  message: string;
}

type DataResponse<T> = IBaseResponse & {
  data: T;
};

export class Responses {
  public static statusOkWithoutData(): IBaseResponse {
    return {
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
    };
  }

  public static statusOkWithData<T>(data: T): DataResponse<T> {
    return {
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: data,
    };
  }

  public static statusAny(
    statusCode: StatusCodes,
    statusMessage: ReasonPhrases,
  ): IBaseResponse {
    return {
      statusCode: statusCode as unknown as number,
      statusMessage: statusMessage,
    };
  }

  public static statusAnyWithMessage(
    statusCode: StatusCodes,
    statusMessage: ReasonPhrases,
    message: string,
  ): IBaseResponseWithMessage {
    return {
      statusCode: statusCode as unknown as number,
      statusMessage: statusMessage,
      message,
    };
  }
}
