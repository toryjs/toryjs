import * as React from 'react';

import { observer } from 'mobx-react';
import { FormComponentProps } from '@toryjs/form';
import { safeGetValue, Context } from '@toryjs/ui';

export const Value: React.FC<FormComponentProps> = observer(props => {
  const context = React.useContext(Context);
  return <div className="input">{safeGetValue(props, context)}</div>;
});
