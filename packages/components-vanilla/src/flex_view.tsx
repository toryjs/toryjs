import * as React from 'react';

import { FormComponentProps, FormComponent } from '@toryjs/form';

import { css, DynamicComponent, Context } from '@toryjs/ui';
import { observer } from 'mobx-react';
import { FlexDirectionProperty, FlexWrapProperty } from 'csstype';
import { processControls } from './layouts_common';

export const stack = css`
  position: relative;
  display: flex;
  label: stack;
`;

// const sortRow = (a: FormElement, b: FormElement) => (a.column < b.column ? -1 : 1);
const containerBasis = {
  display: 'flex'
};
export function createContainerFlexStyle(props: FlexProps): React.CSSProperties {
  if (!props) {
    return containerBasis;
  }
  return {
    ...containerBasis,
    flexWrap: props.wrap,
    flexDirection: props.layout,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems,
    alignContent: props.alignContent
  };
}

const itemBasis = {
  flex: 'none'
};
export function createItemFlexStyle(props: FlexChildProps): React.CSSProperties {
  if (!props) {
    return itemBasis;
  }
  return {
    flex: !props.basis && !props.grow && !props.shrink ? 'none' : '',
    flexBasis: props.basis,
    flexGrow: props.grow,
    flexShrink: props.shrink,
    alignSelf: props.alignSelf
  };
}

export type Props = {
  EmptyCell?: React.FC<FormComponentProps>;
};

export type FlexProps = {
  gap: number;
  wrap: FlexWrapProperty;
  layout: FlexDirectionProperty;
  justifyContent: string;
  alignItems: string;
  alignContent: string;
};

export type FlexChildProps = {
  flex: string;
  basis: number;
  grow: number;
  shrink: number;
  alignSelf: string;
};

const FlexComponent: React.FC<FormComponentProps<FlexProps, FlexChildProps> & Props> = props => {
  const context = React.useContext(Context);
  const control = props.formElement;
  const controlProps: FlexProps = control.props;
  const controls = processControls(props);
  const className = css({ padding: controlProps.gap, label: 'gap' });

  return (
    <DynamicComponent {...props} style={createContainerFlexStyle(controlProps)}>
      {controls.map((element, i) => (
        <div key={i} style={createItemFlexStyle(element.props)} className={className}>
          {props.catalogue.createComponent(props, element, context)}
        </div>
      ))}
      {props.formElement.elements.length === 0 && props.EmptyCell && (
        <props.EmptyCell {...props} className={className} />
      )}
    </DynamicComponent>
  );
};

export const FlexView: FormComponent = {
  Component: observer(FlexComponent)
  // toString(owner, props, context, catalogue) {
  //   return props.formElement.elements
  //     .map(s => props.catalogue.components[s.control].toString(owner, props, context, catalogue))
  //     .join('\n');
  // }
};
