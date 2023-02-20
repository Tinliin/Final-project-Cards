import {url} from "./variables.js";
// метод request приймає в параметри: метод(GET, PUT і тд), токен, id, body. Вертає масив обєктів на сервері
class Requests {
    constructor(url) {
        this.url = url
    }
    request(method="GET", token, id="", body=null) {
        return (async () => {
            const response = await fetch(`${this.url}/${id}`, {
                method: `${method}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: body,
            })
            if (!response.ok){
                throw new Error(response.status);
            }
            if (method === "DELETE"){
                return;
            }
            return response.json();
        })()
    }
}
export const requests = new Requests(url);
