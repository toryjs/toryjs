import * as React from 'react';

import { FormComponentProps, safeEval, BoundProp } from '@toryjs/form';
import { getValue, Context, sourceValue, handlerValue } from '@toryjs/ui';

export type IfProps = {
  exists: boolean;
  notExists: boolean;
  biggerThan: number;
  biggerOrEqualThan: number;
  smallerThan: number;
  smallerOrEqualThan: number;
  equal: string;
  notEqual: string;
  expression: string;
  value: BoundProp;
};

export const IfView: React.FC<FormComponentProps<IfProps>> = controlProps => {
  const { formElement, owner } = controlProps;
  const { props: props } = formElement;
  const context = React.useContext(Context);

  if (!sourceValue(props.value) && !handlerValue(props.value)) {
    return <div>Component not bound.</div>;
  }

  const value = getValue(controlProps, context);

  let isTrue = true;
  if (props.exists && !value) {
    isTrue = false;
  } else if (props.notExists && value) {
    isTrue = false;
  } else if (props.equal && value != value) {
    isTrue = false;
  } else if (props.notEqual && value == parseFloat(value)) {
    isTrue = false;
  } else if (props.biggerThan && value <= parseFloat(value)) {
    isTrue = false;
  } else if (props.biggerOrEqualThan && value < parseFloat(value)) {
    isTrue = false;
  } else if (props.smallerThan && value <= parseFloat(value)) {
    isTrue = false;
  } else if (props.smallerOrEqualThan && value > parseFloat(value)) {
    isTrue = false;
  } else if (props.expression) {
    isTrue = safeEval(owner, props.expression, owner);
  }

  if (formElement.elements && formElement.elements.length) {
    return controlProps.catalogue.createComponent(
      controlProps,
      formElement.elements[isTrue ? 0 : 1],
      context
    ); //, true);
  }
  return <div>Empty template</div>;
};

IfView.displayName = 'IfView';
