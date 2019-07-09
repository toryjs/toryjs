import React from 'react';

import {
  Handlers,
  EditorComponentCatalogue,
  FormComponentCatalogue,
  initUndoManager
} from '@toryjs/form';
import { IProject, IStorage, Context, EditorContext, Theme } from '@toryjs/ui';
import { toJS } from 'mobx';

import { FormEditor } from '../editor/form_editor';
import { LeftPane } from '../editor/form_store';
import { createEditorContext } from '../editor/context';

type Props = {
  project?: IProject;
  storage: IStorage;
  context?: EditorContext;
  componentCatalogue: FormComponentCatalogue;
  editorCatalogue: EditorComponentCatalogue;
  handlers: Handlers<any, any>;
  showTopMenu?: boolean;
  allowSave?: boolean;
  fileOperations?: boolean;
  loadStyles?: boolean;
  theme?: Theme;
  defaultView?: LeftPane;
  hideViews?: LeftPane[];
};

export let loadStyle = function(url: string) {
  return new Promise(resolve => {
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.onload = () => {
      resolve();
    };
    link.href = url;

    let headScript = document.querySelector('script');
    headScript.parentNode.insertBefore(link, headScript);
  });
};

let semanticStylesLoaded = false;

export const ToryEditor: React.FC<Props> = props => {
  const { showTopMenu = true, allowSave = true, fileOperations = false, loadStyles = true } = props;

  const [project, setProject] = React.useState<IProject>(props.project ? props.project : null);
  const [stylesLoaded, setStylesLoaded] = React.useState(semanticStylesLoaded || !loadStyles);

  const context = React.useContext(Context);
  const editorContext = React.useMemo(() => {
    if (props.context) {
      return props.context;
    }
    return createEditorContext(props, context);
  }, [
    props.componentCatalogue,
    props.context,
    props.editorCatalogue,
    props.handlers,
    props.storage,
    props.theme
  ]);

  if (process.env.NODE_ENV === 'development') {
    (global as any).__context = context;
  }

  if (!stylesLoaded) {
    loadStyle('https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.2/semantic.min.css').then(
      () => {
        semanticStylesLoaded = true;
        setStylesLoaded(true);
      }
    );
  }

  if (!project) {
    if (props.storage) {
      props.storage.loadProject().then(p => {
        setProject(p);
      });
    } else {
      throw new Error('You need to provide either a storage or a form model');
    }
  }

  if (project && !editorContext.project) {
    if (props.storage) {
      (props.storage as any).projects[project.uid] = editorContext.project;
      (props.storage as any).project = editorContext.project;
    }

    editorContext.load(toJS(project));
    editorContext.undoManager = initUndoManager(editorContext.project as any);
    editorContext.project.state.changeLeftPane(props.defaultView || 'outline');
  }

  if (!stylesLoaded || !project || !editorContext.project) {
    return <div>Loading ...</div>;
  }

  return (
    <Context.Provider value={context}>
      <FormEditor
        context={context}
        showTopMenu={showTopMenu}
        allowSave={allowSave}
        fileOperations={fileOperations}
        hideViews={props.hideViews}
      />
    </Context.Provider>
  );
};

ToryEditor.displayName = 'ToryEditor';

export default ToryEditor;
