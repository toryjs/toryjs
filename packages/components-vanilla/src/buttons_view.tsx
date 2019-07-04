import React from 'react';
import { FormComponentProps, FormComponent } from '@toryjs/form';

import { DynamicComponent, simpleHandle, Context, getValue, ContextType } from '@toryjs/ui';
import { ReactComponent } from './common';

export type ButtonProps = {
  content: string;
  onClick: any;
  buttonType: string;
};

export function createButtonComponent(
  component: ReactComponent,
  buttonProps: string[] = ['src'],
  extraProps: (props: FormComponentProps, context: ContextType) => any = () => {}
) {
  const ButtonComponent: React.FC<FormComponentProps<ButtonProps>> = props => {
    const context = React.useContext(Context);
    const onClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.formElement.props.onClick) {
          simpleHandle(props, props.formElement.props.onClick, context, { e });
        } else {
          console.error('Button does not define a handler');
        }
      },
      [context, props]
    );

    if (props.readOnly) {
      return null;
    }

    return (
      <DynamicComponent
        {...props}
        {...extraProps(props, context)}
        control={component}
        controlProps={buttonProps}
        onClick={onClick}
        type={getValue(props, context, 'buttonType')}
      />
    );
  };

  ButtonComponent.displayName = 'Button';
  return ButtonComponent;
}

export const ButtonView: FormComponent = {
  Component: createButtonComponent('button', [], (props, context) => ({
    children: getValue(props, context, 'content') || '[Button]'
  }))
};
