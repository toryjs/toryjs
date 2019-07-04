import React from 'react';

import { EditorComponent, FormComponentProps } from '@toryjs/form';
import { observer } from 'mobx-react';
import {
  propGroup,
  boundProp,
  getValue,
  Context,
  DynamicControl,
  createComponents,
  error
} from '@toryjs/ui';
import { ContextProps } from './context_view';

export const ContextEditorComponent: React.FC<FormComponentProps<ContextProps>> = props => {
  const context = React.useContext(Context);

  let fakeData = getValue(props, context, 'contextUpgrade');
  let upgrade: any;
  if (fakeData) {
    try {
      upgrade = eval(`(${fakeData.trim()})`);
    } catch (ex) {
      return <div className={error}>Error parsing json: {ex.message}</div>;
    }
  }

  let newContext = { ...context, ...upgrade };
  return (
    <DynamicControl {...props}>
      <Context.Provider value={newContext}>{createComponents(props)}</Context.Provider>
    </DynamicControl>
  );
};

export const ContextEditor: EditorComponent = {
  Component: observer(ContextEditorComponent),
  provider: true,
  title: 'Context',
  control: 'Context',
  icon: 'code',
  group: 'Editor',
  props: propGroup('Context', {
    contextUpgrade: boundProp({
      documentation: `You can override the context. For example you can set the user and user roles by specifying:
      <p>
      <b>Example:</b>
      <pre style="font-family: Courier">
{
  auth: {
    user: {
      id: '1',
      roles: ['admin']
    }
  }
}
      </pre>
      </p>
      `,
      props: { label: '', language: 'javascript', display: 'padded' },
      control: 'Code'
    })
  })
};
