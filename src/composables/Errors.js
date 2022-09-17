export function DetectErrorStatusCode(error) {
    let e = error;
    switch (error) {
        case error.response:
            e = error.response.data;                   // data, status, headers
            if (error.response.data && error.response.data.error) {
                e = error.response.data.error;           // my app specific keys override
            }
            break;
        case error.response:
            e = error.message;
            break;
        default:
            e = "Произошла неизвестная ошибка";
    }
    return e;
}
