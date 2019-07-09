import * as React from 'react';

import { observer } from 'mobx-react';
import names from 'classnames';

import { parseProps, onChangeHandler, controlMargin } from './properties_common';
import { FormComponentProps } from '@toryjs/form';
import { propName, Context } from '@toryjs/ui';

import { tableRowFlex } from './properties_styles';

export const Input = observer((componentProps: FormComponentProps) => {
  const context = React.useContext(Context);
  const onChange = React.useMemo(
    () => onChangeHandler.bind({ props: componentProps, context: context }),
    [componentProps, context]
  );

  const { formElement, readOnly, owner } = componentProps;
  const { value, error, props = {} } = parseProps(componentProps, context, true);
  const source = propName(formElement);
  const schema = owner && owner.getSchema(source);

  let type =
    schema &&
    (schema.properties && schema.properties.value ? schema.properties.value.type : schema.type);

  return (
    <div className="propertyInput">
      <input
        type={type === 'number' || type === 'integer' ? 'number' : 'text'}
        name={formElement.uid}
        className={names(controlMargin, tableRowFlex, { invalid: error })}
        onChange={onChange}
        placeholder={props.placeholder}
        data-value={value}
        value={value || ''}
        readOnly={readOnly}
      />
      {props && props.inputLabel && <div className="propertyLabel">{props.inputLabel}</div>}
    </div>
  );
});
