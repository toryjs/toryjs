import React from 'react';

import { FormComponentProps } from '@toryjs/form';
import { createComponents } from '@toryjs/ui';

export type ContextProps = {
  contextUpgrade: string;
};

export const ContextComponent: React.FC<FormComponentProps<ContextProps>> = props => {
  return <>{createComponents(props)}</>;
};
