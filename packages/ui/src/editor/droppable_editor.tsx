import React from 'react';
import { FormComponentProps } from '@toryjs/form';
import { css } from 'emotion';

import { names } from '../common';
import { EditorContext } from './editor_context';
import { FormDataSet } from './form_store';
import { DragDrop } from './drag_drop';
import { SingleDropCell } from './layouts_common_editor';
import { processor } from './editor_common';
import { dragDropHandler } from './drag_drop_form_control';

const extraPad = css`
  padding-top: 1px;
`;

type Props = {
  Component: React.ComponentType<any>;
  layout: 'row' | 'column';
};

export const DropComponentEditor: React.FC<FormComponentProps<any> & Props> = props => {
  const context = React.useContext(EditorContext);

  const dropHandler = React.useCallback(
    dragDropHandler(context, props.formElement as FormDataSet),
    [context.dragItem, props.formElement]
  );

  const drag = React.useMemo(
    () =>
      new DragDrop(
        props.layout,
        props.formElement as FormDataSet,
        processor,
        `color: ${context.theme.textColor}!important;`,
        'editor',
        dropHandler,
        null,
        false,
        35,
        context
      ),
    [context, dropHandler, props.formElement, props.layout]
  );

  return (
    <props.Component
      {...props}
      {...drag.props()}
      className={names(props.className, extraPad)}
      data-editor="isEditor"
      EmptyCell={(props: FormComponentProps) => (
        <SingleDropCell id="0" {...props} editorState={context} />
      )}
    />
  );
};
