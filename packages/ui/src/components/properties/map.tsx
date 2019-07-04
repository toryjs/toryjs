import * as React from 'react';
import * as styles from './properties_common';

import { styledTableRow, addButton, celled } from './properties_common';

import names from 'classnames';
import { observer } from 'mobx-react';

import { select, prop } from '../../common';
import { ISimpleType, IMSTMap } from 'mobx-state-tree';
import { action } from 'mobx';
import {
  DataSet,
  FormElement,
  Schema,
  Option,
  FormComponentProps,
  Handlers
} from '@toryjs/form';

import { PropertyHeader } from './group';
import { Dropdown } from 'semantic-ui-react';
import { EditorContext, EditorContextType } from '../../editor/editor_context';
import { getValue } from '../../helpers';

type ControlMap = {
  key: string;
};

type RowProps = {
  mappingKey: string;
  map: IMSTMap<ISimpleType<string>>;
  owner: DataSet;
  handlers: Handlers<any, EditorContextType>;
  formElement: FormElement;
  source: string;
  controlMap: ControlMap[];
};

function renderControl(
  options: Option[],
  value: string,
  type: string,
  placeholder: string,
  error: boolean,
  onValueChange: any,
  mappingKey: string,
  className = ''
) {
  return options ? (
    <Dropdown
      value={value}
      data-value={value}
      data-key={mappingKey}
      search
      selection
      fluid
      name="type"
      onChange={onValueChange}
      className={names('property-search', className, select, {
        invalid: error
      })}
      options={options}
    />
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onValueChange}
      className={names({
        invalid: error
      })}
      value={value}
      data-key={mappingKey}
      data-value={value}
    />
  );
}

const MapRow: React.FC<RowProps> = (props: RowProps) => {
  const { mappingKey, map, owner, formElement, handlers, source, controlMap } = props;
  const [currentKey, setKey] = React.useState(mappingKey);
  const [value, setValue] = React.useState(map.get(mappingKey));
  const [error, setError] = React.useState('');
  const context = React.useContext(EditorContext);

  let keyOptions: Option[] = getValue(
    { formElement, owner, handlers, catalogue: null },
    context,
    'options'
  );
  let valueOptions: Option[];

  const editorState = React.useContext(EditorContext);
  const editorItem = editorState.editorCatalogue.components[owner.getValue('control')];
  let schema: Schema;
  if (editorItem && editorItem.props) {
    schema = new Schema(editorItem.props);
    keyOptions = Object.getOwnPropertyNames(schema.properties).map(key => ({
      label: schema.properties[key].title,
      value: key,
      description: schema.properties[key].description
    }));
    if (currentKey) {
      valueOptions = editorItem.props[currentKey].schema.$enum;
      if (valueOptions) {
        valueOptions.forEach(o => (o.key = mappingKey));
      }
    }
  }

  const selected = currentKey && keyOptions && keyOptions.find(o => o.value === currentKey);

  const onKeyChange = action(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, control: any) => {
      const originalKey = e.currentTarget.getAttribute('data-key') || '';
      const newKey = control.value;
      const value = e.currentTarget.getAttribute('data-value');

      setKey(newKey);

      if (map.has(newKey)) {
        owner.setError(source, 'Key exists: ' + newKey);
        setError(originalKey);
        return;
      }

      owner.mapRemove(source, originalKey);
      owner.setMapValue(source, newKey, value == null ? '' : value);

      let mapping = controlMap.find(o => o.key === originalKey);
      if (mapping) {
        mapping.key = newKey;
      } else {
        controlMap.push({ key: newKey });
      }
    }
  );

  const onValueChange = (e: any) => {
    const key = e.currentTarget.getAttribute('data-key');
    let value = e.currentTarget.value;

    setValue(value);

    // with schema we can try to create an actual value
    const source = prop(formElement);
    if (schema) {
      value = schema.properties[key].tryParse(value);
      owner.setMapValue(source, e.key, value);

      const mapSource = owner.getValue(source);
      const mapObject = JSON.parse(JSON.stringify(mapSource));
      let result = schema.validate(mapObject);
      if (result && result.length) {
        let errorKey = result[0].dataPath.replace(/\//g, '');
        owner.setError(source, `${errorKey}: ${result[0].message}`);
        setError(errorKey);
      } else {
        owner.setError(source, '');
        setError('');
      }
    } else {
      owner.setMapValue(source, key, value);
    }
  };

  const deleteValue = (e: React.MouseEvent) => {
    const originalKey = e.currentTarget.getAttribute('data-key');
    owner.mapRemove(source, originalKey);
  };

  return (
    <div
      className={names(styledTableRow(editorState.theme), { invalid: error })}
      onClick={e => {
        if (selected && selected.description) {
          owner.setValue('_help', selected.description);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className={styles.tableRowFull}>
        {renderControl(
          keyOptions,
          currentKey,
          'text',
          'Key',
          error === currentKey,
          onKeyChange,
          mappingKey,
          'first gray'
        )}
      </div>
      <div className={styles.tableRowFull}>
        {renderControl(
          valueOptions,
          value,
          (selected && selected.type) || 'text',
          'Value',
          error === currentKey,
          onValueChange,
          mappingKey,
          'second'
        )}
      </div>

      <div className={styles.tableRowAuto}>
        <button
          className={addButton(editorState.theme)}
          onClick={deleteValue}
          data-key={mappingKey}
        >
          x
        </button>
      </div>
    </div>
  );
};

@observer
export class Map extends React.Component<FormComponentProps> {
  static contextType = EditorContext;

  onClear = () => {
    this.props.owner.setValue(prop(this.props.formElement), '');
  };

  addRow = () => {
    const source = prop(this.props.formElement);
    const current = this.props.owner.getValue(source);
    if (!current || typeof current !== 'object') {
      this.props.owner.setValue(source, {});
    }
    this.props.owner.setMapValue(source, '', '');
  };

  render() {
    const { formElement, owner, handlers } = this.props;
    const source = prop(formElement);
    const controlMap: ControlMap[] = [];

    // let error = control.validate && control.validate(this.props.owner.getValue(source));

    const map: IMSTMap<ISimpleType<string>> = owner.getValue(source);
    const lines: any = [];

    if (map && typeof map === 'object') {
      // add new items
      map.forEach((_value, key) => {
        if (controlMap.every(c => c.key !== key)) {
          controlMap.push({ key });
        }
      });

      for (let i = 0; i < controlMap.length; i++) {
        const mapping = controlMap[i];
        lines.push(
          <MapRow
            key={i}
            mappingKey={mapping.key}
            map={map}
            owner={owner}
            formElement={formElement}
            source={source}
            handlers={handlers}
            controlMap={controlMap}
          />
        );
      }
    }

    return (
      <PropertyHeader
        label={formElement.props && formElement.props.text}
        buttons={
          <button className="headerButton" onClick={this.addRow}>
            +
          </button>
        }
      >
        <div className={celled(this.context.theme)}>{lines.length > 0 ? lines : undefined}</div>
      </PropertyHeader>
    );
  }
}
