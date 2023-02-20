// Авторизація на сайті, повертає токен. Якщо авторизація не відбулась - токен undefined
import {url, root, filter, createBtn} from "./variables.js";
import {renderCards} from "./visit.js";
class Login{
    constructor(url, email, password) {
        this.url = url;
        this.email = email;
        this.password = password;
    }
    authorize(){
        return fetch(`${this.url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: this.email, password: this.password})
        })
            .then(response => response.text())
            .catch(error => console.log (error))
    }
}

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginText = document.getElementById('loginText')
const loginWindow = document.getElementById('modalLogin');
const loginForm = document.querySelector('.login-form');
const returnLogin = document.getElementById('return-login');

let token = checkToken();

loginBtn.onclick = () => loginWindow.style.display = 'flex';

logoutBtn.onclick = () => {
    let userConfirm = confirm('Are You Sure You Want to Quit?');
    if (userConfirm) {
        localStorage.removeItem('token');
        logoutBtn.classList.add('d-none');
        createBtn.classList.add('d-none');
        root.classList.add('d-none');
        filter.classList.add('d-none')
        loginText.classList.remove('d-none');
        loginBtn.classList.remove('d-none');
    }
}

returnLogin.onclick = () => loginWindow.style.display = 'none';

loginForm.onsubmit = async (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const formElements = [...form.elements].filter(({type}) => (type !== 'submit' && type !== 'button'));
    const email = formElements[0].value;
    const password = formElements[1].value;
    const login = new Login(url, email, password);
    const invalidFeedback = document.querySelector('.invalid-feedback');
    token = await login.authorize();
    if (token === 'Incorrect username or password') {
        formElements.forEach(value => {
            value.classList.add('is-invalid')
            value.addEventListener('focus', ()=> {
                formElements.forEach(item => item.classList.remove('is-invalid'))
                invalidFeedback.classList.add('d-none');
            })
        })
        invalidFeedback.classList.remove('d-none');
    } else {
        localStorage.setItem('token', token);
        handleLogin();
        renderCards(token);
    }
}

function checkToken (){
    let token = localStorage.getItem('token');
    if (token) {
        handleLogin();
        renderCards(token);
        return token;
    }
}
function handleLogin(){
    loginWindow.style.display = 'none';
    loginText.classList.add('d-none');
    loginBtn.classList.add('d-none');
    logoutBtn.classList.remove('d-none');
    createBtn.classList.remove('d-none');
    filter.classList.remove('d-none');
    root.classList.remove('d-none');
}

export default token;
