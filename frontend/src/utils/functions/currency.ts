export const toCurrency = (value: number | bigint | string) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "COP" }).format(numValue);
};

export const calculateLoanSummary = (data: any[]) => {
  const t = data.reduce((acc, curr) => {
    acc.VTUA = acc.VTUA + curr.principal
    acc.loan = acc.loan + curr.installment
    return acc
  }, {VTUA: 0, loan: 0})
  return t
}

export const roundUpMinAmmount = (baseValue: number) => {
  return Math.ceil(baseValue/1000/36)*1000;
}