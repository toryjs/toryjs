import * as React from 'react';

import { css } from 'emotion';
import { FormComponentCatalogue, EditorComponentCatalogue } from '@toryjs/form';

import { IProject } from '../storage/common_storage';
import { ServerStorage } from '../storage/server_storage';
import { ToryForm } from './form';
import { LeftPane } from '../editor/form_store';
import { formDatasetToJS } from '../helpers';

// const LazyEditor = React.lazy(() => import('./editor'));

import { ToryEditor } from './editor';

export const exampleCss = css`
  .buttons {
    position: relative;
    padding: 12px;
    display: flex;

    justify-content: flex-end;

    button {
      width: 120px;
      flex: 0 0 auto !important;
    }
  }
`;

export const editorCss = css`
  /* border: 1px solid #bbb; */
  margin: 0px 12px;
  padding: 12px;
  border-radius: 6px;
  position: relative;
  height: 100%;
  overflow: auto;
`;

export type Props = {
  style?: string;
  id?: string;
  group?: string;
  url?: string;
  project?: IProject;
  catalogue?: FormComponentCatalogue;
  editorCatalogue?: EditorComponentCatalogue;
  theme?: 'light' | 'dark';
  hideViews?: LeftPane[];
  loadStyle?: boolean;
  showTopMenu?: boolean;
  header?: string;
  handlers?: any;
};

function renderView(
  view: string,
  storage: ServerStorage,
  {
    project,
    catalogue,
    editorCatalogue,
    theme,
    hideViews,
    handlers = {},
    showTopMenu = false
  }: Props
) {
  if (view === 'view') {
    return (
      <ToryForm catalogue={catalogue} handlers={handlers} storage={storage} project={project} />
    );
  } else if (view === 'editor') {
    return (
      <ToryEditor
        componentCatalogue={catalogue}
        editorCatalogue={editorCatalogue}
        storage={storage}
        handlers={handlers}
        project={project}
        loadStyles={false}
        theme={theme || 'light'}
        hideViews={hideViews || ['pages', 'all']}
        allowSave={process.env.NODE_ENV === 'development'}
        showTopMenu={showTopMenu}
      />
    );
  } else if (view === 'code') {
    return (
      <pre>
        {JSON.stringify(
          project ? formDatasetToJS(project.form) : formDatasetToJS(storage.project.form),
          null,
          2
        )}
      </pre>
    );
  }
}

export function docsGroup(overrideProps: Props) {
  const DocsWrapper = (props: Props) => <DocsForm {...overrideProps} {...props} />;
  DocsWrapper.displayName = 'DocsWrapper';
  return DocsWrapper;
}

export const DocsForm: React.FC<Props> = props => {
  const [view, setView] = React.useState('view');
  const storage = React.useMemo(() => {
    return process.env.NODE_ENV === 'development'
      ? new ServerStorage(props.url, props.id, props.group)
      : undefined;
  }, [props.group, props.id, props.url]);

  return (
    <div className={exampleCss + ' ' + css(props.style)}>
      <div className="ui buttons">
        {props.header && (
          <div
            style={{ flex: '1 1 100%', fontSize: '16px', fontWeight: 'bolder', paddingTop: '10px' }}
          >
            {props.header}
          </div>
        )}
        <button className="ui button" onClick={() => setView('code')}>
          <i className="icon code" />
          Code
        </button>
        <button className="ui button" onClick={() => setView('editor')}>
          <i className="edit icon" />
          Editor
        </button>
        <button className="ui button" onClick={() => setView('view')}>
          <i className="eye icon" /> View
        </button>
      </div>
      <div key={view} style={view === 'editor' ? { resize: 'vertical', overflow: 'hidden' } : {}}>
        <div
          className={editorCss}
          key={view}
          style={view === 'editor' ? { minHeight: '400px' } : {}}
        >
          {/* <React.Suspense fallback={<div>Loading ...</div>}> */}
          {renderView(view, storage, props)}
          {/* </React.Suspense> */}
        </div>
      </div>
    </div>
  );
};
