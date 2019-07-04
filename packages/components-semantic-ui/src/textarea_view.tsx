import * as React from 'react';

import { observer } from 'mobx-react';
import { TextArea } from 'semantic-ui-react';
import { FormComponentProps, FormComponent } from '@toryjs/form';
import { processControl, getValue, DynamicComponent } from '@toryjs/ui';

import { ErrorView } from './error_view';

const controlProps = ['placeholder'];

export const TextAreaComponent: React.FC<FormComponentProps> = props => {
  const { source, owner, disabled, error, value, handleChange } = processControl(props);

  return (
    <React.Fragment>
      <DynamicComponent
        {...props}
        control={TextArea}
        controlProps={controlProps}
        name={source}
        disabled={disabled || !source}
        error={error}
        value={value || ''}
        onChange={handleChange}
      />

      <ErrorView owner={owner} source={source} />
    </React.Fragment>
  );
};

export const TextAreaView: FormComponent = {
  Component: observer(TextAreaComponent),
  toString: (_owner, props, context) => getValue(props, context)
};
