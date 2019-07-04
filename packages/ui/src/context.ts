import React from 'react';
import { observable } from 'mobx';

type User = {
  name?: string;
  id?: string;
  roles?: string[];
};

export type ContextType = {
  authToken?: string;
  auth: { user?: User; logout?: Function };
  providers?: any;
};

export const context: ContextType = {
  authToken: null,
  auth: observable({ user: null }),
  providers: {}
};

export const Context = React.createContext(context);
