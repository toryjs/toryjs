import React from 'react';

import { FormComponentProps, Option } from '@toryjs/form';

import { observer } from 'mobx-react';
import { processControl, getValues, simpleHandle, DynamicComponent, ContextType } from '@toryjs/ui';
import { ReactComponent } from './common';

type Props = {
  filterSource: string;
  filterColumn: string;
  schemaSource: string;
  template: string;
  asyncOptions: string;
  options: Option[];
  textField: string;
  valueField: string;
};

export type MenuChildProps = {
  name: string;
};

export type DropdownProps = Props;

export function createDropdownComponent(
  component: ReactComponent,
  dropdownProps: string[] = [],
  extraProps: any,
  renderOptions?: (
    props: FormComponentProps,
    options: Option[],
    context: ContextType
  ) => JSX.Element[],
  renderElementOptions?: (props: FormComponentProps, context: ContextType) => JSX.Element[]
) {
  const DropdownView = observer((props: FormComponentProps<DropdownProps>) => {
    const { handleChange, error, formElement, owner, context, value } = processControl(props);

    const [
      filterSource,
      filterColumn,
      schemaSource,
      options,
      asyncOptionsHandler,
      textField,
      valueField
    ] = getValues(
      props,
      'filterSource',
      'filterColumn',
      'schemaSource',
      'options',
      'asyncOptions',
      'textField',
      'valueField'
    );

    const [loading, setLoading] = React.useState(false);
    const [asyncOptions, setOptions] = React.useState([]);

    let currentOptions = React.useMemo(() => {
      return schemaSource
        ? owner.getSchema(schemaSource).$enum
        : Array.isArray(options) && options.length > asyncOptions.length
        ? options
        : asyncOptions;
    }, [asyncOptions, options, owner, schemaSource]);

    React.useEffect(() => {
      async function load() {
        if (asyncOptionsHandler) {
          setLoading(true);
          const options = simpleHandle(props, asyncOptionsHandler, context);
          const opts = await options;
          setOptions(opts);
          setLoading(false);
        }
      }
      load();
    }, [asyncOptionsHandler, context, options, owner, props]);

    const filter = filterSource ? owner.getValue(filterSource) : null;
    let filteredOptions = filterSource
      ? currentOptions.filter((v: any) => v[filterColumn] === filter)
      : currentOptions;

    // we may map to different fields
    if (textField || valueField) {
      filteredOptions = filteredOptions.map(o => ({
        text: textField ? o[textField] : o.text,
        value: valueField ? o[valueField] : o.value
      }));
    }

    if (!formElement.elements || formElement.elements.length === 0) {
      return (
        <DynamicComponent
          {...props}
          {...extraProps}
          control={component}
          controlProps={dropdownProps}
          error={error}
          options={filteredOptions}
          loading={loading === true ? 'true' : undefined}
          showError={true}
          onChange={handleChange}
          value={value || ''}
          children={renderOptions ? renderOptions(props, filteredOptions, context) : undefined}
        />
      );
    }
    return (
      <DynamicComponent {...props} {...extraProps} control={component} controlProps={dropdownProps}>
        {renderElementOptions && renderElementOptions(props, context)}
      </DynamicComponent>
    );
  });
  return DropdownView;
}

export const DropdownView = createDropdownComponent(
  'select',
  [],
  {},
  (_, options) =>
    options.map((e, i) => (
      <option key={i} value={e.value}>
        {e.text}
      </option>
    )),
  (props, context) =>
    props.formElement.elements.map((e, i) => (
      <option key={i} value={e.uid}>
        {props.catalogue.createComponent(props, e, context)}
      </option>
    ))
);
