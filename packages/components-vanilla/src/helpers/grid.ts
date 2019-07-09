import { ContextType, getPropValue, bindGetValue } from '@toryjs/ui';
import { FormComponentProps, FormElement } from '@toryjs/form';
import { GridProps, GridChildProps } from '../grid_view';
import { FormDataSet } from '@toryjs/ui';

export type LayoutProps = {
  emptyCell?: string;
  hideLabel?: boolean;
  labelOnly?: boolean;
};

export function generateEmptyCells(
  context: ContextType,
  props: FormComponentProps,
  element: FormElement<GridProps, GridChildProps>,
  emptyCell: string
) {
  const grid: boolean[][] = [];
  const rows = getPropValue(props, element, context, 'rows', 1);
  const columns = getPropValue(props, element, context, 'columns', 1);
  const elements = element.elements;

  // populate the grid that monitor empty fields
  for (let e of elements) {
    const width = getPropValue(props, e, context, 'width', 1);
    const height = getPropValue(props, e, context, 'height', 1);
    const row = getPropValue(props, e, context, 'row');
    const column = getPropValue(props, e, context, 'column');

    for (let i = 1; i <= width; i++) {
      for (let j = 1; j <= height; j++) {
        if (!grid[row + j - 1]) {
          grid[row + j - 1] = [];
        }
        grid[row + j - 1][column + i - 1] = true;
      }
    }
  }

  let newElements = [...elements];

  // now add missing elements
  // each gap is populated by the editor cell
  for (let row = 1; row <= rows; row++) {
    for (let column = 1; column <= columns; column++) {
      if (!grid[row] || !grid[row][column]) {
        newElements.push({
          control: emptyCell,
          props: {
            row,
            column
          }
        } as any); // TODO: Maybe solve?
      }
    }
  }

  return newElements;
}

export function findConflict(
  props: FormComponentProps,
  context: ContextType,
  cells: FormDataSet<GridChildProps>[],
  start: number,
  end: number
) {
  const getValue = bindGetValue(props, context);
  return cells.find(
    e =>
      (getValue(e, 'column') >= start && getValue(e, 'column') <= end) ||
      (getValue(e, 'column') + getValue(e, 'width') - 1 >= start &&
        getValue(e, 'column') + getValue(e, 'width') - 1 <= end)
  );
}

export function adjustPosition(
  props: FormComponentProps,
  context: ContextType,
  where: string,
  source: FormDataSet<GridChildProps>,
  target: FormDataSet<GridChildProps>,
  parent: FormDataSet<GridChildProps>
) {
  const getValue = bindGetValue(props, context);
  if (!parent) {
    // TODO: fix
    return getValue(target, 'column');
  }
  let dimensions = parent.elements.reduce(
    (prev, next) => ({
      rows: prev.rows < next.props.row ? next.props.row : prev.rows,
      columns: prev.columns < next.props.column ? next.props.column : prev.columns
    }),
    { rows: 0, columns: 0 }
  );

  // adjust from left or right
  let column =
    where === 'left'
      ? getValue(target, 'column')
      : getValue(target, 'column') - getValue(target, 'width') + 1;

  // if (adjust) {
  //   source.props.column = position.props.column - source.props.width + 1;
  // }
  // adjust to min width
  column = column < 1 ? 1 : column;
  // adjust to max width
  column =
    column + source.props.width > dimensions.columns
      ? dimensions.columns - getValue(source, 'width') + 1
      : column;

  let cells = parent.elements.filter(e => e.props.row === target.props.row && e !== source);
  // try one adjustment moving the item left or right from the conflict cell
  let conflict = findConflict(props, context, cells, column, column + source.props.width - 1);

  // TRYING TO SOLVE IT FOR THE USER
  // if (conflict) {
  //   column = where === 'left' ? conflict.props.column - source.props.width : conflict.props.column + conflict.props.width;
  // }
  // // if it fails again we give up
  // if (column >= 0) {
  //   conflict = findConflict(cells, column, column + source.props.width - 1);
  // }

  if (conflict) {
    return -1;
  }
  return column;
}
