export class ApiResponse<T> {
    public success: boolean;
    public data: T;
    public message?: string;

    constructor(data: T, message?: string) {
        this.success = true;
        this.data = data;
        if (message) {
            this.message = message;
        }
    }
}
