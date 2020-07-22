import { API_URL } from '../config/shared';
import { AsyncStorage } from 'react-native';

export class Services {
    constructor() {
    }

    postService = async (service_url, bodyData) => {
        console.log("URL :", API_URL + service_url);
        console.log("bodyData :", bodyData);
        console.log("Data :", data);
        let accessToken = await AsyncStorage.getItem('accessToken');
        let data = {
            method: 'POST',
            headers: {
                'Authorization' : 'Bearer ' + accessToken, 
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: bodyData
        }
        
        return fetch(API_URL + service_url, data)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                return error;
            });


    }


    postService2 = async (service_url, bodyData) => {
        let accessToken = await AsyncStorage.getItem('accessToken');
        let data = {
            method: 'POST',
            headers: {
                'Authorization' : 'Bearer ' + accessToken, 
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: bodyData

        }
        console.warn('data: ',data);
        console.warn('url: ',API_URL + service_url);
        return fetch(API_URL + service_url, data)
            .then((response) => { console.warn("response :", response); return response.json();})
            .then((responseJson) => {  console.warn("responseJson :", responseJson);
                return responseJson;
            })
            .catch((error) => { console.warn("error :", error);
                return error;
            });


    }

    getService = async (service_url, bodyData) => {
        let accessToken = await AsyncStorage.getItem('accessToken')|| 'none';
        let data = {
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer ' + accessToken, 
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: bodyData

        }

        return fetch(API_URL + service_url, data)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                return error;
            });
    }

    getService2 = async (service_url, bodyData) => {
        let accessToken = await AsyncStorage.getItem('accessToken')|| 'none';
        let data = {
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer ' + accessToken, 
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: bodyData

        }
        console.warn('data: ',data);
        console.warn('url: ',API_URL + service_url);
        return fetch(API_URL + service_url, data)
            .then((response) => {console.warn("response :", response); return response.json();})
            .then((responseJson) => {  console.warn("responseJson :", responseJson);
                return responseJson;
            })
            .catch((error) => {
                console.warn('error:', error)
                return error;
            });
    }

    deleteService = async (service_url, bodyData) => {
        let accessToken = await AsyncStorage.getItem('accessToken');
        let data = {
            method: 'DELETE',
            headers: {
                'Authorization' : 'Bearer ' + accessToken, 
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: bodyData

        }

        return fetch(API_URL + service_url, data)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                return error;
            });
    }

    deleteService2 = async (service_url, bodyData) => {
        let accessToken = await AsyncStorage.getItem('accessToken');
        let data = {
            method: 'DELETE',
            headers: {
                'Authorization' : 'Bearer ' + accessToken, 
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: bodyData

        }
console.warn(service_url);
        return fetch(API_URL + service_url, data)
            .then((response) => {console.warn("response :", response); return response.json();})
            .then((responseJson) => {  console.warn("responseJson :", responseJson);
                return responseJson;
            })
            .catch((error) => {
                return error;
            });
    }

    faceBookGraphService(service_url) {un_autenticated_methods
        let data = {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
            },
            // body: bodyData

        }

        return fetch('https://graph.facebook.com/' + service_url, data)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                return error;
            });
    }

    putService = async (service_url, bodyData) => {
        let accessToken = await AsyncStorage.getItem('accessToken');
        console.log("URL :", API_URL + service_url);
        console.log("bodyData :", bodyData);
        console.log("Data :", data);
        let data = {
            method: 'PUT',
            headers: {
                'Authorization' : 'Bearer ' + accessToken, 
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: bodyData

        }

        return fetch(API_URL + service_url, data)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                return error;
            });
    }

    putService2 = async (service_url, bodyData) => {
        let accessToken = await AsyncStorage.getItem('accessToken');
        let data = {
            method: 'PUT',
            headers: {
                'Authorization' : 'Bearer ' + accessToken, 
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: bodyData

        }

        console.warn('data: ',data);
        console.warn('url: ',API_URL + service_url);
        return fetch(API_URL + service_url, data)
            .then((response) => { console.warn("response :", response); return response.json();})
            .then((responseJson) => {  console.warn("responseJson :", responseJson);
                return responseJson;
            })
            .catch((error) => { console.warn("error :", error);
                return error;
            });
    }

    /**
     * Error handler
     */
    handleGetError(error) {
        return Observable.throw(error);
    }
}