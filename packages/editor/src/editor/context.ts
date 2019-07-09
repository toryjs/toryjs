import { EditorContext, IStorage, ContextType } from '@toryjs/ui';
import { prepareStores } from './form_store';
import { ProjectManager } from './project_manager';
import { Handlers, FormComponentCatalogue, EditorComponentCatalogue } from '@toryjs/form';
import { Theme } from './themes/common';
import { themes } from './themes';

type Props = {
  storage: IStorage;
  componentCatalogue: FormComponentCatalogue;
  editorCatalogue: EditorComponentCatalogue;
  handlers: Handlers<any, any>;
  theme?: Theme;
};

export function createEditorContext(options: Props, context: ContextType) {
  const newContext = new EditorContext(
    options.componentCatalogue,
    options.editorCatalogue,
    options.handlers,
    [],
    options.theme || themes.light
  );

  const builder = prepareStores(newContext);
  const manager = new ProjectManager(options.storage, builder);

  newContext.init(manager);
  context.editor = newContext;

  return newContext;
}
