import React from 'react';
import { names, pointer } from '../../common';
import { EditorContext } from '../editor_context';

type Props = {
  value: string;
};

export const DatasetValue: React.FC<Props> = ({ value }) => {
  const state = React.useContext(EditorContext);

  if (!value) {
    return null;
  }
  return (
    <span
      className={names('meta', pointer)}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();

        state.dataPreview = value;
        state.previewOpen = true;
      }}
    >
      &nbsp;&middot;&nbsp;
      {Array.isArray(value)
        ? `Array [${value.length}]`
        : typeof value === 'object'
          ? 'Object'
          : JSON.stringify(value)}
    </span>
  );
};
