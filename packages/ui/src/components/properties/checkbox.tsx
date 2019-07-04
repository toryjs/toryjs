import * as React from 'react';

import { observer } from 'mobx-react';

import { onChangeHandler, controlMargin, parseProps } from './properties_common';
import { FormComponentProps } from '@toryjs/form';
import { EditorContext } from '../../editor/editor_context';
import { names } from '../../common';

export const Checkbox = observer((componentProps: FormComponentProps) => {
  const context = React.useContext(EditorContext);
  const onChange = React.useMemo(
    () => onChangeHandler.bind({ props: componentProps, editorState: context }),
    [componentProps, context]
  );

  const { readOnly } = componentProps;
  const { value, error } = parseProps(componentProps, context, true);

  // console.log('Rendering: ' + value);

  return (
    <div className={controlMargin}>
      <input
        key={(!!value).toString() + 'key'}
        type="checkbox"
        name="source"
        checked={value}
        data-value={value}
        onChange={onChange}
        className={names({ invalid: error })}
        readOnly={readOnly}
      />
    </div>
  );
});
