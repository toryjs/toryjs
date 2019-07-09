import * as React from 'react';

import { observer } from 'mobx-react';
import { Menu, Segment } from 'semantic-ui-react';
import { Option } from '@toryjs/form';
import { DataSet, FormComponentProps, FormComponent, BoundProp, BoundType } from '@toryjs/form';

import { names, css, getValue, DynamicComponent, Context, getObjectValue } from '@toryjs/ui';

export const verticalStyle = css`
  /* name:vertical */
  display: flex;

  .tabMenu {
    flex: 1 auto;
  }

  .tabDivider {
    flex: 1 16px;
  }

  .tabContent {
    flex: 1 100%;
    margin-top: 0px;
  }
  label: vertical;
`;

export type TabProps = {
  menuItems: { text: string; value: string }[];
  valueField: string;
  textField: string;
  vertical: boolean;
  value: BoundProp;
};

type Props = {
  EmptyCell?: any;
};

const TabComponent: React.FC<FormComponentProps<TabProps> & Props> = props => {
  const [selection, setSelection] = React.useState(0);
  const context = React.useContext(Context);
  const { formElement, owner, EmptyCell } = props;
  const { menuItems, vertical, value } = formElement.props;

  let menus: Option[];
  let currentOwner: DataSet;

  // 1. if source and list are defined, we will display as many menus as there are fields in the array
  // 2. If only list is defined, we will take values from the enumerator and project into dataset

  const textField = getValue(props, context, 'textField');
  const valueField = getValue(props, context, 'valueField');
  const bound = value && (value as BoundType).source && valueField && textField;
  // const source = valueSource(formElement);

  if (bound) {
    let values = getValue(props, context) || [];

    menus = values.map((v: any) => ({
      text: getObjectValue(v, textField),
      value: getObjectValue(v, valueField)
    }));
    currentOwner = getValue(props, context)[selection]; // , `${source}.${selection}`);

    // add the editor
    if (bound && menus.length === 0) {
      menus = [{ text: '<Bound>', value: '' }];
    }
    // all items share the same form control
  } else menus = [];

  if (menuItems) {
    menus = menus.concat(menuItems);
    if (!bound) {
      currentOwner = owner;
    }
  }

  // select owner
  let element = bound
    ? formElement.elements[0]
    : formElement.elements.length > selection
    ? formElement.elements[selection]
    : undefined;

  return (
    <DynamicComponent {...props} styleName={vertical ? verticalStyle : 'none'}>
      <Menu
        attached={vertical ? undefined : 'top'}
        tabular={!vertical}
        vertical={!!vertical}
        className="tabMenu"
      >
        {menus.map((m, i) => (
          <Menu.Item
            icon={m.icon ? m.icon : undefined}
            content={m.text}
            key={i}
            onClick={() => {
              setSelection(i);
            }}
            active={selection === i}
          />
        ))}
      </Menu>

      {vertical && <div className="tabDivider" />}

      <Segment
        attached={vertical ? undefined : 'bottom'}
        basic={!!vertical}
        className={names({ noPadding: vertical }, 'tabContent')}
      >
        {!element && EmptyCell ? (
          <EmptyCell {...props} elementIndex={selection} />
        ) : (
          props.catalogue.createComponent(
            {
              ...(props as any),
              owner: currentOwner || owner
            },
            formElement.elements[bound ? 0 : selection],
            context
          )
        )}
      </Segment>
    </DynamicComponent>
  );
};

export const TabView: FormComponent = {
  Component: observer(TabComponent)
};
