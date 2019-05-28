var aws = require('aws-sdk');
var nodemailer = require('nodemailer');

var ses = new aws.SES();

exports.handler = function (event, context, callback) {

    console.log('Body:', event.body);
    console.log('Method:', event.method);

    const payload = event.body;
    if (payload.to && payload.subject && payload.sender) {

        var mailOptions = {
            from: '"NOREPLY"noreply@abc.com',
            to: payload.to,
            subject: payload.subject,
            text: payload.text ? payload.text : '',
            html: payload.html ? payload.html : '',
            cc: payload.cc ? payload.cc : '',
            bcc: payload.bcc ? payload.bcc : '',
            replyTo: payload.sender
        };

        var transporter = nodemailer.createTransport({ SES: ses });
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log('Error sending email : ' + err);
                callback(err);
            }
            else {
                console.log('Email sent successfully');
                callback(null, { statusCode: 200, message: 'Email sent successfully' });
            }
        });
    }
    else {
        console.log('Payload is empty.');
        callback(null, { statusCode: 400, body: 'Bad request' });
    }
};