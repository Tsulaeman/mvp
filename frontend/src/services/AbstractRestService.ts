export default abstract class AbstractRestService {

    token: string | null;
    baseUrl: string;
    headers = new Headers();

    constructor(baseUrl: string) {
        this.token = localStorage.getItem("token");
        this.baseUrl = baseUrl;

        if(this.token) {
            this.headers.append('Authorization', `Bearer ${this.token}`)
        }
        this.headers.append('Accept', 'application/json');
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept-Encoding', 'gzip, deflate, br');
    }

    request(url: string, method = 'GET', body: any = null) {
        const opts: Record<string, any> = {
            method,
            headers: this.headers
        };

        if(body) {
            opts.body = body
        }

        return fetch(url, opts);
    }

    get(endpoint: string | null, query: Record<string, any> | null) {
        let url = endpoint ? this.baseUrl + endpoint : this.baseUrl;
        url += query ? `?` + new URLSearchParams(query) : "";
        url = url.trim();
        return this.request(url);
    }

    delete(endpoint: string | null, payload: any | null) {
        let url = endpoint ? endpoint : '';
        url = this.baseUrl + url;
        return this.request(url, 'DELETE');
    }

    post(endpoint: string | null, payload: Record<string, any> | null) {
        let url = endpoint ? endpoint : '';
        url = this.baseUrl + url;
        return this.request(url, 'POST', JSON.stringify(payload) )
    }

    patch(endpoint: string | null, payload: Record<string, any> | null) {
        let url = endpoint ? endpoint : '';
        url = this.baseUrl + url;
        return this.request(url, 'PATCH', JSON.stringify(payload));
    }

    put(endpoint: string | null, payload: Record<string, any> | null) {
        let url = endpoint ? endpoint : '';
        url = this.baseUrl + url;

        return this.request(url, 'PUT', JSON.stringify(payload));
    }

    /**
     * abstract method to store token
     */


}