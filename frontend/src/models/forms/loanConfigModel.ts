const loanConfigMethod = {
  name: 'test',
  type: 'MULTIPLE_CHOICE',
  required: true,
  label: 'Cómo quieres que calculemos tu préstamo?',
  instruction: {
    line_1: '¿Sabes cuánto puedes pagar mensualmente? selecciona CUOTA.',
    line_2:'¿Sabes en cuánto tiempo quieres pagarlo? selecciona PLAZO.',
  },
  multipleOptions: ['Cuota', 'Plazo'],
};

const amountField = {
  amount: { 
    type: 'NUMERIC',
    name: 'amount',
    required: true,
    placeholder: '$0.0',
    min: 100000,
    step: 100,
    label: '¿Cuánto necesitas?',
  }
}

const loanDataPeriod = {
  period: {
    type: 'NUMERIC',
    min: 1,
    max: 36,
    required: true,
    pattern: '[0-9]{2}',
    placeholder: '1 a 36 meses',
    label: '¿En cuántos meses quieres pagar?',
  },
};

const loanDataInstalment = {
  instalment: {
    type: 'NUMERIC',
    required: true,
    placeholder: '$0.0',
    step: 100,
    label: '¿Cuánto quieres pagar mensualmente?',
  },
};

export const loanConfigModels: {[key: string]: any } = {
  method: loanConfigMethod,
  loanData: {
    instalment:{...amountField, ...loanDataInstalment}, 
    period:{...amountField, ...loanDataPeriod}
  },
}

