import * as React from 'react';

import { observer } from 'mobx-react';

import { getValue, Context, DynamicComponent } from '@toryjs/ui';
import { FormComponentProps, FormComponent, safeEval } from '@toryjs/form';

const FormulaComponent: React.FC<FormComponentProps> = props => {
  const context = React.useContext(Context);
  const formulaText = getValue(props, context);
  let value;

  try {
    value = safeEval(props.owner, formulaText, props.owner);

    if (value != null && typeof value == 'object') {
      value = '[Object Results are not allowed]';
    }
  } catch (ex) {
    return <DynamicComponent {...props}>{ex.message}</DynamicComponent>;
  }

  return (
    <DynamicComponent {...props}>
      {value == null ? (props.catalogue.isEditor ? '#Formula' : '') : value}
    </DynamicComponent>
  );
};

export const FormulaView: FormComponent = {
  Component: observer(FormulaComponent),
  toString: (_owner, props, context) => getValue(props, context)
};
