export const loanScheduleFormModel: { [key: string]: any } = {
  principal: {
    type: 'NUMERIC',
    min: 1000,
    max: 10000000,
    required: true,
    pattern: '[0-9]{6}',
    placeholder: 'amount',
    label: 'Input payment amount',
  },
  interest_rate: {
    type: 'NUMERIC',
    required: true,
    label: 'Interest Rate',
    placeholder: '24.36%',
    min: 0,
    step: 0.01,
  },
  amortization_type: {
    type: 'DROPDOWN',
    required: true,
    label: 'Amortization Type',
    options: ['french', 'bullet', 'interest_only'],
  },
  payment_frequency: {
    type: 'DROPDOWN',
    required: true,
    label: 'Payment Frequency',
    options: ['monthly', 'bimonthly', 'quarterly', 'semiannually', 'annually'],
  },
  term_months: {
    type: 'NUMERIC',
    required: true,
    label: 'Term (months)',
    placeholder: '12',
    min: 1,
    step: 1,
  },
};
