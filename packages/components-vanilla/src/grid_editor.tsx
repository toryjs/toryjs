import * as React from 'react';

import { FormComponentProps, EditorComponent } from '@toryjs/form';

import { observer } from 'mobx-react';
import { GridChildProps, GridProps, GridView } from './grid_view';
import {
  DropCellProps,
  DropCell,
  propGroup,
  boundProp,
  EditorContextType,
  EditorContext,
  DynamicComponent
} from '@toryjs/ui';

import { LayoutProps, generateEmptyCells, adjustPosition } from './helpers/grid';
import { showHandles, timeHideHandles } from './helpers/drag_drop_boundary';

function drop(_e: React.DragEvent, props: DropCellProps, context: EditorContextType): boolean {
  const item = context.dragItem;
  context.dragItem = null;

  let sourceElement = item.element;
  let targetElement = props.formElement;

  // OPTION 1: We are dropping on the existing element
  if (targetElement && targetElement.control !== 'EditorCell') {
    return false;
  }

  // OPTION 2: We are dropping existing element on empty cell
  else if (sourceElement) {
    const column = adjustPosition(
      props,
      context,
      item.position,
      sourceElement,
      props.formElement,
      props.parentFormElement
      // false
    );
    // const column = props.formElement.props.column;
    if (column === -1) {
      return false;
    }
    sourceElement.props.setValue('row', props.formElement.props.row);
    sourceElement.props.setValue('column', column);
    // we can grab by left part or right part
  }
  // OPTION 3: We are dropping new item on empty cell
  else {
    let width = sourceElement ? sourceElement.width : 1;
    props.parentFormElement.addRow('elements', {
      label: item.label || '',
      props: {
        ...item.controlProps,
        control: item.name,
        row: props.formElement.props.row,
        column: props.formElement.props.column,
        width
      },
      control: item.name,
      source: item.source,
      elements: item.defaultChildren
    });
    sourceElement = props.parentFormElement.elements[props.parentFormElement.elements.length - 1];
  }
  return false;
}

const EditorCell = (props: DropCellProps) => {
  return (
    <DropCell
      {...props}
      drop={drop}
      // hover={hover}
      mouseOver={showHandles}
      mouseOut={timeHideHandles}
    />
  );
};

export const GridEditorComponent: React.FC<
  FormComponentProps<GridProps, GridChildProps> & LayoutProps
> = props => {
  const context = React.useContext(EditorContext);
  const controls = generateEmptyCells(context, props, props.formElement, 'EditorCell');

  // we replace the form element with the new one
  return (
    <DynamicComponent {...props}>
      <GridView.Component {...props} EditorCell={EditorCell} controls={controls} />
    </DynamicComponent>
  );
};

