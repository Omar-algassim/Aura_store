import axios from 'axios';
import { env } from '@strapi/utils';
import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

interface requestData {
  template: string;
  token: string;
}

const WHATSAPP_TOKEN = env('WHATS_ACCESS_TOKEN');
const WHATSAPP_SENDER = env('SEND_NUMBER');
const WHATSAPP_URL = 'https://app.xpressbot.org/api/v1/whatsapp/send/template';

function setBod(phone: string, token: string, template: string) {
  const sep_token = `${token.slice(0, 3)}-${token.slice(3, 6)}`;

  if (template === 'verify_code') {
    return {
      apiToken: WHATSAPP_TOKEN,
      phone_number_id: WHATSAPP_SENDER,
      template_id: '185587',
      template_header_media_url: '456789',
      'templateVariable_verifyCode-1': sep_token,
      'templateVariable-verifyCode-2': token,
      phone_number: phone,
    };
  }
  if (template === 'reset_password') {
    //TODO: test the template in postman and edit the body
    return {
      apiToken: WHATSAPP_TOKEN,
      phone_number_id: WHATSAPP_SENDER,
      template_id: '185588',
      template_header_media_url: '456789',
      'templateVariable_resetPassword-1': sep_token,
      'templateVariable_resetPassword-2': token,
      phone_number: phone,
    };
  }
}

function cleanPhone(phone: string) {
  //check if phone number is valid
  if (!phone || phone.length < 10) {
    throw new ApplicationError(
      'Phone number is required and must be at least 10 digits'
    );
  }
  const reg = /^\+[0-9]+$/;
  if (!reg.test(phone)) {
    throw new ApplicationError('Phone number is invalid');
  }
  //remove all white spaces from phone number
  const num = phone.replace(/\s/g, '').slice(1);
  return num;
}
//send whatsapp message to user
export default async function sendWhatsappMessage(
  user: any,
  data: requestData
) {
  const { template, token } = data;
  const phone = user.phone_number;
  if (!phone || !template) {
    throw new ApplicationError(
      'Phone number and template message is required'
    );
  }
  if (!token || token.length !== 6) {
    throw new ApplicationError('token code is required and must be 6 digits');
  }

  //clean the phone number
  const phone_number = cleanPhone(phone);

  //set the body for the request
  const body = setBod(phone_number, token, template);

  try {
    //send the whatsapp message
    const response = await axios.post(WHATSAPP_URL, body);
    return response.data;
  } catch (error) {
    throw new ApplicationError(
      'Unable to send whatsapp message due:' + error.message
    );
  }
}
