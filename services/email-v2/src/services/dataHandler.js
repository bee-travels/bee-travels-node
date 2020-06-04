import EmailError from '../errors/EmailError';
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendEmail(to, from, subject, body) {
  const msg = {
    to: to,
    from: from,
    subject: subject,
    text: body,
  }

  try {
    const response = await sgMail.send(msg);
    return response;
  } catch(e){
    throw new EmailError('could not send mail');
  }
}

export default {sendEmail}