export const GridEditor: EditorComponent = {
  Component: observer(GridEditorComponent),
  control: 'Grid',
  icon: 'grid layout',
  title: 'Grid',
  group: 'Layout',
  defaultProps: {
    rows: 1,
    columns: 1,
    gap: '6px'
  },
  childProps: propGroup('Layout', {
    row: boundProp(
      {
        documentation: 'Row of the grid (1 ..)',
        props: { inputLabel: 'row' },
        tuple: 'Position',
        type: 'number'
      },
      'ValueSourceHandler',
      'number'
    ),
    column: boundProp(
      {
        documentation: 'Column of the grid (1 ..)',
        props: { inputLabel: 'col' },
        tuple: 'Position',
        type: 'number'
      },
      'ValueSourceHandler',
      'number'
    ),
    width: boundProp(
      {
        documentation: 'Width of the control in number of grid cells.',
        tuple: 'Dimension',
        props: { inputLabel: 'w' },
        type: 'number'
      },
      'ValueSourceHandler',
      'number'
    ),
    height: boundProp(
      {
        documentation: 'Height of the control in number of grid cells.',
        tuple: 'Dimension',
        props: { inputLabel: 'h' },
        type: 'number'
      },
      'ValueSourceHandler',
      'number'
    )
  }),
  props: {
    ...propGroup('Grid', {
      alignItems: boundProp({
        control: 'Select',
        documentation: `Aligns grid items vertically.<br>
          <ul>
          <li><i>Start (default)</i>: items are packed toward the top</li>
          <li><i>End:</i> items are packed toward the bottom</li>
          <li><i>Center</i>: items are centered</li>
          <li><i>Stretch</i>: items fill the whole height of the cell/li>
          </ul>
          Information taken from <a href="https://css-tricks.com/snippets/css/complete-guide-grid/" target="_blank">this guide</a> for more details`,
        group: 'Basic',
        type: 'string',
        $enum: [
          { text: 'Start', value: 'flex-start' },
          { text: 'End', value: 'flex-end' },
          { text: 'Center', value: 'center' },
          { text: 'Stretch', value: 'stretch' }
        ]
      }),
      gap: boundProp({
        control: 'Select',
        documentation: 'Spacing between cells',
        group: 'Basic',
        $enum: [
          {
            text: 'None',
            value: '0px'
          },
          {
            text: 'Tiny',
            value: '3px'
          },
          {
            text: 'Small',
            value: '6px'
          },
          {
            text: 'Normal',
            value: '12px'
          },
          {
            text: 'Big',
            value: '18px'
          },
          {
            text: 'Huge',
            value: '24px'
          }
        ],
        type: 'string'
      }),
      justifyItems: boundProp({
        control: 'Select',
        documentation: `Aligns grid items horizontally.<br>
          <ul>
          <li><i>Start (default)</i>: items are packed toward the start line</li>
          <li><i>End:</i> items are packed toward the end line</li>
          <li><i>Center</i>: items are centered along the line</li>
          <li><i>Stretch</i>: items fill the whole width of the cell/li>
          </ul>
          Information taken from <a href="https://css-tricks.com/snippets/css/complete-guide-grid/" target="_blank">this guide</a> for more details`,
        group: 'Basic',
        type: 'string',
        $enum: [
          { text: 'Start', value: 'flex-start' },
          { text: 'End', value: 'flex-end' },
          { text: 'Center', value: 'center' },
          { text: 'Stretch', value: 'stretch' }
        ],
        props: { label: 'Justify Content' }
      })
    }),
    rows: boundProp(
      {
        documentation: 'Number of grid rows',
        group: 'Dimensions',
        props: {
          inputLabel: 'rows'
        },
        tuple: 'Size',
        type: 'number'
      },
      'ValueSourceHandler',
      'number'
    ),
    columns: boundProp(
      {
        documentation: 'Number of grid columns',
        group: 'Dimensions',
        props: {
          inputLabel: 'cols'
        },
        tuple: 'Size',
        type: 'number'
      },
      'ValueSourceHandler',
      'number'
    ),
    rowSize: boundProp({
      documentation: 'Default height of extra rows (e.g. 100px)',
      group: 'Dimensions',
      props: {
        inputLabel: 'rows'
      },
      tuple: 'Width',
      type: 'number'
    }),
    columnSize: boundProp({
      documentation: 'Default width of extra columns (e.g. 100px)',
      group: 'Dimensions',
      props: {
        inputLabel: 'cols'
      },
      tuple: 'Width',
      type: 'number'
    }),
    templateRows: boundProp({
      documentation: `Row Template. For example: 
        <pre>10px auto 1fr</pre> will define a grid with three rows. 
        First row will be 10px high. Second row will automatically adjust its height. 
        And third column will fill the visible height.`,
      group: 'Templates',
      props: { label: 'Rows' },
      type: 'number'
    }),
    templateColumns: boundProp({
      documentation: `Column template. For example: 
        <pre>10px auto 1fr</pre> will define a grid with three columns. 
        First columns will be 10px wide. Second column will automatically adjust its size. 
        And third column will fill the visible width.`,
      group: 'Templates',
      props: { label: 'Column' },
      type: 'number'
    }),
    rowsReadOnly: boundProp(
      {
        documentation: 'Number of grid rows in read only mode',
        group: 'Read-Only',
        props: {
          inputLabel: 'rows'
        },
        tuple: 'Size',
        type: 'number'
      },
      'ValueSourceHandler',
      'number'
    ),
    columnsReadOnly: boundProp(
      {
        documentation: 'Number of grid columns in read only mode',
        group: 'Read-Only',
        props: {
          inputLabel: 'cols'
        },
        tuple: 'Size',
        type: 'number'
      },
      'ValueSourceHandler',
      'number'
    ),
    templateRowsReadOnly: boundProp({
      documentation: 'Row template for read only mode (e.g. 10px auto 1fr)',
      group: 'Read-Only',
      props: { label: 'Row Template' },
      type: 'number'
    }),
    templateColumnsReadOnly: boundProp({
      documentation: 'Column template for read only mode (e.g. 10px auto 1fr)',
      group: 'Read-Only',
      props: { label: 'Column Template' },
      type: 'number'
    })
  }
};
