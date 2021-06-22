import axios from 'axios';
import { host,kyubi } from '../config';

const authService = {
    login: function (payload) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: process.kyubi.loginURL,
                headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: payload
            }
            axios(options)
                .then(res => {
                    console.log("In Success");
                    resolve(res)
                })
                .catch(err => {
                    console.log("In Error");
                    reject(err)
                })
        })
    },
    userRetrive: function    (payload)   {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: process.kyubi.appBaseBackendUrl + '/api/user/userRetrive',
                headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: payload
            }
            axios(options)
                .then(res => {
                    console.log("In Success");
                    resolve(res)
                })
                .catch(err => {
                    console.log("In Error");
                    reject(err)
                })
        })
    },
    forgotPassword: function (payload) {
        return new Promise((resolve, reject) => {
            console.log(payload);
            let options = {
                method: 'POST',
                mode: "cors", // no-cors, cors, *same-origin
                url: process.kyubi.forgotPassURL,
                headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: JSON.stringify(payload)
            }
            axios(options)
                .then(res => {
                    console.log("In Success");
                    resolve(res)
                })
                .catch(err => {
                    console.log("Error In Forgot Password");
                    reject(err)
                })
        })

    }
    
}

export default authService