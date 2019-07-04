import React from 'react';
import { observer } from 'mobx-react';
import { SplitPane } from 'react-multi-split-pane';

import { EditorContext } from './editor_context';
import { PagesView } from './pages/pages_view';
import { DatasetElements } from './dataset/dataset_elements';
import { ToolBox } from './toolbox/tool_box';
import { DatasetTypes } from './dataset/dataset_types';
import { OutlineView } from './outline/outline_view';
import { List } from './editor_styles';
import { LeftPane } from './form_store';

/* =========================================================
    Component
   ======================================================== */

type Props = {
  hideViews: string[];
};

export const FromEditorLeftPanel = observer(({ hideViews }: Props) => {
  const context = React.useContext(EditorContext);

  const isActive = React.useCallback((value: LeftPane) => hideViews.indexOf(value) === -1, [
    hideViews
  ]);

  let component: any;

  switch (context.project.state.selectedLeftPane) {
    case 'pages':
      component = <PagesView form={context.form} />;
      break;
    case 'data':
      component = (
        <SplitPane
          className="dataPanes"
          split="horizontal"
          minSize={100}
          defaultSizes={JSON.parse(localStorage.getItem('CORPIX.h-split-tools')) || [280]}
          onDragFinished={size =>
            localStorage.setItem('CORPIX.h-split-tools', JSON.stringify(size))
          }
        >
          <DatasetElements schema={context.schema} types={context.types} owner={context.data} />
          <DatasetTypes schema={context.schema} types={context.types} />
        </SplitPane>
      );
      break;
    case 'components':
      component = <ToolBox catalogue={context.editorCatalogue} />;
      break;
    case 'outline':
      component = <OutlineView />;
      break;
    case 'all':
      component = (
        <SplitPane
          className="dataPanes"
          split="horizontal"
          minSize={40}
          defaultSizes={JSON.parse(localStorage.getItem('CORPIX.all-split'))}
          onDragFinished={size => localStorage.setItem('CORPIX.all-split', JSON.stringify(size))}
        >
          {isActive('pages') && <PagesView form={context.form} />}
          {isActive('outline') && <OutlineView />}
          {isActive('data') && (
            <DatasetElements schema={context.schema} types={context.types} owner={context.data} />
          )}
          {isActive('components') && <ToolBox catalogue={context.editorCatalogue} />}
        </SplitPane>
      );
  }

  return <List>{component}</List>;
});
