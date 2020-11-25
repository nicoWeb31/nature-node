

const login = async (email, password) => {
    console.log(
        "🚀 ~ file: login.js ~ line 12 ~ document.querySelector ~ email",
        email
    );
    console.log(
        "🚀 ~ file: login.js ~ line 13 ~ document.querySelector ~ password",
        password
    );

    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:3003/api/v1/users/login",
            data: {
                email,
                password,
            },
        });

        console.log(res);
    } catch (error) {
        console.log("🚀 ~ file: login.js ~ line 20 ~ login ~ error", error.response.data);
    }
};

//select form elements
document.querySelector(".form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email,password);
});
