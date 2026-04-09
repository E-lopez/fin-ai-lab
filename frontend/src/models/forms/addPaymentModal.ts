const addPayment = {
  amount: {
    type: 'NUMERIC',
    min: 100000,
    max: 3000000,
    required: true,
    pattern: '[0-9]{6}',
    placeholder: 'amount',
    label: 'Input payment amount',
  },
};

export { 
  addPayment 
};