const nodemailer = require('nodemailer')
if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

let db, config


module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Mails
}

let Mails = class {
    static sendMail(destination, subject, message){
        var transporter = nodemailer.createTransport({
            service: 'Hotmail',
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var mailOptions;
        mailOptions = {
            from: process.env.EMAIL,
            to: destination,
            subject: subject,
            text: message,
            html: '<b>'+message+'</b>'
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err){
                console.log(err);
            }
            console.log(info);
        })
    }
}