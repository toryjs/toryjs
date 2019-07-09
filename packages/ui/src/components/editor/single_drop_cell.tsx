import React, { useState } from 'react';
import { FormDataSet } from './definitions';
import { FormComponentProps } from '@toryjs/form';
import { DropCell } from './editor_cell';
import { Context } from '../../context';

const cell = { control: 'EditorCell', props: { row: 1, column: 1 } };

type FirstDropCellProps = {
  elementIndex?: number;
  className?: string;
  id?: string;
};

export const EditorDropCell: React.FC<any> = props => (
  <div onClick={props.onClick} onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut}>
    <SingleDropCell id="0" {...props} />
  </div>
);

export const SingleDropCell: React.FC<FormComponentProps & FirstDropCellProps> = props => {
  let context = React.useContext(Context);
  const [update, setUpdate] = useState(false);

  const drop = React.useCallback(() => {
    const item = context.editor.dragItem;
    const element = props.formElement as FormDataSet;

    if (props.elementIndex == null) {
      element.addRow('elements', {
        label: item.label || '',
        control: item.name,
        source: item.source,
        props: { ...item.props, control: item.name },
        width: 1,
        elements: item.defaultChildren
      });
    } else {
      element.replaceRow('elements', props.elementIndex, {
        label: item.label || '',
        control: item.name,
        source: item.source,
        props: { ...item.props, control: item.name },
        width: 1,
        elements: item.defaultChildren
      });
    }

    setUpdate(!update);

    return false;
  }, []);

  return (
    <DropCell
      className={props.className}
      owner={props.owner}
      catalogue={props.catalogue}
      formElement={cell as FormDataSet}
      parentFormElement={props.formElement as FormDataSet}
      id={props.id || '0'}
      drop={drop}
    />
  );
};
