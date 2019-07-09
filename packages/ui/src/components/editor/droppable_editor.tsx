import React from 'react';
import { FormComponentProps } from '@toryjs/form';
import { css } from 'emotion';

import { Context } from '../../context';
import { dragDropHandler } from './drag_drop_form_control';
import { FormDataSet } from './definitions';
import { DragDrop, Processor } from './drag_drop';
import { SingleDropCell } from './single_drop_cell';
import { names } from '../../common';

const extraPad = css`
  padding-top: 1px;
`;

type Props = {
  Component: React.ComponentType<any>;
  layout: 'row' | 'column';
};

export const processor: Processor<FormDataSet> = {
  children: owner => owner.elements,
  name: owner => {
    return (
      (owner.props.editorLabel && owner.props.editorLabel.value) ||
      (owner.props.label && owner.props.label.value) ||
      owner.control
    );
  },
  id: owner => (owner ? owner.uid : '')
};

export const DropComponentEditor: React.FC<FormComponentProps<any> & Props> = props => {
  const context = React.useContext(Context);

  const dropHandler = React.useCallback(
    dragDropHandler(context, props.formElement as FormDataSet),
    [context.editor.dragItem, props.formElement]
  );

  const drag = React.useMemo(
    () =>
      new DragDrop(
        props.layout,
        props.formElement as FormDataSet,
        processor,
        `color: ${context.editor.theme.textColor}!important;`,
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
      EmptyCell={(props: FormComponentProps) => <SingleDropCell id="0" {...props} />}
    />
  );
};
