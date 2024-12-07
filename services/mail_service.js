const nodemailer = require('nodemailer')
const config = require('config');

class MailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:"gmail",
            host:config.get("smtp_host"),
            port:config.get("smtp_port"),
            secure: false,
            auth: {
                user: config.get("smtp_user"),
                pass: config.get("smtp_password")
            }
        })
    }

    async sendActivationmail(toEmail, link){
        await this.transporter.sendMail({
            from:"smtp_user",
            to: toEmail,
            subject: "FreelancerHub akkauntini faollashtirish",
            text:"",
            html:`
                <div>
                    <h1>Akkauntni faollashtirish uchun quyidagi linkni bosing</h1>
                    <a href="${link}">FAOLLASHTIRING</a>
                </div>
            `
        })
    }
}

module.exports = new MailService()