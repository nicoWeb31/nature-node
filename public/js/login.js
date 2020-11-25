import axios from "axios";
import { hideAlert, showAlert } from "./alert";

export const login = async (email, password) => {
    console.log("🚀 ~ file: login.js ~ line 30 ~ login ~ email", email);

    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:3003/api/v1/users/login",
            data: {
                email,
                password,
            },
        });

        if (res.data.status === "success") {
            // alert('Logged successfully');
            showAlert("success", "Logged in successfully");
            //redirect
            window.setTimeout(() => {
                location.assign("/");
            }, 500);
        }
    } catch (error) {
        console.log(
            "🚀 ~ file: login.js ~ line 20 ~ login ~ error",
            error.response.data
        );
        showAlert("error", error.response.data.message);
    }
};

export const logout = async()=>{
    try {
        const res = await axios({
            method:'GET',
            url:"http://localhost:3003/api/v1/users/logout",
        })
        
        
        if(res.data.status === 'success'){
            showAlert("success", "Log out successfully");
            // location.reload(true);
            window.location = '/'

        }

    } catch (error) {
        showAlert("error","Error logout, please try again!");
    console.log("🚀 ~ file: login.js ~ line 38 ~ logout ~ error", error)
    }
}