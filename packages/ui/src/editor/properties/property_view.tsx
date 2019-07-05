import * as React from 'react';

import * as propertyHandlers from './property_panel.handlers';

import { observer } from 'mobx-react';
import { config, FormElement, FormComponentProps } from '@toryjs/form';
import { groupByArray, debounce } from '@tomino/toolbelt';
import { FormDataSet, SchemaDataSet } from '../form_store';
import { pointer, names, prop } from '../../common';
import { renderElements } from '../../components/properties/control_factory_helpers';
import { Help } from '../../components/properties/help_view';
import { EditorContext, EditorContextType } from '../editor_context';
import { Message, Button, Icon, InputProps } from 'semantic-ui-react';
import { pad12, paneContent, margin12, searchableSidePane } from '../editor_styles';
import { schemaPanel, schemaHandlers } from '../schema/schema_panel';
import { styledPropertyView } from './property_styles';
import { propertyPanel } from './property_panel';
import { findSchema, createPath } from '../editor_common';
import { DeleteSchema } from '../dataset/dataset_modals';
import { EditorState } from '../editor_state';
import { getValue } from '../../helpers';
import { Input } from 'semantic-ui-react';

// import * as schemaHandlers from '../editor/schema/schema_panel.handlers';

export type RenderPropsProps = {
  groupName: string;
  props: FormElement[];
  activeElement: FormDataSet;
  handlers: any;
  filter: string;
};

export const RenderProps = ({
  props,
  activeElement,
  groupName,
  handlers,
  filter
}: RenderPropsProps) => {
  let i = 0;
  const groups = groupByArray(props, x => x.group || (x.props.display === 'group' ? i++ : ''));
  const editorState = React.useContext(EditorContext);

  return (
    <>
      {groups.map((g, i) => (
        <React.Fragment key={(g.key as string) + i}>
          {renderElements(
            editorState,
            g.key && (!g.values[0].props || g.values[0].props.display !== 'group')
              ? [
                {
                  control: 'Group',
                  props: {
                    text: g.key || groupName
                  },
                  elements: g.values
                }
              ]
              : g.values,
            activeElement.props,
            handlers,
            null /* catalogue */,
            editorState,
            activeElement.uid,
            filter
          )}
        </React.Fragment>
      ))}
    </>
  );
};

function buildElementBreadcrumbs(
  context: EditorContextType,
  props: FormComponentProps,
  activeElement: FormDataSet
) {
  let breadcrumbs: any[];

  if (activeElement) {
    let label = getValue(props, context, 'label');
    breadcrumbs = [
      <span key="last" style={{ fontWeight: 'normal' }}>
        {activeElement.control}
        {label && ` - ${label}`}
      </span>
    ];
    breadcrumbs.push(<Icon key="lastIcon" name="chevron right" />);

    let parent = activeElement.parent;
    let index = 0;
    while (parent != null && parent !== context.form) {
      let current = parent;
      if (parent.control) {
        if (breadcrumbs.length > 5) {
          breadcrumbs.push('...');
          return breadcrumbs;
        }
        breadcrumbs.push(
          <span
            key={index}
            className={pointer}
            onClick={() => context.project.state.setElement(current, context.schema)}
          >
            {parent.control}
          </span>
        );
        breadcrumbs.push(<Icon key={'Icon' + index++} name="chevron right" />);
      }
      parent = parent.parent;
    }
    breadcrumbs.push(<span key="first">Element</span>);
  }
  return breadcrumbs;
}

function buildSchemaBreadcrumbs(activeElement: SchemaDataSet, state: EditorState) {
  let breadcrumbs: any[];

  if (activeElement) {
    breadcrumbs = [
      <span key="last" style={{ fontWeight: 'normal' }}>
        {activeElement.title}
      </span>
    ];
    breadcrumbs.push(<Icon key="lastIcon" name="chevron right" />);

    let parent = activeElement.parent;
    let index = 0;
    while (parent != null && parent !== state.schema) {
      let current = parent;

      breadcrumbs.push(
        <span
          key={index}
          className={pointer}
          onClick={() => state.project.state.setSchema(current, current.title)}
        >
          {current.title}
        </span>
      );
      breadcrumbs.push(<Icon key={'Icon' + index++} name="chevron right" />);
      parent = parent.parent;
    }
    breadcrumbs.push(<span key="first">Schema</span>);
  }
  return breadcrumbs;
}

