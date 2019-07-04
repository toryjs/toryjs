import * as React from 'react';

import { HeaderProps as SuiHeaderProps, Header, Icon } from 'semantic-ui-react';
import { FormComponentProps } from '@toryjs/form';
import { tryInterpolate, createComponents, getValues, DynamicComponent } from '@toryjs/ui';

type HeaderProps = SuiHeaderProps & {
  titleSource: string;
};

const controlProps = [
  'attached',
  'block',
  'color',
  'content',
  'disabled',
  'dividing',
  'floated',
  'icon',
  'image',
  'inverted',
  'size',
  'sub',
  'subheader',
  'textAlign'
];

export const HeaderView: React.FC<FormComponentProps<HeaderProps>> = props => {
  const { formElement, owner } = props;

  const [content, icon] = getValues(props, 'content');

  let interpolatedContent = tryInterpolate(content, owner);

  if (!formElement.elements || formElement.elements.length == 0) {
    return (
      <DynamicComponent
        control={Header}
        controlProps={controlProps}
        content={interpolatedContent}
        {...props}
      />
    );
  }

  return (
    <DynamicComponent control={Header} controlProps={controlProps} {...props}>
      {icon && <Icon name={icon} />}
      {formElement.elements && formElement.elements.length && (
        <Header.Content>{createComponents(props)}</Header.Content>
      )}
    </DynamicComponent>
  );
};

HeaderView.displayName = 'HeaderView';
