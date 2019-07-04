import * as React from 'react';

import {
  Menu,
  SemanticCOLORS,
  SemanticWIDTHS,
  MenuItemProps as MenuItemSui
} from 'semantic-ui-react';
import { FormComponentProps } from '@toryjs/form';
import { isNullOrEmpty, names, handle, Context, DynamicComponent, getValue } from '@toryjs/ui';

export type MenuProps = {
  attached: 'top' | 'bottom';
  borderless: boolean;
  className: string;
  color: SemanticCOLORS;
  compact: boolean;
  defaultActiveIndex: number;
  defaultActive: string;
  fixed: 'left' | 'right' | 'bottom' | 'top';
  floated: boolean | 'right';
  fluid: boolean;
  icon: boolean | 'labeled';
  inverted: boolean;
  pagination: boolean;
  pointing: boolean;
  secondary: boolean;
  size: 'mini' | 'tiny' | 'small' | 'large' | 'huge' | 'massive';
  stackable: boolean;
  tabular: boolean | 'right';
  text: boolean;
  vertical: boolean;
  widths: SemanticWIDTHS;
  subMenu: boolean;
};

export type MenuChildProps = {
  name: string;
  customItem: boolean;
};

type MenuItemProps = MenuItemSui & {
  onClick: string;
};

const menuControlProps = [
  'attached',
  'borderless',
  'color',
  'compact',
  'fixed',
  'floated',
  'fluid',
  'icon',
  'inverted',
  'pagination',
  'pointing',
  'secondary',
  'size',
  'stackable',
  'tabular',
  'text',
  'vertical',
  'widths'
];

const menuItemControlProps = ['content', 'icon'];

export const MenuItem: React.FC<FormComponentProps<MenuItemProps>> = props => {
  const context = React.useContext(Context);
  const clickHandler = props.formElement.props.onClick;
  const onClick = React.useCallback(() => {
    if (clickHandler) {
      handle(props.handlers, clickHandler, props.owner, props, props.formElement, context);
    }
  }, [clickHandler, context, props]);

  return (
    <DynamicComponent
      {...props}
      controlProps={menuItemControlProps}
      control={Menu.Item}
      onClick={onClick}
      as="div"
    />
  );
};

export const MenuView: React.FC<
  FormComponentProps<MenuProps, MenuChildProps> & { EmptyCell?: any }
> = props => {
  const context = React.useContext(Context);
  const { formElement } = props;
  const value = getValue(props, context);
  const [selection] = React.useState(
    value ||
      (formElement.elements && formElement.elements.length && formElement.elements[0].props.name)
  );
  // const onClick = React.useCallback((e: React.MouseEvent<any>) => {
  //   setSelection(e.currentTarget.getAttribute('data-name'));
  // }, []);

  const MenuType = formElement.props.subMenu ? Menu.Menu : Menu;

  return (
    <>
      <DynamicComponent {...props} control={MenuType} controlProps={menuControlProps}>
        {(formElement.elements || []).map((m, i) => (
          <React.Fragment key={i}>
            {props.catalogue.createComponent(
              {
                ...(props as any),
                className: names(props.className, {
                  active: !isNullOrEmpty(selection) && m.props.name === selection
                })
              },
              m,
              context
            )}
          </React.Fragment>
        ))}
        {props.formElement.elements.length === 0 && props.EmptyCell && (
          <Menu.Item data-no-drop={true}>
            <props.EmptyCell {...props} />
          </Menu.Item>
        )}
      </DynamicComponent>
    </>
  );
};
