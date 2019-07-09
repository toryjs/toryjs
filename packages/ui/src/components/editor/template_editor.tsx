import React from 'react';
import { FormComponentProps, Option } from '@toryjs/form';
import { observer } from 'mobx-react';
import { Context } from '../../context';
import { SingleDropCell } from './single_drop_cell';
import { EditorControl } from './editor_control';

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
  const context = React.useContext(Context);
  const template = formElement.props.template;
  const index = template ? options.findIndex(o => o.value === template) : 0;

  const templateElement =
    formElement.elements.length > index - 1 ? formElement.elements[index - 1] : undefined;
  return (
    <>
      {index === 0 && (
        <Component
          formElement={formElement}
          catalogue={catalogue}
          owner={owner}
          handlers={handlers}
          extra={props.extra}
          dataProps={props.dataProps}
          EmptyCell={(props: FormComponentProps) => <SingleDropCell id="0" {...props} />}
        />
      )}
      {index > 0 &&
        (Template ? (
          <Template {...props} templateIndex={index - 1} />
        ) : (
          <EditorControl
            formElement={
              templateElement &&
              templateElement.elements &&
              templateElement.elements.length > 0 &&
              templateElement.elements[0]
            }
            editorState={context}
            props={{ ...props, formElement: templateElement }}
            EmptyCell={(props: FormComponentProps) => (
              <SingleDropCell id="0" {...props} elementIndex={index - 1} />
            )}
          />
        ))}
    </>
  );
});

TemplateEditor.displayName = 'TemplateEditor';
