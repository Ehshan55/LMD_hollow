import { authenticatedFetch, getSessionToken } from "@shopify/app-bridge-utils";

/**
 * 
 * @returns Promise 
 */
const getAccessTokenFromShopify = (app) => {
    // let token = await getSessionToken(app)
    // return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2NvZGVjcnV4Lm15c2hvcGlmeS5jb20vYWRtaW4iLCJkZXN0IjoiaHR0cHM6Ly9jb2RlY3J1eC5teXNob3BpZnkuY29tIiwiYXVkIjoiMDgyZGM4Y2FjYzQ0Yzg5NTYzZWU0YzdlNTNjZWMxYzkiLCJzdWIiOiI2NzcxMTk1OTE5OSIsImV4cCI6MTYyNTY5NTE5MywibmJmIjoxNjI0Njk1MTMzLCJpYXQiOjE2MjQ2OTUxMzMsImp0aSI6ImMwNGRhM2Q2LTg3ODgtNDkyMy04MzkxLTBkNjc5NTg0ZmNjZCIsInNpZCI6ImRiNzRmOWI2ODg5ZDNlOTlmMWJmMThlZjlkMTFkNjQ1ZDNiY2RhMTllNmIwOWFjYjBjM2ZlMzEwNzlkNzE0MTAifQ.AiBgkDTWMA5zBfFgYXJOsyeXOW1G3hY2tafyvtpeAEs'
    return getSessionToken(app);
}

export default getAccessTokenFromShopify;