import React from 'react';

import {
  Handlers,
  EditorComponentCatalogue,
  FormComponentCatalogue,
  initUndoManager
} from '@toryjs/form';
import { IProject, IStorage } from '../storage/common_storage';
import { Context, context } from '../context';
import { EditorState } from '../editor/editor_state';
import { FormEditor } from '../editor/form_editor';
import { LeftPane } from '../editor/form_store';
import { toJS } from 'mobx';
import { EditorContextType } from '../editor/editor_context';

type Props = {
  project?: IProject;
  storage: IStorage;
  context?: EditorContextType;
  componentCatalogue: FormComponentCatalogue;
  editorCatalogue: EditorComponentCatalogue;
  handlers: Handlers<any, any>;
  showTopMenu?: boolean;
  allowSave?: boolean;
  fileOperations?: boolean;
  loadStyles?: boolean;
  theme?: 'light' | 'dark';
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

  const editorContext = React.useMemo(() => {
    return (
      props.context ||
      new EditorState(
        props.componentCatalogue,
        props.editorCatalogue,
        props.handlers,
        [],
        props.storage,
        props.theme
      )
    );
  }, [
    props.componentCatalogue,
    props.context,
    props.editorCatalogue,
    props.handlers,
    props.storage,
    props.theme
  ]);

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
        editorContext.project.state.changeLeftPane(props.defaultView || 'outline');
      });
    } else {
      throw new Error('You need to provide either a storage or a form model');
    }
  }

  if (!stylesLoaded || !project) {
    return <div>Loading ...</div>;
  }

  if (!editorContext.project) {
    editorContext.load(toJS(project));
    if (props.storage) {
      (props.storage as any).projects[project.uid] = editorContext.project;
      (props.storage as any).project = editorContext.project;
    }
  }

  if (!editorContext.undoManager) {
    editorContext.undoManager = initUndoManager(editorContext.project as any);
  }

  return (
    <Context.Provider value={context}>
      <FormEditor
        context={editorContext}
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
