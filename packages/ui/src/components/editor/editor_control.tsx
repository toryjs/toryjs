import * as React from 'react';

import { FormComponentProps, FormElement } from '@toryjs/form';

import { observer } from 'mobx-react';
import { editorProps } from './create_control';
import { Context, ContextType } from '../../context';
import { FormDataSet } from './definitions';
import { createComponent1, names } from '../../common';
import { selected } from './styles';
import { createComponents } from '../../helpers';

type EditorControlProps = {
  props: FormComponentProps;
  formElement: FormElement;
  editorState?: ContextType;
  className?: string;
  allowInsert?: boolean;
  EmptyCell?: any;
};

export function createComponent(
  props: FormComponentProps,
  formElement: FormElement,
  _context: any,
  className?: string,
  allowInsert?: boolean
): JSX.Element {
  return (
    <EditorControl
      props={props}
      formElement={formElement}
      className={className}
      allowInsert={allowInsert}
    />
  );
}

export const EditorControl = observer(
  ({ formElement, props, EmptyCell, className = '' }: EditorControlProps) => {
    let context = React.useContext(Context);
    let controlProps = editorProps(formElement as FormDataSet, props);

    if (!formElement) {
      return <EmptyCell {...props} />;
    }

    // remember the props, we use this to generate the list of possible binding sources
    context.editor.props[formElement.uid] = { ...props, formElement };

    return createComponent1(
      props,
      formElement,
      context,
      names(className, { [selected]: (formElement as FormDataSet).isSelected }),
      { ...controlProps }
    );
  }
);

EditorControl.displayName = 'EditorControl';

export const CreateComponents = (props: FormComponentProps) => createComponents(props);
