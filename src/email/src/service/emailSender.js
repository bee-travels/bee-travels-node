var sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRIP_API_KEY);

function sendEmail(email, subject, body){
  // send an email
  // send ok or fail
  var from = process.env.EMAIL_ADDRESS;

  const msg = {
    to: email,
    from: from,
    subject: subject,
    text: body
  };

  sgMail.send(msg);

}

export default sendEmail;