import axios from "axios";
import Mustache from "mustache";
import path from "path";
import { promises as fs } from "fs";
import jsdom from "jsdom";

const EMAIL_TEMPLATE_PATH = path.join(
  __dirname,
  "./../data/emailTemplate.html"
);
const EMAIL_URL = process.env.EMAIL_URL || "http://localhost:9301";

export async function sendMail(confirmationId, checkoutObject) {
  const emailBody = await formatEmailBody(confirmationId, checkoutObject);

  const data = {
    email: checkoutObject.billingDetails.email,
    from: "no-reply@beetravels.com",
    subject: "Bee Travels Booking Confirmation",
    body: emailBody,
  };

  const res = await axios.post(EMAIL_URL + "/api/v1/emails", data);

  return res.data;
}

async function formatEmailBody(confirmationId, checkoutObject) {
  const templateRaw = await fs.readFile(EMAIL_TEMPLATE_PATH);
  const dom = new jsdom.JSDOM(templateRaw);
  let template = dom.window.document.getElementById("template").innerHTML;
  const currentDate = new Date(Date.now());
  let items = "";

  for (let item = 0; item < checkoutObject.cartItems.length; item++) {
    let cartItem = checkoutObject.cartItems[item];
    items =
      items +
      '<div style="background-color:transparent;">\
    <div class="block-grid four-up no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #5c98c7;">\
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#5c98c7;">\
    <div class="col num3" style="max-width: 320px; min-width: 160px; display: table-cell; vertical-align: top; width: 160px;">\
    <div style="width:100% !important;">\
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:1px solid #6DA3CD; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
    <div style="color:#ffffff;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">\
    <div style="font-size: 14px; line-height: 1.2; color: #ffffff; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 17px;">\
    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 17px; margin: 0;">' +
      cartItem.type +
      '</p>\
    </div>\
    </div>\
    </div>\
    </div>\
    </div>\
    <div class="col num3" style="max-width: 320px; min-width: 160px; display: table-cell; vertical-align: top; width: 160px;">\
    <div style="width:100% !important;">\
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:1px solid #6DA3CD; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
    <div style="color:#ffffff;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">\
    <div style="font-size: 14px; line-height: 1.2; color: #ffffff; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 17px;">\
    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 17px; margin: 0;">' +
      cartItem.description +
      '</p>\
    </div>\
    </div>\
    </div>\
    </div>\
    </div>\
    <div class="col num3" style="max-width: 320px; min-width: 160px; display: table-cell; vertical-align: top; width: 160px;">\
    <div style="width:100% !important;">\
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:1px solid #6DA3CD; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
    <div style="color:#ffffff;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">\
    <div style="font-size: 14px; line-height: 1.2; color: #ffffff; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 17px;">\
    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 17px; margin: 0;">' +
      new Date(cartItem.startDate).toDateString() +
      " - " +
      new Date(cartItem.endDate).toDateString() +
      '</p>\
    </div>\
    </div>\
    </div>\
    </div>\
    </div>\
    <div class="col num3" style="max-width: 320px; min-width: 160px; display: table-cell; vertical-align: top; width: 160px;">\
    <div style="width:100% !important;">\
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:1px solid #6DA3CD; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
    <div style="color:#ffffff;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">\
    <div style="font-size: 14px; line-height: 1.2; color: #ffffff; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 17px;">\
    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 17px; margin: 0;">' +
      cartItem.cost +
      "</p>\
    </div>\
    </div>\
    </div>\
    </div>\
    </div>\
    </div>\
    </div>\
    </div>";
  }

  const emailJson = {
    name:
      checkoutObject.billingDetails.firstName +
      " " +
      checkoutObject.billingDetails.lastName,
    confNo: confirmationId,
    purchaseDate: currentDate.toDateString(),
    total: checkoutObject.totalAmount,
    currency: checkoutObject.currency,
    items: items,
  };
  const emailBody = Mustache.render(template, emailJson);
  dom.window.document.getElementById("target").innerHTML = emailBody;

  return dom.serialize();
}

export async function emailReadinessCheck() {
  const isReady = await axios.get(EMAIL_URL + "/ready");
  return isReady;
}
