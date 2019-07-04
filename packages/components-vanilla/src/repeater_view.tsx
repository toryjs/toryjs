import * as React from 'react';

import { observer } from 'mobx-react';
import {
  DataSet,
  FormComponentProps,
  FormComponent,
  FormElement,
  buildDataSet,
  BoundProp
} from '@toryjs/form';

import { toJS } from 'mobx';
import {
  handle,
  simpleHandle,
  css,
  propName,
  valueSource,
  handlerValue,
  sourceValue,
  Context
} from '@toryjs/ui';

const noItems = css`
  margin: 6px 0px 12px 0px;
`;

export const repeaterAddButton = css`
  margin-top: 12px !important;
`;

type RowProps = FormComponentProps<RepeaterProps> & {
  data: DataSet;
  index: number;
  selectedIndex: number;
  select: (index: number) => void;
  editorTemplate: FormElement;
  viewTemplate: FormElement;
};

class RepeaterRow extends React.PureComponent<RowProps> {
  static contextType = Context;

  handlers = {
    ...this.props.handlers,
    deleteRow: () => {
      if (handlerValue(this.props.formElement.props.value)) {
        handle(
          this.props.handlers,
          this.props.formElement.props.onDelete,
          this.props.owner,
          this.props,
          this.context,
          this.props.data
        );
      } else {
        this.props.owner.removeRowData(
          sourceValue(this.props.formElement.props.value),
          this.props.data
        );
      }
    },
    editRow: () => {
      this.props.select(this.props.index);
    }
  };
  render() {
    let template =
      this.props.index === this.props.selectedIndex
        ? this.props.editorTemplate
        : this.props.viewTemplate;

    // we only make clickable props if the view template differs from edit template
    return this.props.catalogue.createComponent(
      {
        catalogue: this.props.catalogue,
        className: this.props.className,
        dataProps: this.props.dataProps,
        extra: this.props.extra,
        formElement: this.props.formElement,
        readOnly: this.props.readOnly,
        uid: this.props.uid,
        owner: this.props.data,
        handlers: this.handlers
      },
      template,
      this.context
      // '',
      // this.props.extra
    );
  }
}

type AddRowProps = {
  addTemplate: FormElement;
  addDataset: any;
  props: FormComponentProps;
};

const AddRow = observer(({ addTemplate, props }: AddRowProps) => {
  const context = React.useContext(Context);
  const boundSource = valueSource(props.formElement);

  const addDataset = React.useMemo(() => {
    let schema = props.owner.getSchema(boundSource).originalSchema.items;
    if (!schema.properties) {
      schema = { type: 'object', properties: { value: { type: schema.type } } };
    }
    return buildDataSet(schema, {});
  }, [boundSource, props.owner]);

  const handlers = React.useMemo(
    () => ({
      ...props.handlers,
      addRow: () => {
        const { formElement, owner } = props;
        if (formElement.props.onAdd) {
          simpleHandle(props, props.formElement.props.onAdd, context);
        }
        if (propName(formElement)) {
          owner.addRow(valueSource(formElement), toJS(addDataset));
        }
      }
    }),
    [addDataset, context, props]
  );
  return (
    <div className={repeaterAddButton}>
      {addTemplate &&
        props.catalogue.createComponent(
          { ...props, owner: addDataset, handlers },
          addTemplate,
          context
        )}
    </div>
  );
});

export type RepeaterProps = {
  allowEdit: boolean;
  allowAdd: boolean;
  value: BoundProp;
  onDelete: string;
  onAdd: string;
};

export type State = {
  selectedIndex: number;
};

class RepeaterComponent extends React.Component<FormComponentProps<RepeaterProps>, State> {
  state = { selectedIndex: -1 };
  addDataset: DataSet;

  handleToggleChange = (_e: React.ChangeEvent<HTMLInputElement>, control: HTMLInputElement) => {
    // find value
    this.props.owner.parseValue(propName(this.props.formElement), control.checked);
  };

  render(): JSX.Element {
    const { formElement, owner } = this.props;
    const { allowAdd } = formElement.props;
    const boundSource = valueSource(formElement);
    const list: DataSet[] = owner.getValue(boundSource);

    let viewTemplate = formElement.elements.length > 0 && formElement.elements[0];
    let editorTemplate = formElement.elements.length > 1 && formElement.elements[1];
    let addTemplate = formElement.elements.length > 2 && formElement.elements[2];

    if (!boundSource) {
      return <div>Please bind the repeater to an array source</div>;
    }

    return (
      <>
        {list == null || list.length === 0 ? (
          <div className={noItems}>{`This collection contains no items ...`}</div>
        ) : (
          list.map((listItemDataSet: DataSet, i) => (
            <RepeaterRow
              index={i}
              key={i + Date.now()}
              owner={owner}
              formElement={formElement}
              data={listItemDataSet}
              extra={this.props.extra}
              handlers={this.props.handlers}
              readOnly={this.props.readOnly}
              catalogue={this.props.catalogue}
              editorTemplate={editorTemplate}
              viewTemplate={viewTemplate || editorTemplate}
              selectedIndex={this.state.selectedIndex}
              select={index => this.setState({ selectedIndex: index })}
            />
          ))
        )}
        {allowAdd && !this.props.readOnly && (
          <AddRow addTemplate={addTemplate} addDataset={this.addDataset} props={this.props} />
        )}
        {/* <ErrorView owner={owner} source={boundSource} pointing="left" /> */}
      </>
    );
  }
}

export const RepeaterView: FormComponent = {
  Component: observer(RepeaterComponent)
  // toString: (_owner, props, context, catalogue) => {
  //   const repeaterList: DataSet[] = getValue(props, context);
  //   return repeaterList
  //     .map(
  //       (l, i) =>
  //         `[${i + 1}] ${props.formElement.elements
  //           .map(el =>
  //             catalogue.components[el.control].toString(
  //               l,
  //               { ...props, formElement: el },
  //               context,
  //               catalogue
  //             )
  //           )
  //           .join('\n    ')}`
  //     )
  //     .join('\n\n');
  // }
};
