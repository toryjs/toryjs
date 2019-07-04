import * as React from 'react';

import { ImageProps, Link, TextView, TextProps, ImageView, LinkSelectorView } from './text_view';
import { FormComponentProps, EditorComponent } from '@toryjs/form';
import { observer } from 'mobx-react';
import { propGroup, prop, boundProp, getValue, Context, DynamicComponent } from '@toryjs/ui';

/* =========================================================
    Text
   ======================================================== */

const TextEditorComponent: React.FC<FormComponentProps<TextProps>> = props => {
  const context = React.useContext(Context);
  if (!getValue(props, context)) {
    return <DynamicComponent {...props}>[Text]</DynamicComponent>;
  }
  return <TextView.Component {...props} />;
};

export const TextEditor: EditorComponent = {
  Component: observer(TextEditorComponent),
  title: 'Text',
  control: 'Text',
  icon: 'font',
  props: propGroup('Text', {
    value: boundProp({
      props: { label: '', display: 'padded' },
      control: 'Textarea'
    })
  })
};

/* =========================================================
    IMAGE
   ======================================================== */

const ImageEditorComponent = (props: FormComponentProps<ImageProps>) => {
  let context = React.useContext(Context);
  let src = getValue(props, context, 'src');
  if (!src) {
    return <DynamicComponent {...props}>[Image]</DynamicComponent>;
  }
  return <ImageView.Component {...props} />;
};

ImageEditorComponent.displayName = 'ImageEditor';

export const ImageEditor: EditorComponent = {
  Component: observer(ImageEditorComponent),
  title: 'Image',
  control: 'Image',
  icon: 'image outline',
  props: propGroup('Image', {
    alt: boundProp({
      props: { label: 'Alternative Text' }
    }),
    src: boundProp(),
    imageWidth: boundProp(),
    imageHeight: boundProp()
  })
};

/* =========================================================
    Link
   ======================================================== */

export const LinkEditor: EditorComponent = {
  Component: observer(Link),
  title: 'Link',
  control: 'Link',
  icon: 'anchor',
  props: propGroup('Link', {
    url: prop({
      documentation:
        'You can interpolate values using "${}" notation. For example "This is my ${name}", where <i>name</i> is a value from the dataset.'
    }),
    text: prop({
      documentation:
        'You can interpolate values using "${}" notation. For example "This is my ${name}", where <i>name</i> is a value from the dataset.'
    }),
    target: prop({
      control: 'Select',
      props: {
        options: [
          { text: 'None', value: '' },
          {
            text: 'New Window',
            value: '__empty'
          },
          {
            text: 'Current Page',
            value: '_self'
          }
        ]
      }
    })
  })
};

/* =========================================================
    Link Selector
   ======================================================== */

export const LinkSelectorEditor: EditorComponent = {
  Component: LinkSelectorView.Component,
  title: 'Selector',
  control: 'LinkSelector',
  icon: 'anchor',
  props: {
    ...propGroup('Selector', {
      text: prop({ control: 'Textarea' }),
      source: boundProp({
        documentation:
          'This value is stored to the target. You do not have to specify this and use "source", where the value from "source" will be stored in the "target"'
      }),
      target: boundProp({
        documentation: 'Dataset path to store the value'
      })
    })
  }
};
