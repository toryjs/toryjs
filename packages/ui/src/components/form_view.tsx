import * as React from 'react';

import { FormViewProps, FormElement } from '@toryjs/form';
import { observer } from 'mobx-react';
import { handle, names, createComponents } from '../common';
import { Context } from '../context';
import { DynamicComponent } from './dynamic_component';

import { css } from 'emotion';

const form = css`
  background: white;
  label: form;
`;

export interface IFieldOwner {
  elements?: FormElement[];
}

type Props = {
  className?: string;
  onCreate?: string;
};

const FormViewComponent: React.FC<FormViewProps & Props> = props => {
  const context = React.useContext(Context);

  const controlProps = props.formElement.props || {};
  const { formElement, owner, extra } = controlProps.onCreate
    ? handle(props.handlers, controlProps.onCreate, props.owner, props, props.formElement, context)
    : props;

  if (!formElement.elements) {
    return <div>Form is empty ¯\_(ツ)_/¯</div>;
  }

  return (
    <DynamicComponent {...props} styleName={names(props.className, props.catalogue.cssClass, form)}>
      {createComponents({ ...props, formElement, owner, extra })}
    </DynamicComponent>
  );
};

export const FormView = observer(FormViewComponent);

FormView.displayName = 'FormView';
