import axios from 'axios';
import {hideAlert, showAlert} from './alert'

export const  login = async (email, password) => {

    console.log("🚀 ~ file: login.js ~ line 30 ~ login ~ email", email)

    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:3003/api/v1/users/login",
            data: {
                email,
                password,
            },
        });

        if(res.data.status === 'success'){
            // alert('Logged successfully');
            showAlert('success', 'Logged in successfully');
            //redirect 
            window.setTimeout(()=>{
                location.assign("/");
            },500)
        }

    } catch (error) {
        console.log("🚀 ~ file: login.js ~ line 20 ~ login ~ error", error.response.data);
        showAlert('error',error.response.data.message);

    }
};
