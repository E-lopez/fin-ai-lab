interface Field {
  type: 'TEXT' | 'CHECKBOX'| 'ID_NUMBER' | 'NUMERIC' | 'DATE' | 'RANGE' | 'DROPDOWN' | 'LIKERT' | 'MULTIPLE_CHOICE' | 'TEXTAREA' | 'FILE';
  required: boolean;
  label: string;
  options?: any;
  helperLeft?: string;
  helperRight?: string;
  multipleOptions?: any;
  multiple?: boolean;
  min?: number,
  max?: number,
  step?: number,
  errorHandler?: string,
}

interface Data {
  [key: string]: Field;
}

export interface FormModel {
  metadata: {
    title: string;
    weight: number;
    other: string;
  };
  data: Data;
}
