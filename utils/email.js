const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    //1) create a transporterver
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        //Activate in gmail "less secure app " option
    });

    //2) define the eamil options
    const mailOptions = {
        from: "Nicolas Riot <nico.riot@free.fr>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html:
    };

    //3) send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
