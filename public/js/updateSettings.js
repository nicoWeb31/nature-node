//update data
import axios from "axios";
import { hideAlert, showAlert } from "./alert";

export const updateUser = async (name,email) => {

    try {
            const res = await axios({
                method: "PATCH",
                url: "http://localhost:3003/api/v1/users/updateMe",
                data:{
                    name: name,
                    email: email,
                }
            });
            if(res.data.status === 'success'){
                showAlert("success", "Update with successfully");
                window.location = '/';
            }
        
    } catch (error) {
        showAlert("error",error.res.data.message);
        console.log("🚀 ~ file: updateSettings.js ~ line 24 ~ updateUser ~ error", error)        
    }

};
