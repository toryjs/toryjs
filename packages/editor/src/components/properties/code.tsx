import * as React from 'react';

import { observer } from 'mobx-react';

import { FormComponentProps } from '@toryjs/form';

import Editor from 'react-simple-code-editor';

//@ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-dark.css';
import { setValue, Context } from '@toryjs/ui';
import { parseProps } from './properties_common';

export const CodeEditor = observer((props: FormComponentProps) => {
  const context = React.useContext(Context);
  const onChange = React.useMemo(() => (code: string) => setValue(props, context, code), [
    context,
    props
  ]);

  const { formElement } = props;
  const { value } = parseProps(props, context, true);
  // const value = getValue(props, context, 'value', '');

  return (
    <Editor
      value={value || ''}
      onValueChange={onChange}
      highlight={code => highlight(code || '', languages[formElement.props.language])}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        flex: 1,
        marginTop: '3px',
        marginLeft: '3px'
      }}
    />
  );
});
