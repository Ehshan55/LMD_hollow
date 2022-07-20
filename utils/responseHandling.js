"use strict";


let sendErrorResponse = ({res, statusCode = 500, error}) => {
    let errorMsg = error;
    if(error && error.response && error.response.body) {
        errorMsg = error.response.body;
        if(errorMsg.errors) {
            errorMsg = errorMsg.errors;
        }
    }

    return res.status(statusCode).send({msg: errorMsg});
}

const responseHandler = ({res, status=200, data=null, message= 'success'}) => {
    res.status(status).send({data, message});
}


const errorHandler = (err, req, res, next) => {
    let errors = [];
    let status = 500;
    console.log(err);
    // console.log(err.constructor.name);
    if(err) {
        switch(err.constructor.name) {
            // express-validator
            case 'Result':
                errors = err.array().map(e => {
                    return {message: e.msg, field: e.param}
                });
                status = err.code || 400;
                break;
            // sendgrid
            case 'ResponseError':
                errors = err.response.body.errors.map(e => {
                    return {message: e.message}
                })
                status = err.code || 422;
                break;
            case 'String':
                errors = [{message: err || 'An error occured'}]
                status = err.code || 500;
                break;
            default:
                status = err.code || 500;
                errors = [{message: err.message || 'An error occured'}]
                break;
        }
    }
    res.status(status).send(errors);
}


module.exports = {
    sendErrorResponse,
    responseHandler,
    errorHandler
}