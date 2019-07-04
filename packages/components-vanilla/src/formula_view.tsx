import * as React from 'react';

import { observer } from 'mobx-react';

import { css, getValue, Context } from '@toryjs/ui';
import { FormComponentProps, FormComponent } from '@toryjs/form';

const formula = css`
  padding: 9px 0px;
`;

export const FormulaComponent: React.FC<FormComponentProps> = props => {
  const context = React.useContext(Context);
  const value = getValue(props, context);

  return (
    <div className="ui input">
      <div className={formula}>{value == null ? '#Formula' : value}</div>
    </div>
  );
};

export const FormulaView: FormComponent = {
  Component: observer(FormulaComponent),
  toString: (_owner, props, context) => getValue(props, context)
};
