import EmailError from "../errors/EmailError";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(to, from, subject, body, jaegerTracer) {
  const msg = {
    to: to,
    from: from,
    subject: subject,
    text: body,
  };

  try {
    jaegerTracer.start("startSendgrid");
    const response = await sgMail.send(msg);
    jaegerTracer.stop();
    return response;
  } catch (e) {
    throw new EmailError("could not send mail");
  }
}

export async function readinessCheck() {
  return true;
}
