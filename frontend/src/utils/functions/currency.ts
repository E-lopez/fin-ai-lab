export const toCurrency = (value: number | bigint | string) => {
  const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
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
};

export const sumColumn = (rows: any[], col: string): number =>
  rows.reduce((acc, row) => acc + Number(row[col]), 0);

export const calcTotalValue = (principal: number, fees: number, interest: number): number =>
  principal + fees + interest;

import { LoanSummary } from "@/models/dto/loanSummary";

export const filterLoans = (loans: LoanSummary[], filter: string): LoanSummary[] =>
  filter === 'active' ? loans.filter((l) => l.status === 'active') : loans;

export const sumLoansField = (loans: LoanSummary[], field: keyof LoanSummary): number =>
  loans.reduce((acc, loan) => acc + Number(loan[field]), 0);

export const calcProfitability = (disbursed: number, repaid: number) => ({
  ratio: disbursed > 0 ? repaid / disbursed : 0,
  net: repaid - disbursed,
});