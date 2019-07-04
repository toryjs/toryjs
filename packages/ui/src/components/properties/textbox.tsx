import * as React from 'react';

import { observer } from 'mobx-react';

import { parseProps, onChangeHandler } from './properties_common';
import { FormComponentProps } from '@toryjs/form';
import { EditorContext } from '../../editor/editor_context';

function autosize(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  var el = e.currentTarget;
  setTimeout(function() {
    const h = el.scrollHeight;
    el.style.cssText = 'height:auto; padding:0';
    // for box-sizing other than "content-box" use:
    // el.style.cssText = '-moz-box-sizing:content-box';
    el.style.cssText = 'height:' + (h < 200 ? h : 200) + 'px';
  }, 0);
}

export const TextArea = observer((props: FormComponentProps) => {
  const context = React.useContext(EditorContext);
  const onChange = React.useMemo(() => onChangeHandler.bind({ props, editorState: context }), [
    props,
    context
  ]);

  const { formElement, readOnly } = props;
  const { value, error } = parseProps(props, context, true);

  return (
    <textarea
      className={error ? 'invalid' : ''}
      value={value || ''}
      onChange={onChange}
      disabled={readOnly}
      onKeyDown={autosize}
      id={formElement.uid}
    />
  );
});
