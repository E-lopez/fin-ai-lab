const borrowerData = {
  borrowerName: {
    type: 'TEXT',
    min: 5,
    required: true,
    pattern: '/^[a-zA-Z]+$/',
    placeholder: 'Borrower Name',
    label: 'Input borrower name',
  },
  email: {
    type: 'EMAIL',
    required: true,
    placeholder: 'Email',
    label: 'Input email',
  },
  gender: {
    type: 'DROPDOWN',
    required: true,
    label: 'Gender',
    options: ['Male', 'Female', 'Other'],
  },
  organization: {
    type: 'DROPDOWN',
    required: true,
    label: 'Organization',
    options: ['Idartes', 'Junta Central de Contadores', 'Gobernacion de Cundinamarca'],
  },
};

export { 
  borrowerData 
};
