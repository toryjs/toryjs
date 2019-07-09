import React from 'react';
import { names, pointer } from '@toryjs/ui';
import { Context } from '@toryjs/ui';

type Props = {
  value: string;
};

export const DatasetValue: React.FC<Props> = ({ value }) => {
  const context = React.useContext(Context);

  if (!value) {
    return null;
  }
  return (
    <span
      className={names('meta', pointer)}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();

        context.editor.dataPreview = value;
        context.editor.previewOpen = true;
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
