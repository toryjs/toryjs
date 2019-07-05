import React from 'react';

import { Dropdown } from 'semantic-ui-react';
import { createDropdownComponent } from '@toryjs/components-vanilla';

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

export const DropdownView = createDropdownComponent(
  Dropdown,
  controlProps,
  (_, props) => ({ loading: props.loading, error: !!props.error }),
  (props, context) =>
    props.formElement.elements.map((e, i) => (
      <Dropdown.Item key={i} value={e.uid}>
        {props.catalogue.createComponent(props, e, context)}
      </Dropdown.Item>
    ))
);
