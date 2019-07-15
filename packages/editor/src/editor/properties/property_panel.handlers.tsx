import { Handler, JSONSchema, DataSet } from '@toryjs/form';
import { schemaDatasetToJS, ContextType, toJS, datasetRoot, FormDataSet } from '@toryjs/ui';
import { HandlerArgs } from '@toryjs/form';
import { Dropdown } from 'semantic-ui-react';

type FormHandler = Handler<FormDataSet, ContextType>;
// type FormParseHandler = ParseHandler<FormDataSet, ContextType>;

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
  const editorElement = context.editor.editorCatalogue.components[owner.control];
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
//   context,
//   { current, previous }
// ) => {
//   let newWidth = parseInt(current, 10);
//   if (newWidth < 1) {
//     newWidth = 1;
//   }
//   if (newWidth > 15) {
//     newWidth = 15;
//   }
//   const element: FormDataSet<GridChildProps> = context.project.state.selectedElement;
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
//   context,
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
//     context.project.state.selectedElement;
//   if (value + element.props.width - 1 > 15) {
//     value = 15 - element.props.width + 1;
//   }
//   const conflict = findConflict(
//     context.selectedParent.elements.filter(
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

function buildStringPaths(element: JSONSchema, parent: string = '', parentPaths = ''): string[] {
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
      result.push(...buildStringPaths(current, parentPath, parentPaths));
    } else if (
      parentPaths &&
      current.type === 'array' &&
      current.items &&
      current.items.type === 'object'
    ) {
      result.push(...buildStringPaths(current.items, parentPath, parentPaths));
    }
  }
  return result;
}

function buildDatasetPaths(
  element: JSONSchema,
  parent: string = '',
  parentPaths = '',
  prefix = ''
): Options[] {
  return buildStringPaths(element, parent, parentPaths)
    .sort()
    .map(p => ({ text: p, value: prefix + p, disabled: false }));
}

type Options = {
  text?: string;
  value?: string;
  disabled?: boolean;
  content?: string;
  as?: any;
};

const empty: Options = { text: '--', value: '' };
const array: Options[] = [{ text: 'Item', value: '__item' }];
const globalHeader: Options[] = [
  { content: 'Dataset', disabled: true, as: Dropdown.Header, value: '__datasetHeader' }
];
const customHeader: Options = {
  content: 'Custom Props',
  as: Dropdown.Header,
  disabled: true,
  value: '__missingHeader'
};

const propSource = [
  { content: 'Data Props', as: Dropdown.Header, disabled: true, value: '__propsHeader' },
  { text: 'First', value: 'dataPropFirst' },
  { text: 'Data', value: 'dataPropData' }
];

function findParentPath(context: ContextType, parent: FormDataSet) {
  let parentPath = '';
  while (parent.parent != null) {
    parent = parent.parent;

    const control = context.editor.editorCatalogue.components[parent.control];

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
  return parentPath;
}

function buildTextPropPaths(js: any, parentPath = ''): string[] {
  if (!js) {
    return [];
  }
  let result = [];
  for (let key of Object.keys(js)) {
    if (js[key] == null || Array.isArray(js[key]) || typeof js[key] != 'object') {
      result.push(parentPath + key);
    } else if (js[key] != null && typeof js[key] == 'object') {
      result.push(...buildTextPropPaths(js[key], parentPath + key + '.'));
    }
  }
  return result;
}

function buildPropPaths(owner: DataSet): Options[] {
  let cleanedOwner = toJS(owner);
  if (owner.getValue) {
    delete (owner as any).history;
    delete (owner as any).errors;
  }
  return buildTextPropPaths(cleanedOwner)
    .sort()
    .map(p => ({ text: p, value: p }));
}

export const datasetSource: FormHandler = ({ owner, context }) => {
  if (!owner) {
    return [];
  }

  let props = context.editor.props[owner.parent.uid];

  // find parent path
  let parentPath = findParentPath(context, owner.parent);
  let schema = schemaDatasetToJS(context.editor.schema);
  let paths = props ? buildPropPaths(props.owner) : buildDatasetPaths(schema, '', parentPath);
  let all = buildDatasetPaths(schema, '', '', '/');

  let isSimpleArray = false;
  // if (owner.getSchema().type === 'array') {
  //   array = [{ text: 'Item', value: 'item', disabled: false }];
  // }

  let values: Options[] = [empty]
    .concat(paths)
    .concat(isSimpleArray ? array : [])
    .concat(all.length && parentPath !== '' ? globalHeader.concat(all) : [])
    .concat(props && props.dataProps ? propSource : []);

  // find the missing value if needed
  const sources: any = toJS(owner);
  const missing: Options[] = [];
  for (let key of Object.keys(sources)) {
    let source = key === 'source' ? sources[key] : sources[key] && sources[key].source;
    if (source && values.every(v => v.value !== source)) {
      missing.push({ text: source, value: source, disabled: false });
    }
  }
  if (missing.length > 0) {
    values = values.concat([customHeader, ...missing]);
  }

  // console.log(values);
  return values;
};

export const optionsHandlers: FormHandler = ({ context }) => {
  return [{ text: 'None', value: '' }].concat(
    context.editor.projectHandlers.filter(h => h !== '__esModule').map(h => ({ value: h, text: h }))
  );
};

export const optionsProjectPages: FormHandler = ({ owner }) => {
  const form = datasetRoot(owner);
  return form.pages
    ? form.pages.map(p => ({
        text: p.props.editorLabel || p.props.label || p.props.label.value,
        value: p.uid
      }))
    : [];
};
