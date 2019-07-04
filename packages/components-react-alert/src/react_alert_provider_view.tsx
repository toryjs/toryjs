import React from 'react';

// @ts-ignore
import AlertTemplate from 'react-alert-template-basic';
import { FormComponentProps } from '@toryjs/form';
import { Provider, AlertProviderProps, useAlert } from 'react-alert';

import { createComponents, Context, DynamicComponent } from '@toryjs/ui';

const Init: React.FC = () => {
  const ctx = React.useContext(Context);
  ctx.providers.alert = useAlert();
  return null;
};

const controlProps = ['position', 'timeout', 'offset', 'transition'];

export const AlertProvider: React.FC<FormComponentProps<AlertProviderProps>> = props => (
  <DynamicComponent
    {...props}
    control={Provider}
    controlProps={controlProps}
    template={AlertTemplate}
  >
    <Init />
    {createComponents(props)}
  </DynamicComponent>
);

AlertProvider.displayName = 'AlertProvider';
