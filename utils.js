require('dotenv').config();
const nodemailer = require('nodemailer');

const verifymail = async(email, link) => {
    try{
        let transporter = nodemailer.createTestAccount({
            service:  "Gmail",
            auth:{
                user: process.env.USER,
                pass: process.env.PASS,
            }
        });

        //Sending the email
        let info = await transporter.sendMail({
            from:process.env.USER, 
            to: "kalumeernest21@gmail.com",
            subject: "KINDURA | Account Verification",
            text: "Welcome",
            html: `
                <div>
                    Hello, <br>
                    <p>This is the test for Kindura Sign up email two step verification</p>
                    <a href=${link}>Click here to activate your account</a>
                </div>
            `
        });
        console.log("Email was sent successfully");
    }catch(err){
        console.log(err, "Email failed to send")
    }
}

export default verifymail;