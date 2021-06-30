import axios from 'axios';
import { host,kyubi } from '../config';

const autoResponderServices = {
    createAutoResponder: function (payload) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: process.kyubi.appBaseBackendUrl + '/api/autoresponder/create',
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
    listAutoResponder: function (payload) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: process.kyubi.appBaseBackendUrl + '/api/autoresponder/list',
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
    editAutoResponder: function (payload) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: process.kyubi.appBaseBackendUrl + '/api/autoresponder/edit',
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
    updateAutoResponder: function (payload) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: process.kyubi.appBaseBackendUrl + '/api/autoresponder/update',
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
    updateAutoResponderStatus: function (payload) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: process.kyubi.appBaseBackendUrl + '/api/autoresponder/updateStatus',
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
    deleteAutoResponderStatus: function (payload) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: host + '/api/autoresponder/delete',
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
}
export default autoResponderServices;