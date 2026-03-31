import { ReactElement } from "react";

export default function modalReducer(
  modalState: any, 
  action: { 
    type: string,
    content: ReactElement,
    cssModifier?: string,
  }
) {
  switch(action.type) {
    case 'SHOW_MODAL': {
      return {
        ...modalState,
        visible: true,
        content: action.content,
        cssModifier: action.cssModifier
      }
    }
    case 'HIDE_MODAL': {
      return {
        ...modalState,
        visible: false,
        content: undefined,
      }
    }
    default: {
      throw new Error('Unknown action: ' + action.type);
    }
  }
}
