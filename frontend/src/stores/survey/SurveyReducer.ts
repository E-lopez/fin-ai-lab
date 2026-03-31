import { initialModel } from "./initialState";

type scoreResult = {
  [key:string]: string | object;
}

export default function surveyReducer(
  surveyState: any, 
  action: { 
    type: string,
    data?: any,
    sectionData?: any,
    answer?: Record<string, string>,
    sections?: string[],
    section?: string,
    currentStep?: number,
    scoreResult?: scoreResult,
    tokenData?: Record<string, string> 
  }
) {
  switch(action.type) {
    case 'INITIALIZE_MODEL': {
      return {
        ...surveyState,
        questions: {
          ...surveyState.questions,
          ...action.data,      
        },
        sections: action.sections!,
        section: action.section,
      }
    }
    case 'SAVE_SECTION': {
      return {
        ...surveyState,
        answers: {
          ...surveyState.answers,
          [action.section!]: {
            ...action.sectionData,      
          }
        },
        currentStep: Math.min(surveyState.currentStep + 1, surveyState.sections.length)
      }
    }
    case 'ADD_ANSWER': {
      const answerKey: string = action.answer ? Object.keys(action.answer)[0] : '';
      const { answers } = surveyState;
      const currentSection = action.section && answers[action.section]
      const foundAtIndex = currentSection.findIndex((answer: {}) => Object.keys(answer)[0] === answerKey);
      const index = foundAtIndex === -1 ? currentSection.length : foundAtIndex
      currentSection[index] = action.answer;

      return {
        ...surveyState,
        answers: {
          ...surveyState.answers,
          [action.section!]: [
            ...currentSection,      
          ]
        },
      }
    }
    case 'UPDATE_SECTION': 
      return {
        ...surveyState,
        section: action.section,
      }
    case 'STEP_FORWARD': 
      return {
        ...surveyState,
        currentStep: Math.max(surveyState[action.section!].length, action.currentStep! + 1),
      }
    case 'STEP_BACK': 
      return {
        ...surveyState,
        currentStep: Math.min(0, action.currentStep! - 1),
      }
    case 'SAVE_SCORING':
      return {
        ...surveyState,
        scoreResult: {
          ...surveyState.scoreResult,
          ...action.scoreResult,
        }
      }
    case 'RESET_STORE':
      return initialModel;
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
