import { login,logout } from "./login";
import { displayMap } from "./mapBox";
import { updateUser } from './updateSettings'

import "@babel/polyfill";

//Dom element
//recuperate data info expose in html

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".formMod");
const logoutButton = document.querySelector(".nav__el--logout");
const formSettings = document.querySelector(".form-user-data");

//delegation
if (mapBox) {
    const locs = JSON.parse(mapBox.dataset.locations);
    console.log("🚀 ~ file: mapBox.js ~ line 3 ~ location", locs);

    displayMap(locs);
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        login(email, password);
    });
}

if(logoutButton){
    logoutButton.addEventListener("click", logout);
}

if(formSettings){
    formSettings.addEventListener("submit",(e)=>{
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        updateUser(name, email);
    })
}
