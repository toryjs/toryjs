import React from 'react';

import { FormComponentProps } from '@toryjs/form';
import { Context, getValue, tryInterpolate, DynamicControl, css } from '@toryjs/ui';
import marked from 'marked';

/* =========================================================
    Text
   ======================================================== */

const formText = css`
  margin-top: 20px;
  label: formText;
`;

export type TextProps = {
  value: string;
  text: string;
  inline: boolean;
};

export const MarkdownComponent: React.FC<FormComponentProps<TextProps>> = props => {
  const context = React.useContext(Context);
  const text = getValue(props, context, 'value');
  const inline = getValue(props, context, 'inline');

  let parsedText = '';
  try {
    parsedText = tryInterpolate(text.replace(/`/g, '\\`'), props.owner);
  } catch (ex) {
    parsedText = '<b style="color: red">Error: </b>' + ex.message;
  }
  return (
    <DynamicControl
      {...props}
      styleName={inline ? formText : ''}
      dangerouslySetInnerHTML={{ __html: marked(parsedText) }}
    />
  );
};
