'use strict';
// assigning env variable as per public or private access
let BASE_URL_ENDPOINT = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

const enviornment = {
    API_CLIENT: {
        URL: BASE_URL_ENDPOINT
    }
}
module.exports = {
    enviornment
}