var sgMail = require("@sendgrid/mail");

var config = require("../../config.json");
sgMail.setApiKey(config.SENDGRIP_API_KEY);

function sendEmail(to, from, subject, body){
  // send an email
  // send ok or fail

  const msg = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };

  return sgMail.send(msg).then(() => {
    return 201;
  }).catch(() => {
    return 500;
  });
}

export default sendEmail;