export const PropertyEditor = observer(() => {
  const context = React.useContext(EditorContext);
  const [filter, setFilter] = React.useState('');
  const [searchProperty, setSearchProperty] = React.useState('');
  const debouncedSet = React.useMemo(() => debounce(setSearchProperty, 400), []);
  const handleSearch = React.useCallback(
    (_, props: InputProps) => {
      setFilter(props.value);
      debouncedSet(props.value);
    },
    [debouncedSet]
  );

  const { selectedElement, selectedSchema } = context.state;

  // subscribe to schema changes
  context.state.selectedSchemaName;

  const handlers = React.useMemo(() => {
    let result = propertyHandlers;
    if (context.editorCatalogue) {
      for (let key of Object.keys(context.editorCatalogue.components)) {
        const component = context.editorCatalogue.components[key];
        if (component.handlers) {
          result = { ...result, ...component.handlers };
        }
      }
    }
    return result;
  }, [context.editorCatalogue]);

  const activeElement =
    selectedElement &&
    selectedElement.control !== 'EditorCell' &&
    selectedElement.control !== '' &&
    selectedElement.control !== null
      ? selectedElement
      : null;
  let activeSchema = prop(activeElement)
    ? findSchema(activeElement, context.project.schema, context)
    : selectedSchema;

  // const foundSchema = searchSchema(s => s.)

  const editorElement =
    activeElement &&
    context.editorCatalogue &&
    context.editorCatalogue.components[activeElement.control];
  const parentEditorElement =
    activeElement &&
    activeElement.parent &&
    context.editorCatalogue &&
    context.editorCatalogue.components[activeElement.parent.control];

  const editorProps = React.useMemo(
    () =>
      editorElement
        ? context
          .cachedProps(editorElement)
          .filter(p => p.group === 'Editor')
          .concat(context.editorProps)
        : [],
    [context, editorElement]
  );
  const componentProps = React.useMemo(
    () =>
      editorElement ? context.cachedProps(editorElement).filter(p => p.group !== 'Editor') : [],
    [context, editorElement]
  );

  const childProps = parentEditorElement ? context.cachedChildProps(parentEditorElement) : [];

  if (activeElement && !editorElement) {
    throw new Error(`Control '${activeElement.control}' does not exists in the catalogue`);
  }

  let props: FormComponentProps = {
    catalogue: context.editorCatalogue,
    owner: activeElement,
    handlers,
    formElement: activeElement
  };

  let breadcrumbs: any = activeElement ? (
    buildElementBreadcrumbs(context, props, activeElement).reverse()
  ) : activeSchema ? (
    buildSchemaBreadcrumbs(activeSchema, context).reverse()
  ) : (
    <span>Properties</span>
  );

  return (
    <div className={names(paneContent(context.theme), styledPropertyView(context.theme))}>
      <div className="paneHeader">
        <div className="text breadcrumbs">
          <div>{breadcrumbs}</div>
        </div>
      </div>
      <div className="property-table-row">
        <Input
          transparent
          inverted={context.theme.dark}
          icon="search"
          iconPosition="left"
          size="mini"
          fluid
          placeholder="Filter properties ..."
          className="searchInput"
          value={filter}
          onChange={handleSearch}
        />
      </div>
      <div className={names(searchableSidePane)}>
        {activeElement && (
          <>
            {/* Shared PROPS */}
            {!editorElement.provider && (
              <RenderProps
                activeElement={activeElement}
                props={propertyPanel}
                groupName="General"
                handlers={handlers}
                filter={searchProperty}
              />
            )}
            {/* Control Props */}
            {editorElement.props && (
              <RenderProps
                activeElement={activeElement}
                props={componentProps}
                groupName="Control"
                handlers={handlers}
                filter={searchProperty}
              />
            )}

            {/* Child Props */}
            {parentEditorElement && parentEditorElement.childProps && (
              <RenderProps
                activeElement={activeElement}
                props={childProps}
                groupName="Layout"
                handlers={handlers}
                filter={searchProperty}
              />
            )}

            {/* Editor Props */}
            <RenderProps
              activeElement={activeElement}
              props={editorProps}
              groupName="Editor"
              handlers={handlers}
              filter={searchProperty}
            />
          </>
        )}

        {activeElement && !activeSchema && prop(activeElement) && (
          <Message
            className={margin12}
            error
            content={`Schema not found at: ${createPath(activeElement, context).join(' > ')}`}
          />
        )}
        {/* Schema Props */}
        {activeSchema &&
          renderElements(
            context,
            schemaPanel,
            activeSchema as any,
            schemaHandlers as any,
            null,
            context /* catalogue */,
            activeSchema.uid,
            searchProperty
          )}

        {(activeElement || activeSchema) && <Help owner={activeElement} />}

        <div className={pad12}>
          {activeElement &&
            activeElement.parent.parent &&
            (!activeElement.props || !activeElement.props.locked) && (
            <Button
              onClick={context.project.state.deleteActiveElement}
              content={config.i18n`Delete`}
              icon="trash"
            />
          )}
          {selectedSchema && <DeleteSchema schema={selectedSchema} />}
        </div>
      </div>
    </div>
  );
});

PropertyEditor.displayName = 'PropertyEditor';
