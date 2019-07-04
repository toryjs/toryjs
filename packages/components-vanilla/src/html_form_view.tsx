import React from 'react';
import { FormComponentProps } from '@toryjs/form';
import { DynamicControl, simpleHandle, Context } from '@toryjs/ui';

export type HtmlFormProps = {
  onSubmit: string;
};

const controlProps = ['onSubmit'];

export const HtmlFormComponent: React.FC<FormComponentProps<HtmlFormProps>> = props => {
  const context = React.useContext(Context);
  const onSubmit = props.formElement.props.onSubmit;
  const onSubmitHandler = React.useCallback(e => simpleHandle(props, onSubmit, context, { e }), []);

  return (
    <DynamicControl
      {...props}
      control="form"
      controlProps={controlProps}
      onSubmit={onSubmit && onSubmitHandler}
    />
  );
};
