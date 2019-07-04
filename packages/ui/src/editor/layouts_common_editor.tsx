import * as React from 'react';

import { FormComponentProps, FormElement } from '@toryjs/form';

import { createComponents, createComponent1, names } from '../common';
import { CellHighlighter } from './form/cell_highlighter';
import { observer } from 'mobx-react';
import { EditorContext, EditorContextType } from './editor_context';
import { FormDataSet } from './form_store';
import { DropCell } from './form/editor_cell';
import { selected } from './layouts_styles';
import { editorProps } from './create_control';

const cell = { control: 'EditorCell', props: { row: 1, column: 1 } };

type EditorControlProps = {
  props: FormComponentProps;
  formElement: FormElement;
  editorState?: EditorContextType;
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
    let editorState = React.useContext(EditorContext);
    let controlProps = editorProps(formElement as FormDataSet, props);

    if (!formElement) {
      return <EmptyCell {...props} />;
    }

    return createComponent1(
      props,
      formElement,
      editorState,
      names(className, { [selected]: (formElement as DynamicForm.FormDataSet).isSelected }),
      { ...controlProps }
    );
  }
);

EditorControl.displayName = 'EditorControl';

type FirstDropCellProps = {
  elementIndex?: number;
  className?: string;
  id?: string;
};

export const EditorDropCell: React.FC<any> = props => (
  <div onClick={props.onClick} onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut}>
    <SingleDropCell id="0" {...props} />
  </div>
);

export class SingleDropCell extends React.Component<FormComponentProps & FirstDropCellProps> {
  static contextType = EditorContext;

  context: EditorContextType;
  highlighter = new CellHighlighter(1, 1);

  drop = () => {
    const item = this.context.dragItem;
    const element = this.props.formElement as FormDataSet;

    if (this.props.elementIndex == null) {
      element.addRow('elements', {
        label: item.label || '',
        control: item.name,
        source: item.source,
        props: { ...item.props, control: item.name },
        width: 1,
        elements: item.defaultChildren
      });
    } else {
      element.replaceRow('elements', this.props.elementIndex, {
        label: item.label || '',
        control: item.name,
        source: item.source,
        props: { ...item.props, control: item.name },
        width: 1,
        elements: item.defaultChildren
      });
    }

    this.forceUpdate();

    return false;
  };

  render() {
    return (
      <DropCell
        className={this.props.className}
        editorState={this.context}
        owner={this.props.owner}
        catalogue={this.props.catalogue}
        formElement={cell as FormDataSet}
        parentFormElement={this.props.formElement as FormDataSet}
        id={this.props.id || '0'}
        highlighter={this.highlighter}
        drop={this.drop}
      />
    );
  }
}

export const CreateComponents = (props: FormComponentProps) => createComponents(props);
