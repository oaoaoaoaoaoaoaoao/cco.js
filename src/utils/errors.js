class APIError extends Error {
	
    constructor(params) {
        super(params.msg)
        this.code = params.code;
        this.msg = params.msg;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { APIError }