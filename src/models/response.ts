export class ResponseModel {
    error: boolean;
    message: string;
    data: any;

    constructor(error: boolean, message: string, data: any) {
        this.error = error;
        this.message = message;
        this.data = data;
    }

    static error(message: string): ResponseModel {
        return new ResponseModel(true, message, null);
    }

    static success(data: any) {
        return new ResponseModel(false, "success", data);
    }
}