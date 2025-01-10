import axios from 'axios';
import { env } from '@strapi/utils';
import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

interface requestData {
  template: string;
  token: string;
};

const WHATSAPP_TOKEN = env('WHATS_ACCESS_TOKEN');
const WHATSAPP_SENDER = env('SEND_NUMBER');
const WHATSAPP_URL = `https://graph.facebook.com/v12.0/${WHATSAPP_SENDER}/messages`

function setBod(phone: string, token: string, template: string) {
  const sep_token = `${token.slice(0, 3)}-${token.slice(3, 6)}`;

  if (template === "verify_code") {
    return {
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: template,
        language: {
          code: "en_US",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: sep_token,
              },
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: token,
              },
            ],
          },
        ],
      },
    };
  }
  if (template === "reset_password") {
    //TODO: test the template in postman and edit the body
    return {
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: template,
        language: {
          code: "en_US",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: sep_token,
              },
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: token,
              },
            ],
          },
        ],
      },
    };
  }
}
function cleanPhone(phone: string) {
  //check if phone number is valid
  if (!phone || phone.length < 10) {
    throw new ApplicationError("Phone number is required and must be at least 10 digits");
  }
  const reg = /^\+[0-9]+$/;
  if (!reg.test(phone)) {
    throw new ApplicationError("Phone number is invalid");
  }
  //remove all white spaces from phone number
  const num = phone.replace(/\s/g, "").slice(1);
  return num;
}
//send whatsapp message to user
export default async function sendWhatsappMessage(user: any, data: requestData) {
  const { template, token} = data;
  const phone = user.phone_number;
  if (!phone || !template) {
    throw new ApplicationError("Phone number and template message is required");
  };
  if (!token || token.length !== 6) {
    throw new ApplicationError("token code is required and must be 6 digits");
  }

  //clean the phone number
  const phone_number = cleanPhone(phone);
  
  //set the header for the request
  const header = {
    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  };
  //set the body for the request
  const body = setBod(phone_number, token, template); 

  try {
    //send the whatsapp message
    const response = await axios.post(WHATSAPP_URL, body, { headers: header });
    return response.data;
  } catch (error) {
    throw new ApplicationError("Unable to send whatsapp message due:" + error.message);
  }
}