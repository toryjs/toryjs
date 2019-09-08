import React from 'react';

import { observer } from 'mobx-react';
import { Option, FormComponentProps, FormComponent } from '@toryjs/form';
import { DynamicComponent, processControl, getValues, getValue, setValue } from '@toryjs/ui';
import { ReactComponent } from './common';

// const formRadio = css`
//   margin-right: 12px;
//   margin-bottom: 6px;
// `;

export function createRadioComponent(
  component: ReactComponent,
  extraProps?: any,
  radioControls?: (item: Option) => JSX.Element
) {
  const RadioComponent: React.FC<FormComponentProps> = props => {
    const { source, readOnly, error, owner, value, context } = processControl(props, false);
    const [options, schemaSource, vertical] = getValues(
      props,
      'options',
      'schemaSource',
      'vertical'
    );
    const radioValues = schemaSource ? owner.getSchema(schemaSource).$enum : options;

    const handleToggleChange = React.useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        // find value
        setValue(
          props,
          context,
          e.currentTarget.getAttribute('data-value') || e.currentTarget.value
        );
      },
      [context, props]
    );

    return (
      <DynamicComponent {...props}>
        {radioValues.map((item: Option) => (
          <React.Fragment key={item.value}>
            {React.createElement(component, {
              name: source,
              label: item.text,
              disabled: readOnly,
              value: item.value,
              'data-value': item.value,
              checked: value === item.value,
              error: error,
              onChange: handleToggleChange,
              ...extraProps
            })}
            {radioControls && radioControls(item)}
            {vertical && <br />}
          </React.Fragment>
        ))}
      </DynamicComponent>
    );
  };
  return RadioComponent;
}

export const RadioView: FormComponent = {
  Component: observer(
    createRadioComponent('input', { type: 'radio' }, option => (
      <span className="radioText">{option.text}</span>
    ))
  ),
  toString: (_, props, context) => {
    const value = getValue(props, context);
    // let radioList = props.formElement.props.list;
    // const radioOptions = owner.getSchema(radioList).$enum;
    // const radioText = radioOptions.find(o => o.value === value).text;
    return value;
  }
};
