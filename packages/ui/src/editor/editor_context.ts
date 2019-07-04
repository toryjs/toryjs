import React from 'react';
import { EditorState } from './editor_state';

declare global {
  namespace DynamicForm {
    type EditorContextType = EditorState;
  }
}

export type EditorContextType = EditorState;
export const EditorContext = React.createContext(new EditorState(null, null));
