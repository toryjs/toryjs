import * as React from 'react';

import { observer } from 'mobx-react';

import { onChangeHandler, controlMargin, parseProps } from './properties_common';
import { FormComponentProps } from '@toryjs/form';
import { names, Context } from '@toryjs/ui';

export const Checkbox = observer((componentProps: FormComponentProps) => {
  const context = React.useContext(Context);
  const onChange = React.useMemo(
    () => onChangeHandler.bind({ props: componentProps, context: context }),
    [componentProps, context]
  );

  const { readOnly } = componentProps;
  const { value, error } = parseProps(componentProps, context, true);

  // console.log('Rendering: ' + value);

  return (
    <div className={controlMargin} title={componentProps.formElement.props.documentation}>
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
