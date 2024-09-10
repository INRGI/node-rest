const messageList: {[key: number]: string} = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
}

const HttpError = (status: number, message: string = messageList[status]):Error & {status?: number} => {
    const error = new Error(message) as Error & {status?: number};
    error.status = status;
    return error;
}

export default HttpError;