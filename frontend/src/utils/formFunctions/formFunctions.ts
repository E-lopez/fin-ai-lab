import { roundUpMinAmmount } from "../functions/currency";
import { checkFileExtension } from "../functions/files";

type Validator = (value: any, ...args: any) => void | boolean;

const textField = (val: string) => {
  if(!val.length) return false;
  const regex: RegExp = /^[a-zA-Z\s]{2,}$/;
  return regex.test(val);
}

const numericField = (val: string) => {
  const regex: RegExp = /^\d{5,10}$/;
  return regex.test(val);
}

const amount = (value: string, max: string, min: string) => {
  const isNumeric = numericField(value)
  const isAllowed = Number(value) >= Number(min) && Number(value) <= Number(max)
  return isNumeric && isAllowed;
}

const instalment = (value: string, max: string) => {
  const isNumeric = numericField(value);
  const isAllowed = Number(value) >= 10000 && Number(value) < Number(max);
  return isNumeric && isAllowed;
}

const dateOfBirth = (val: string) => {
  const d = val.split('-').map((el) => Number(el));
  const t = new Date(d[0], d[1] - 1, d[2]);
  t.setFullYear(t.getFullYear() + 18);
  return t < new Date();
}

const loanPeriod = (val: string) => {
  const numericVal = Number(val);
  return numericVal > 0 && numericVal <= 36;
}

const files = (val: any) => {
  const allowedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];
  const checkLength = Object.values(val).length === 3;
  const checkExtensions = Object.values(val).map((file: any) => checkFileExtension(file.name, allowedExtensions)).every(el => el);
  return checkLength && checkExtensions;
}

const email = (val: string) => {
  const regex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(val);
}

const validators: (fieldName: string) => Validator = (fieldName: string) => {
  switch(fieldName) {
    case 'userName':
      return textField;
    case 'idNumber':
      return numericField;
    case 'instalment':
      return instalment;
    case 'amount':
      return amount;
    case 'dateOfBirth':
      return dateOfBirth;
    case 'period':
      return loanPeriod;
    case 'files':
      return files;
    case 'email':
      return email;
    default:
      return () => {};
  }
}

export const validateField = (...args: 
  { 
    name: string; 
    value: any; 
    max?: string; 
    min?: string; }[]
) => {
  const {name, value, max, min} = args[0];
  if(!value) return false;
  const validatorFunction = validators(name);
  return validatorFunction(value, max, min);
}
