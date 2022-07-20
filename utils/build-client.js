import axios from 'axios';
const config = require('../config');

// axios.defaults.withCredentials = true;

const buildClient = ({ req = {} }) => {
    // axios.post('http://localhost:8000/api/v1/user/login');
    if (typeof window === 'undefined') {
        console.log('on server');
        // We are on the server
        return axios.create({
            baseURL: `${config.APP_URL}/api/v1`,
            // baseURL: 'http://localhost:8000/api/v1',
            // withCredentials: true,
            headers: req.headers,
        });
    } else {
        console.log('on browser');
        // We must be on the browser
        // console.log({baseUrl: 'http://localhost:8000'})
        return axios.create({
            // baseURL: 'http://localhost:8000/api/v1',  // or /
            baseURL: '/api/v1',
            // do not pass headers or CORS issue will occur
            // headers: {
            //     'x-access-token': getCookie('s_access_token')
            // },
            // withCredentials: true
        });
    }
};

export default buildClient;