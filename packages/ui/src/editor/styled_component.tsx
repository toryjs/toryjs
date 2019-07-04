import React from 'react';
import { names, Theme } from '../common';
import { EditorContext } from './editor_context';

export const styleComponent = (style: (theme: Theme) => string) => {
  const Styled = (props: any) => {
    const context = React.useContext(EditorContext);
    return (
      <div {...props} className={names(style(context.theme), props.className)}>
        {props.children}
      </div>
    );
  };
  return Styled;
};
