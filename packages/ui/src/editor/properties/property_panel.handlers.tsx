import { Handler, JSONSchema } from '@toryjs/form';
// import { findConflict } from '../editor_helpers';
import { FormDataSet } from '../form_store';
// import { GridChildProps } from '../../layouts/grid_view';
import { EditorContextType } from '../editor_context';
import { schemaDatasetToJS } from '../../helpers';
import { HandlerArgs } from '@toryjs/form';
import { Dropdown } from 'semantic-ui-react';

type FormHandler = Handler<FormDataSet, EditorContextType>;
// type FormParseHandler = ParseHandler<FormDataSet, EditorContextType>;

const controlVisibility = (controls: string[]) => ({ owner }: HandlerArgs) => {
  return controls.indexOf(owner.control) >= 0;
};

const controlInvisibility = (controls: string[]) => ({ owner }: HandlerArgs) => {
  return controls.indexOf(owner.control) === -1;
};

const parentControlVisibility = (controls: string[]) => ({ owner }: HandlerArgs) => {
  return controls.indexOf(owner.parent.control) >= 0;
};

export const elementWithSource: FormHandler = ({ owner, context }) => {
  const editorElement = context.editorCatalogue.components[owner.control];
  return editorElement ? editorElement.bound : false;
};

export const readonlyElements: FormHandler = controlInvisibility(['Text', 'Image', 'Value']);

export const textVisibleHandler: FormHandler = controlVisibility(['Text', 'Link']);

export const gridVisibleHandler: FormHandler = controlVisibility(['Grid']);

export const verticalVisibleHandler: FormHandler = controlVisibility(['Radio', 'Checkbox']);

export const parentGridVisibleHandler: FormHandler = parentControlVisibility(['Grid']);

export const parentStackVisibleHandler: FormHandler = parentControlVisibility(['Stack']);

// export const gridParseWidthHandler: FormParseHandler = (
//   _owner,
//   _props,
//   editorState,
//   { current, previous }
// ) => {
//   let newWidth = parseInt(current, 10);
//   if (newWidth < 1) {
//     newWidth = 1;
//   }
//   if (newWidth > 15) {
//     newWidth = 15;
//   }
//   const element: FormDataSet<GridChildProps> = editorState.project.state.selectedElement;
//   const currentColumn = element.props.column;

//   if (element.props.column + newWidth - 1 > 15) {
//     element.setValue('column', 15 - newWidth + 1);
//   }
//   const conflict = findConflict(
//     element.parent.elements.filter(s => s.props.row === element.props.row && s !== element),
//     element.props.column,
//     element.props.column + newWidth - 1
//   );
//   if (conflict) {
//     element.setValue('column', currentColumn);
//   }
//   return conflict ? previous : newWidth;
// };

// export const gridParseColumnHandler: FormParseHandler = (
//   _owner,
//   _props,
//   editorState,
//   { current, previous }
// ) => {
//   let value = parseInt(current, 10);
//   if (value < 0) {
//     value = 0;
//   }
//   if (value > 15) {
//     value = 15;
//   }
//   const element: FormDataSet<GridChildProps, GridChildProps> =
//     editorState.project.state.selectedElement;
//   if (value + element.props.width - 1 > 15) {
//     value = 15 - element.props.width + 1;
//   }
//   const conflict = findConflict(
//     editorState.selectedParent.elements.filter(
//       s => s.props.row === element.props.row && s !== element
//     ),
//     value,
//     value + element.props.width - 1
//   );
//   return conflict ? previous : value;
// };

export function clickApproveHandler() {
  // do somerthing
}

function buildDatasetPaths(element: JSONSchema, parent: string = '', parentPaths = ''): string[] {
  let result = [];
  let adjustedPath = parentPaths + '.';

  for (let key of Object.keys(element.properties || {})) {
    let current = element.properties[key];
    let parentPath = (parent ? parent + '.' : '') + key;

    if (parentPaths) {
      if (parentPath.substring(0, adjustedPath.length) === adjustedPath) {
        result.push(parentPath.replace(adjustedPath, ''));
      }
    } else {
      result.push(parentPath);
    }

    if (current.type === 'object') {
      result.push(...buildDatasetPaths(current, parentPath, parentPaths));
    } else if (
      parentPaths &&
      current.type === 'array' &&
      current.items &&
      current.items.type === 'object'
    ) {
      result.push(...buildDatasetPaths(current.items, parentPath, parentPaths));
    }
  }
  return result;
}

type Options = {
  text?: string;
  value?: string;
  disabled?: boolean;
  content?: string;
  as?: any;
};

const empty: Options[] = [{ text: '--', value: '', disabled: false }];
const array: Options[] = [{ text: 'Item', value: '__item', disabled: false }];
const globalHeader: Options[] = [
  { content: 'Dataset', disabled: true, as: Dropdown.Header, value: '__datasetHeader' }
];
const propSource = [
  { content: 'Data Props', as: Dropdown.Header, disabled: true, value: '__propsHeader' },
  { text: 'First', value: 'dataPropFirst', disabled: false },
  { text: 'Data', value: 'dataPropData', disabled: false }
];

export const datasetSource: FormHandler = ({ owner, context }) => {
  // find parent path
  let parent = owner.parent;
  let parentPath = '';

  // console.log(formDatasetToJS(owner.parent.parent.parent.parent));

  while (parent.parent != null) {
    parent = parent.parent;

    const control = context.editorCatalogue.components[parent.control];

    if (
      control &&
      control.valueProvider &&
      parent.props &&
      parent.props.value &&
      parent.props.value.source
    ) {
      parentPath = parent.props.value.source + (parentPath ? '.' : '') + parentPath;
    }
  }

  // console.log(parentPath);

  let schema = schemaDatasetToJS(context.schema);
  let paths = buildDatasetPaths(schema, '', parentPath);
  let all = buildDatasetPaths(schema);

  let isSimpleArray = false;
  // if (owner.getSchema().type === 'array') {
  //   array = [{ text: 'Item', value: 'item', disabled: false }];
  // }

  const values: Options[] = empty
    .concat(paths.sort().map(p => ({ text: p, value: p, disabled: false })))
    .concat(isSimpleArray ? array : [])
    .concat(
      parentPath !== ''
        ? globalHeader.concat(all.sort().map(p => ({ text: p, value: '/' + p, disabled: false })))
        : []
    )
    .concat(propSource);

  // console.log(values);
  return values;
};

export const optionsHandlers: FormHandler = ({ context }) => {
  return [{ text: 'None', value: '' }].concat(
    context.projectHandlers.filter(h => h !== '__esModule').map(h => ({ value: h, text: h }))
  );
};
