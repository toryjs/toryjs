import * as React from 'react';

import { observer } from 'mobx-react';
import { Radio, CheckboxProps as SuiCheckboxProps } from 'semantic-ui-react';
import { Option, FormComponentProps, FormComponent } from '@toryjs/form';

import { css, processControl, getValues, getValue, setValue, DynamicComponent } from '@toryjs/ui';

const formRadio = css`
  margin-right: 12px;
  margin-bottom: 6px;
`;

export const RadioComponent: React.FC<FormComponentProps> = props => {
  const { source, disabled, error, owner, value, context } = processControl(props, false);
  const [options, schemaSource, vertical] = getValues(props, 'options', 'schemaSource', 'vertical');
  const radioValues = schemaSource ? owner.getSchema(schemaSource).$enum : options;

  const handleToggleChange = React.useCallback(
    (_: any, control: SuiCheckboxProps) => {
      // find value
      setValue(props, context, control.value);
    },
    [context, props]
  );

  return (
    <DynamicComponent {...props}>
      {radioValues.map((item: Option) => (
        <React.Fragment key={item.value}>
          <Radio
            className={formRadio}
            name={source}
            label={item.text}
            disabled={disabled}
            value={item.value}
            checked={value === item.value}
            error={error}
            onChange={handleToggleChange}
          />
          {vertical && <br />}
        </React.Fragment>
      ))}
    </DynamicComponent>
  );
};

export const RadioView: FormComponent = {
  Component: observer(RadioComponent),
  toString: (_, props, context) => {
    const value = getValue(props, context);
    // let radioList = props.formElement.props.list;
    // const radioOptions = owner.getSchema(radioList).$enum;
    // const radioText = radioOptions.find(o => o.value === value).text;
    return value;
  }
};
