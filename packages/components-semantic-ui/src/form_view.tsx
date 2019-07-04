import * as React from 'react';

import { FormView, css } from '@toryjs/ui';
import { FormViewProps } from '@toryjs/form';

export const formStyle = css`
  .disabled,
  :disabled {
    opacity: 1 !important;
    cursor: auto;
  }

  label {
    cursor: auto !important;
  }

  label:before {
    border: solid 1px #d4d4d5 !important;
  }
`;

export const SemanticFormView: React.FC<FormViewProps> = props => (
  <FormView {...props} className={props.readOnly ? formStyle : ''} />
);
