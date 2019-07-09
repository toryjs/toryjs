import * as React from 'react';

import { FormComponentProps, FormComponent, FormElement } from '@toryjs/form';

import { observer } from 'mobx-react';
import { processControls } from './layouts_common';
import { DynamicComponent, css, Context } from '@toryjs/ui';

export type StackProps = {
  layout: 'row' | 'column';
  gap: string;
  padding: string;
  final: boolean;
};

export type StackChildProps = {};

export function itemCSS(formElement: FormElement, layout: 'column' | 'row') {
  let itemCSS =
    layout === 'row' ||
    (formElement.props.padding && formElement.props.padding != '0px') ||
    (formElement.props.gap && formElement.props.gap != '0px')
      ? `padding: ${formElement.props.padding}; 
         margin: ${formElement.props.gap};
         display: ${layout === 'row' ? 'inline-block' : 'block'};
         :first-of-type label,
         :first-of-type {
           margin-top: 0px;
           padding-top: 0px;
         }
         label: item-${layout};
         `
      : '';
  return itemCSS ? css([itemCSS]) : '';
}

const StackComponent: React.FC<FormComponentProps<StackProps, StackChildProps>> = props => {
  const context = React.useContext(Context);
  const controls = processControls(props) || [];
  const itemsCss = itemCSS(props.formElement, props.formElement.props.layout);

  return (
    <>
      <DynamicComponent {...props}>
        {controls.map((element, i) =>
          itemsCss ? (
            <div className={itemsCss} key={i}>
              {props.catalogue.createComponent(props, element, context, null)}
            </div>
          ) : (
            <React.Fragment key={i}>
              {props.catalogue.createComponent(props, element, context, itemsCss)}
            </React.Fragment>
          )
        )}
      </DynamicComponent>
    </>
  );
};

export const StackView: FormComponent = {
  Component: observer(StackComponent),
  toString(owner, props, catalogue) {
    return props.formElement.elements
      .map(s => catalogue.components[s.control].toString(s, owner, catalogue))
      .join('\n');
  }
};
