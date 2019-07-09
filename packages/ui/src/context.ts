import React from 'react';
import { EditorContext } from './context/editor';
import { observable } from 'mobx';

type User = {
  name?: string;
  id?: string;
  roles?: string[];
};

export class ContextType {
  authToken?: string;
  @observable auth: { user?: User; logout?: Function } = {};
  providers?: any = {};
  editor: EditorContext;
}

export const context: ContextType = new ContextType();

export const Context = React.createContext(context);
