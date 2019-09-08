import * as React from 'react';

import { observer } from 'mobx-react';
import { FormComponentProps, FormComponent } from '@toryjs/form';

import { DynamicComponent, processControl, getValue } from '@toryjs/ui';
import { ReactComponent } from './common';
import { ControlTextView } from './control_text_view';

const controlProps = ['placeholder'];

export function createTextAreaComponent(component: ReactComponent) {
  const BaseTextAreaComponent: React.FC<FormComponentProps> = observer(props => {
    const { source, readOnly, error, value, handleChange } = processControl(props);

    return (
      <React.Fragment>
        <DynamicComponent
          {...props}
          control={readOnly ? ControlTextView : component}
          controlProps={controlProps}
          name={source}
          disabled={readOnly || !source}
          error={error}
          value={value || ''}
          onChange={handleChange}
          showError={true}
        />
      </React.Fragment>
    );
  });
  return BaseTextAreaComponent;
}

const TextAreaComponent = createTextAreaComponent('textarea');

export const TextAreaView: FormComponent = {
  Component: TextAreaComponent,
  toString: (_owner, props, context) => getValue(props, context)
};
