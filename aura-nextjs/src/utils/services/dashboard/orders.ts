'use server';
import { apiClient } from '@/utils/api/api-client';
import axios from 'axios';

export async function getOrders(jwt: string): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
  try {
    const { error, data } = await apiClient.fetchOrder(jwt);
    if (error) {
      return {
        message: error,
        type: 'server error',
        data: null,
        error: error,
      };
    }
    if (data) {
      return {
        message: 'Orders fetched successfully',
        type: 'success',
        data: data,
        error: null,
      };
    }
    return {
      message: 'No orders found',
      type: 'info',
      data: null,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      message: 'Failed to fetch orders',
      type: 'error',
      data: null,
      error: error,
    };
  }
}

export async function updateOrderStatus(
  jwt: string,
  orderId: string,
  status: string
): Promise<{
  message: string;
  type?: string;
  data?: any;
  error?: any;
}> {
  try {
    const { error, data } = await apiClient.updateOrderStatus(
      jwt,
      orderId,
      status
    );
    if (error) {
      return {
        message: error.message,
        type: 'server error',
        data: null,
        error: error,
      };
    }
    
    return {
      message: 'Order status updated successfully',
      type: 'success',
      data: data,
      error: null,
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      message: 'Failed to update order status',
      type: 'error',
      data: null,
      error: error,
    };
  }
}

function cleanPhone(phone: string) {
  //check if phone number is valid
  if (!phone || phone.length < 10) {
    return;
  }
  const reg = /^\+[0-9]+$/;
  if (!reg.test(phone)) {
    return;
  }
  //remove all white spaces from phone number
  const num = phone.replace(/\s/g, '').slice(1);
  return num;
}

export async function SendWhatsappMessage(
  phone: string,
  body?: {
    template_id?: string;
    templateVariables?: Record<string, string>;
    template_header_media_url?: string;
  }
): Promise<{
  message: string;
  type?: string;
  data?: any;
  error?: any;
}> {
  const WHATS_TOKEN = process.env.WHATS_ACCESS_TOKEN;
  const WHATS_SENDER = process.env.SEND_NUMBER;
  const WHATS_URL =
    process.env.WHATS_URL ||
    'https://app.xpressbot.org/api/v1/whatsapp/send/template';

  if (!WHATS_TOKEN || !WHATS_SENDER || !WHATS_URL) {
    return {
      message: 'WhatsApp configuration is missing',
      type: 'error',
      data: null,
      error: new Error(
        `Missing WhatsApp configuration: ${
          !WHATS_TOKEN ? 'access token' : ''
        } ${!WHATS_SENDER ? 'sender number' : ''} ${!WHATS_URL ? 'URL' : ''}`
      ),
    };
  }
  // Clean the phone number
  console.log('Received phone number:', phone);
  const phone_number = cleanPhone(phone);
  if (!phone_number) {
    return {
      message: 'Invalid phone number',
      type: 'error',
      data: null,
      error: new Error('Invalid phone number format'),
    };
  }
  try {
    const response = await axios.post(WHATS_URL, {
      apiToken: WHATS_TOKEN,
      phone_number_id: WHATS_SENDER,
      ...body,
      phone_number: phone_number,
    });
    return {
      message: 'WhatsApp message sent successfully',
      type: 'success',
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      message: 'Failed to send WhatsApp message',
      type: 'error',
      data: null,
      error: error,
    };
  }
}

export async function ReceiveOrderMessage(
  phone: string,
  orderId: string
): Promise<{
  message: string;
  type?: string;
  data?: any;
  error?: any;
}> {
  const body = {
    template_id: '189995',
    'templateVariable-orderId-1': orderId,
  };
  return await SendWhatsappMessage(phone, body);
}

export async function SendConfirmMessage(
  phone: string,
  orderId: string,
  name: string
): Promise<{
  message: string;
  type?: string;
  data?: any;
  error?: any;
}> {
  const body = {
    template_id: '195050',
    'templateVariable-userName-1': name,
    'templateVariable-orderId-2': orderId,
  };
  return await SendWhatsappMessage(phone, body);
}
