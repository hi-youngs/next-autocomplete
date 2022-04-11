import axios from "axios";

export default class ApiInterface {
    constructor(baseUrl) {
        this.baseUrl = process.env.API_URL;
        this.headers = {
            "content-type": "application/json",
        };
    }

    async get({ url = "/", headers = this.headers, loading = true }) {
        try {
            const { data } = await axios.get(this.baseUrl + url, { headers: headers });
            return data.data;
        } catch (err) {
            return this.errorHandler(err);
        }
    }

    async delete({ url = "/", body = {}, headers = this.headers, loading = true }) {
        try {
            const { data } = await axios.delete(this.baseUrl + url, { data: body, headers: headers });
            return data.data;
        } catch (err) {
            return this.errorHandler(err);
        }
    }

    async post({ url = "/", body = {}, headers = this.headers, loading = true }) {
        try {
            const { data } = await axios.post(this.baseUrl + url, body, { headers: headers });
            return data.data;
        } catch (err) {
            return this.errorHandler(err);
        }
    }

    async put({ url = "/", body = {}, headers = this.headers, loading = true }) {
        try {
            const { data } = await axios.put(this.baseUrl + url, body, { headers: headers });
            return data.data;
        } catch (err) {
            return this.errorHandler(err);
        }
    }

    async postDownload({ url = "/", body = {}, headers = this.headers, loading = true }) {
        try {
            const response = await axios.post(this.baseUrl + url, body, { headers: headers, responseType: "blob" });
            return response;
        } catch (err) {
            return this.errorHandler(err);
        }
    }

    getAxios() {
        return axios;
    }

    setHeaders(headers) {
        this.headers = headers;
    }

    addHeader(headers) {
        this.headers = { ...this.headers, headers };
    }

    loadingOn() {
        throw Error();
    }

    loadingOff() {
        throw Error();
    }

    alertHandler() {
        throw Error();
    }

    authHandler() {
        throw Error();
    }

    afterError() {
        return;
    }

    errorHandler(err) {
        this.alertHandler(err.response.data);
        this.afterError(err.response.data);

        if (err.response.data.code === 401) this.authHandler();

        return false;
    }
}
