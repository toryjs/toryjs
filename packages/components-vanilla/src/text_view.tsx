import React from 'react';
import { FormComponentProps, FormComponent, BoundProp } from '@toryjs/form';
import {
  Context,
  css,
  pointer,
  tryInterpolate,
  getValue,
  DynamicControl,
  sourceValue
} from '@toryjs/ui';
import { observer } from 'mobx-react';

const formText = css`
  margin-top: 20px;
  label: formText;
`;

/* =========================================================
    Text
   ======================================================== */

export type TextProps = {
  value: string;
  text: string;
  inline: boolean;
};

export const TextComponent: React.FC<FormComponentProps<TextProps>> = props => {
  const context = React.useContext(Context);
  const text = getValue(props, context, 'value');
  const inline = getValue(props, context, 'inline');

  let parsedText = '';
  try {
    parsedText = tryInterpolate(text, props.owner);
  } catch (ex) {
    parsedText = '<b style="color: red">Error: </b>' + ex.message;
  }
  return (
    <DynamicControl
      {...props}
      styleName={inline ? formText : ''}
      dangerouslySetInnerHTML={{ __html: parsedText }}
    />
  );
};

export const TextView: FormComponent<TextProps> = {
  Component: TextComponent,
  toString: f => f.props.text
};

/* =========================================================
    Image
   ======================================================== */

export type ImageProps = {
  text?: string;
  src?: string;
  imageWidth?: string;
  imageHeight?: string;
};

const imageProps = ['alt', 'src'];

export const Image: React.FC<FormComponentProps<ImageProps>> = props => {
  const context = React.useContext(Context);
  return (
    <DynamicControl
      {...props}
      controlProps={imageProps}
      control="img"
      style={{
        width: getValue(props, context, 'imageWidth'),
        height: getValue(props, context, 'imageHeight')
      }}
    />
  );
};

Image.displayName = 'Image';

export const ImageView: FormComponent<ImageProps> = {
  Component: Image,
  toString: formElement => formElement.props.url
};

/* =========================================================
    LINK
   ======================================================== */

const controlProps = ['target'];

export type LinkProps = {
  text: string;
  url: string;
};

export const Link: React.FC<FormComponentProps<LinkProps>> = props => {
  const {
    owner,
    formElement: {
      props: { text, url }
    }
  } = props;
  return (
    <DynamicControl
      {...props}
      control="a"
      controlProps={controlProps}
      href={tryInterpolate(url, owner)}
    >
      {tryInterpolate(text, owner) || '[Link]'}
    </DynamicControl>
  );
};

export const LinkView: FormComponent<LinkProps> = {
  Component: Link,
  toString: (owner, { formElement }) => {
    return `[${formElement.props.url}] ${tryInterpolate(formElement.props.url, owner)}`;
  }
};

/* =========================================================
    LINK SELECTOR
   ======================================================== */

export type LinkSelectorProps = {
  text: string;
  target: BoundProp;
  source: BoundProp;
};

export const LinkSelectorComponent: React.FC<FormComponentProps<LinkSelectorProps>> = props => {
  const { formElement, owner } = props;
  const { text, target } = formElement.props;
  const context = React.useContext(Context);
  const onClick = React.useCallback(
    () => owner.setValue(sourceValue(target), getValue(props, context, 'source')),
    [context, owner, props, target]
  );
  return (
    <DynamicControl {...props} control="a" styleName={pointer} onClick={onClick}>
      {tryInterpolate(text, owner)}
    </DynamicControl>
  );
};

export const LinkSelectorView: FormComponent<LinkSelectorProps> = {
  Component: observer(LinkSelectorComponent),
  toString: (owner, props, context) => {
    return tryInterpolate(getValue(props, context), owner);
  }
};
