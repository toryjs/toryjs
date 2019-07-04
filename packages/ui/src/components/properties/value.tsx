import * as React from 'react';

import { observer } from 'mobx-react';
import { FormComponentProps } from '@toryjs/form';
import { safeGetValue } from '../../helpers';
import { EditorContext } from '../../editor/editor_context';

export const Value: React.FC<FormComponentProps> = observer(props => {
  const context = React.useContext(EditorContext);
  return <div className="input">{safeGetValue(props, context)}</div>;
});
