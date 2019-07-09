import * as React from 'react';

import { observer } from 'mobx-react';
import { DataSet, FormElement } from '@toryjs/form';

type PointingProps = boolean | 'above' | 'left' | 'right' | 'below';

type ErrorProps = {
  owner: DataSet;
  control?: FormElement;
  source: string;
  pointing?: PointingProps;
  newLine?: boolean;
  inline?: boolean;
};

export function renderError(error: string, pointing: PointingProps, inline: boolean) {
  return (
    <div
      className={`ui red ${pointing} pointing label`}
      style={{ display: inline ? 'inline-block' : 'block' }}
    >
      {error}
    </div>
  );
}

export const ErrorView = observer(({ owner, source, inline, pointing = true }: ErrorProps) => {
  if (!owner.getError) {
    return null;
  }
  pointing = inline ? 'left' : pointing;

  let error: string = source && owner.getError(source);

  if (!error) {
    return null;
  }
  return renderError(error, pointing, inline);
});

ErrorView.displayName = 'ErrorView';
