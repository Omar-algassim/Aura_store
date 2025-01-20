import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

interface CallbackBody {
    identifier: string;
    password: string;
  }
  interface ForgotPasswordBody {
    email?: string;
    phone_number?: string;
  }
  
  interface CustomRegistrationBody {
    email?: string;
    phone_number?: string;
    password: string;
    username?: string;
  }

const validateCallbackBody = async (params: CallbackBody) => {
  if (!params.identifier || !params.password) {
    throw new ApplicationError("identifier and password is required");
  }
  return params;
};
const validateSendEmailConfirmationBody = async (body: ForgotPasswordBody) => {
  if (!body.email && !body.phone_number) {
    throw new ApplicationError("Either email or phone number isrequired");
  }

  if (body.email && body.phone_number) {
    throw new ApplicationError("please provide Email or phone number not both");
  }

  if (body.phone_number && !/^\+?[\d\s-]{10,}$/.test(body.phone_number)) {
    throw new ApplicationError("Please provide a valid phone number");
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw new ApplicationError("Please provide a valid email");
  }
  return body;
};
const validateForgotPasswordBody = async (body: ForgotPasswordBody) => {
  if (!body.email && !body.phone_number) {
    throw new ApplicationError("Either email or phone number is required");
  }

  if (body.phone_number && !/^\+?[\d\s-]{10,}$/.test(body.phone_number)) {
    throw new ApplicationError("Please provide a valid phone number");
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw new ApplicationError("Please provide a valid email");
  }

  return body;
};
const validateEmailConfirmationBody = async (query: any) => {
  const { confirmation } = query;
  if (!confirmation) {
    throw new ApplicationError("Confirmation token is required");
  }

  return { confirmation };
};

const validateRegistrationData = (data: CustomRegistrationBody) => {
  if (!data.email && !data.phone_number) {
    throw new Error("Either email or phone number is required");
  }

  if (data.email && data.phone_number) {
    throw new Error("Please provide either email or phone number, not both");
  }

  if (data.phone_number && !/^\+?[\d\s-]{10,}$/.test(data.phone_number)) {
    throw new Error("Please provide a valid phone number");
  }
};

export {
  validateCallbackBody,
  validateSendEmailConfirmationBody,
  validateForgotPasswordBody,
  validateEmailConfirmationBody,
  validateRegistrationData,
};