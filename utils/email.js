const nodemailer = require("nodemailer");
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Emailer {

    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `Nicolas Riot <${process.env.EMAIL_FROM}>`;
    }

    NewCreateTransport() {
        if (process.env.NODE_ENV === "production") {
            //TODO: Implement sendGrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth:{
                    user: process.env.API_KEY_NAME,
                    pass: process.env.API_KEY_SERNDGRID,
                }
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(template,subject){
        //send the actual email
        //1 Render html based on a pug templates
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName: this.firstName,
            url: this.url,
            subject
        })

        //2 define option email
        const mailOptions = {
            from: this.from,
            to:this.to,
            subject:subject,
            html: html,
            text: htmlToText.fromString(html),
        };

        //3 create a transport and send email
        await this.NewCreateTransport().sendMail(mailOptions);
    }

    async sendWelcome(){
        await this.send('welcome', 'Welcome to the natour Familly !');
    }


    async sendForgotPasswordReset(){
        await this.send('passwordReset','Your password rest token valid for 10 minutes ! ')
    }


};

// const sendEmail = async (options) => {
//     //1) create a transporterver
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD,
//         },
//         //Activate in gmail "less secure app " option
//     });

//     //2) define the eamil options
//     const mailOptions = {
//         from: "Nicolas Riot <nico.riot@free.fr>",
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         //html:
//     };

//     //3) send email
//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
