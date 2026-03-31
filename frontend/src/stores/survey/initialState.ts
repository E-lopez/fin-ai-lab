export type InitialModel = {
  answers: Record<string, string>,
  questions: Record<string, string>,
  section: string,
  sections: string[],
  currentStep: number,
  scoreResult: Record<string, string>,
}

export const initialModel = {
  answers: {},
  questions: {},
  section: '',
  sections: [],
  currentStep: 1,
  scoreResult: {},
}