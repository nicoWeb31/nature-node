//update data
import axios from "axios";
import { hideAlert, showAlert } from "./alert";

export const updateSettings = async (data, type) => {
    //type is either password or data,
    try {
        console.log("🚀 ~ file: updateSettings.js ~ line 30 ~ updateSettings ~ data", data)
        const url =
            type === "password"
                ? "http://localhost:3003/api/v1/users/updateMypassword"
                : "http://localhost:3003/api/v1/users/updateMe";

        const res = await axios({
            method: "PATCH",
            url,
            data
        });
        if (res.data.status === "success") {
            showAlert("success", `${type.toUpperCase()} Update with successfully`);
            window.location = "/me";
        }
    } catch (error) {
        showAlert("error", error.res.data.message);
        console.log(
            "🚀 ~ file: updateSettings.js ~ line 24 ~ updateUser ~ error",
            error
        );
    }
};
