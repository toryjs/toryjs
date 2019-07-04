import * as React from 'react';

import { css } from 'emotion';
import { FormElement, EditorComponent } from '@toryjs/form';
import { Theme, names } from '../../common';
// import { calculateHorizontalPosition } from '../editor_common';
import { ToolIcon } from './tool_icon';
import { EditorContextType, EditorContext } from '../editor_context';
import { calculateHorizontalPosition } from '../editor_common';
import { clearAll } from '../drag_drop';

const bareItem = (theme: Theme) => css`
  /* border: 1px solid #deded2;
  background-color: white;*/
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${theme.textColor};
  /* border-bottom: dotted 1px #444; */
  padding-bottom: 6px;
  padding-top: 6px;
`;

const style = css`
  cursor: move;
  width: 100%;
  height: 100%;
  display: flex;
`;

interface BoxProps {
  control: string;
  title: string;
  icon?: string;
  thumbnail?: {
    dark: string;
    light: string;
  };
  row?: number;
  column?: number;
  id: string;
  formElement?: FormElement;
  defaultChildren?: EditorComponent[];
  defaultProps?: { [index: string]: any };
  editorState: EditorContextType;
}

export const ToolItem: React.FC<BoxProps> = props => {
  const context = React.useContext(EditorContext);
  const { title, icon, children, thumbnail } = props;
  const onDrag = React.useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      context.dragItem = {
        name: props.control,
        row: props.row,
        column: props.column,
        element: props.formElement,
        id: props.id,
        position: calculateHorizontalPosition(ev),
        props: props.defaultProps,
        defaultChildren: props.defaultChildren
      };
    },
    [
      context.dragItem,
      props.column,
      props.control,
      props.defaultChildren,
      props.defaultProps,
      props.formElement,
      props.id,
      props.row
    ]
  );

  const onDragEnd = React.useCallback(() => clearAll(context), [context]);

  return (
    <div
      draggable={true}
      className={names(style, { [bareItem(context.theme)]: !children })}
      data-id={props.id}
      onDragStart={onDrag}
      onDragEnd={onDragEnd}
    >
      {children ? (
        children
      ) : (
        <>
          <ToolIcon icon={icon} thumbnail={thumbnail} />
          {title}
        </>
      )}
    </div>
  );
};
