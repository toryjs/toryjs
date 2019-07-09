import * as React from 'react';

import { observer } from 'mobx-react';
import { Dropdown } from 'semantic-ui-react';
import { FormComponentProps } from '@toryjs/form';
import { getValue, propName, Context } from '@toryjs/ui';

import { parseProps, onChangeHandler } from './properties_common';

export const Select: React.FC<FormComponentProps> = observer(props => {
  const context = React.useContext(Context);
  const onChange = React.useMemo(() => onChangeHandler.bind({ props, context }), [context, props]);

  const { formElement } = props;
  const source = propName(formElement);

  let def = getValue(props, context, 'default');

  //const opts = React.useMemo(() => {
  let options = getValue(props, context, 'options');
  if (!options) {
    options = [];
  }
  let schema = props.owner && props.owner.getSchema(source, false);
  if (schema && schema.$enum) {
    options = options.concat(schema.$enum);
  }
  // return options;
  //}, [context, props, source]);

  let { value, error } = parseProps(props, context, true);
  value = value == null ? def : value === '' ? '--' : value;

  return (
    <Dropdown
      value={value}
      data-value={value}
      id={source}
      search={formElement.props.search}
      selection
      fluid
      allowAdditions={formElement.props.search}
      text={value ? undefined : formElement.props && formElement.props.text}
      name="type"
      onChange={onChange}
      className={`property-search xxx ${error ? 'invalid' : ''}`}
      options={options}
    />
  );
});
