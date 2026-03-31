import { UserService } from "@/services/userApi/userService";

type Validator = (value: any, access_token: string) => void | boolean | Promise<any>;

const duplicatedData = async ({ idNumber, email}: { idNumber: string, email: string, access_token: string }, access_token: string) => {
  if(!idNumber) return;
  const messages = []
  const idNumberExists = await UserService.idNumberExists(idNumber, access_token);
  const emailExists = await UserService.emailExists(email, access_token);
  if (idNumberExists?.body) messages.push('Tu número de identificación');
  if (emailExists?.body) messages.push('Tu email');
  return {
    'isDuplicated': emailExists?.body || idNumberExists?.body,
    'message': messages,
  };
}

const validators: (fieldName: string) => Validator | null = (fieldName: string) => {
  switch(fieldName) {
    case 'demographics':
      return duplicatedData;
    default:
      return () => false;
  }
}

export const validateData = (sectionName: any, data: {[key: string]: any}, access_token: string) => {
  if(!sectionName) return false;
  const validatorFunction = validators(sectionName);
  if(!validatorFunction) return;
  return validatorFunction(data, access_token);
}
