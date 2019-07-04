import * as React from 'react';

import { Dropdown, DropdownProps as SuiDropdownProps } from 'semantic-ui-react';
import { FormComponentProps } from '@toryjs/form';

import { observer } from 'mobx-react';

import { processControl, getValues, simpleHandle } from '@toryjs/ui';
import { DynamicComponent } from '@toryjs/ui';

type Props = {
  filterSource: string;
  filterColumn: string;
  schemaSource: string;
  template: string;
  asyncOptions: string;
};

const controlProps = [
  'basic',
  'button',
  'className',
  'clearable',
  'closeOnBlur',
  'closeOnChange',
  'compact',
  'deburr',
  'defaultOpen',
  'direction',
  'floating',
  'fluid',
  'header',
  'icon',
  'item',
  'labeled',
  'lazyLoad',
  'loading',
  'minCharacters',
  'noResultsMessage',
  'onAddItem',
  'onBlur',
  'onChange',
  'onClose',
  'onClick',
  'onFocus',
  'onLabelClick',
  // 'onLoadOptions',
  'onMouseDown',
  'onOpen',
  'onSearchChange',
  // 'onSearch',
  'open',
  'options',
  'openOnFocus',
  'placeholder',
  'pointing',
  'scrolling',
  'search',
  'searchQuery',
  'selectOnBlur',
  'selectOnNavigation',
  'selection',
  'simple',
  'text',
  'upward',
  'wrapSelection',
  'value'
];

export type MenuChildProps = {
  name: string;
};

export type DropdownProps = SuiDropdownProps & Props;

export const DropdownView = observer((props: FormComponentProps<DropdownProps>) => {
  const { handleChange, error, formElement, owner, context, value } = processControl(props);
  const [filterSource, filterColumn, schemaSource, options, asyncOptionsHandler] = getValues(
    props,
    'filterSource',
    'filterColumn',
    'schemaSource',
    'options',
    'asyncOptions'
  );

  // const options = React.useMemo(() => getValue(props, context, 'options'), [context, props]);

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
  const filteredOptions = filterSource
    ? currentOptions.filter((v: any) => v[filterColumn] === filter)
    : currentOptions;

  if (!formElement.elements || formElement.elements.length === 0) {
    return (
      <DynamicComponent
        {...props}
        control={Dropdown}
        controlProps={controlProps}
        error={!!error}
        options={filteredOptions}
        loading={loading}
        showError={true}
        onChange={handleChange}
        value={value || ''}
      />
    );
  }
  return (
    <DynamicComponent {...props} control={Dropdown} controlProps={controlProps}>
      <Dropdown.Menu>
        {formElement.elements &&
          formElement.elements.map((m, i) => (
            <Dropdown.Item key={i} data-name={m.props.name} data-value={m.props.value}>
              {props.catalogue.createComponent(props, m, context)}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </DynamicComponent>
  );
});
