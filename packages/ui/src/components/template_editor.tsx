import React from 'react';
import { FormComponentProps, Option } from '@toryjs/form';
import { observer } from 'mobx-react';
import { EditorControl, SingleDropCell } from '../editor/layouts_common_editor';
import { EditorContext } from '../editor/editor_context';

type EditorProps = {
  EmptyCell?: any;
};

type Props = FormComponentProps & {
  Component: React.ComponentType<FormComponentProps & EditorProps>;
  Template?: React.ComponentType<FormComponentProps & { templateIndex: number }>;
  options: Option[];
};

export const TemplateEditor = observer((props: Props) => {
  const { Component, Template, options, formElement, catalogue, owner, handlers } = props;
  const context = React.useContext(EditorContext);
  const template = formElement.props.template;
  const index = template ? options.findIndex(o => o.value === template) : 0;
  return (
    <>
      {index === 0 && (
        <Component
          formElement={formElement}
          catalogue={catalogue}
          owner={owner}
          handlers={handlers}
          extra={props.extra}
          EmptyCell={(props: FormComponentProps) => (
            <SingleDropCell id="0" {...props} editorState={context} />
          )}
        />
      )}
      {index > 0 &&
        (Template ? (
          <Template {...props} templateIndex={index - 1} />
        ) : (
          <EditorControl
            formElement={
              formElement.elements.length > index - 1 ? formElement.elements[index - 1] : undefined
            }
            editorState={context}
            props={props}
            EmptyCell={(props: FormComponentProps) => (
              <SingleDropCell id="0" {...props} editorState={context} elementIndex={index - 1} />
            )}
          />
        ))}
    </>
  );
});
