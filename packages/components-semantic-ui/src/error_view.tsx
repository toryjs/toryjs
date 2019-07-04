import * as React from 'react';

import { observer } from 'mobx-react';
import { Label } from 'semantic-ui-react';
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

export function renderError(error: string, pointing: PointingProps) {
  return (
    <Label pointing={pointing} color="red">
      {error}
    </Label>
  );
}

const ErrorViewComponent = ({ owner, source, newLine, inline, pointing = true }: ErrorProps) => {
  if (!owner.getError) {
    return null;
  }
  pointing = inline ? 'left' : pointing;

  let error: string = source && owner.getError(source);

  if (!error) {
    return null;
  }

  if (newLine) {
    return <div>{renderError(error, pointing)}</div>;
  }

  return renderError(error, pointing);
};

ErrorViewComponent.displayName = 'ErrorView';

export const ErrorView = observer(ErrorViewComponent);

type ErrorLabelProps = { error: string; pointing?: PointingProps };

const ErrorLabelComponent = ({ error, pointing = true }: ErrorLabelProps) => {
  if (!error) {
    return null;
  }
  return (
    <Label color="red" pointing={pointing}>
      {error}
    </Label>
  );
};
ErrorLabelComponent.displayName = 'ErrorLabel';

export const ErrorLabel = observer(ErrorLabelComponent);
