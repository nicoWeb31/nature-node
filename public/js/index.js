import { login } from "./login";
import { displayMap } from "./mapBox";

import "@babel/polyfill";

//Dom element
//recuperate data info expose in html

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");

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
