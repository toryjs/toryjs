import React from 'react';
import { names } from '@toryjs/ui';
import { Context } from '@toryjs/ui';
import { Theme } from './themes/common';

export const styleComponent = (style: (theme: Theme) => string) => {
  const Styled = (props: any) => {
    const context = React.useContext(Context);
    return (
      <div {...props} className={names(style(context.editor.theme), props.className)}>
        {props.children}
      </div>
    );
  };
  return Styled;
};
