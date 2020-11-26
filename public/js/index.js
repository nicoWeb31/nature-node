import { login,logout } from "./login";
import { displayMap } from "./mapBox";
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe'

import "@babel/polyfill";

//Dom element
//recuperate data info expose in html

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".formMod");
const logoutButton = document.querySelector(".nav__el--logout");
const formSettings = document.querySelector(".form-user-data");
const formPasswordSettings = document.querySelector(".form-user-settings");
const bookBtn = document.getElementById("bookTour");

//delegation
if (mapBox) {
    const locs = JSON.parse(mapBox.dataset.locations);
    console.log("🚀 ~ file: mapBox.js ~ line 3 ~ location", locs);

    displayMap(locs);
}

if (loginForm) {
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        await login(email, password);
        document.getElementById("email").value = '';
        document.getElementById("password").value = '';
        
    });
}

if(logoutButton){
    logoutButton.addEventListener("click", logout);
}

if(formSettings){
    formSettings.addEventListener("submit",(e)=>{

        e.preventDefault();
        const form = new FormData();
        form.append('name',document.getElementById("name").value)
        form.append('email',document.getElementById("email").value)
        form.append('photo',document.getElementById("photo").files[0])

        console.log(form);

        updateSettings(form,'data');
    })
}

if(formPasswordSettings){
    formPasswordSettings.addEventListener("submit", async(e)=>{
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating....'

        const passwordCurrent = document.getElementById("password-current").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("password-confirm").value;

        await updateSettings({passwordCurrent, password, passwordConfirm},'password');
        document.getElementById("password-current").value = '';
        document.getElementById("password").value = '';
        document.getElementById("password-confirm").value = '';
        document.querySelector('.btn--save-password').textContent = 'Save Password'

    })
}

if(bookBtn){
    bookBtn.addEventListener('click', e=>{
        e.target.textContent = 'Processing .....'
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    })
}
