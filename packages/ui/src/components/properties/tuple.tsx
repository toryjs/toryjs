import * as React from 'react';

import { observer } from 'mobx-react';
import names from 'classnames';

import { parseProps, onChangeHandler, controlMargin } from './properties_common';
import { FormComponentProps } from '@toryjs/form';
import { Input } from 'semantic-ui-react';
import { EditorContext } from '../../editor/editor_context';

type Props = {
  items: {
    label: string;
    source: string;
    type: string;
  }[];
};

export const Tuple = observer((componentProps: FormComponentProps<Props>) => {
  const context = React.useContext(EditorContext);
  const onChange = React.useMemo(
    () => onChangeHandler.bind({ props: componentProps, editorState: context }),
    [componentProps, context]
  );
  const { formElement, readOnly } = componentProps;
  const { value, error, props } = parseProps(componentProps, context);

  return (
    <div>
      {props.items.map((item, i) => (
        <Input
          key={i}
          type={item.type || 'text'}
          label={item.label}
          labelPosition="right"
          name={formElement.uid}
          className={names(controlMargin, { invalid: error })}
          onChange={onChange}
          data-value={value}
          value={value || ''}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
});

Tuple.displayName = 'Tuple';
