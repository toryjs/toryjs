import * as styles from './editor_styles';
import { PaneContent, ToolBox } from './editor_styles';

import React from 'react';
import names from 'classnames';

import { FormElement } from '@toryjs/form';
import { SplitPane } from 'react-multi-split-pane';
import { Context, ContextType, LeftPane } from '@toryjs/ui';

import { PropertyEditor } from './properties/property_view';
import { observer } from 'mobx-react';
import { css } from 'emotion';
import { SideBar } from './side_bar';
import { FormComponentView } from './form_editor_form_view';
import { FromEditorLeftPanel } from './form_editor_left_panel';
import { TopMenu } from './editor_top.menu';

export type View = 'pages' | 'dataset' | 'components' | 'outline' | 'all';

type Props = {
  showTopMenu: boolean;
  fileOperations?: boolean;
  allowSave?: boolean;
  context: ContextType;
  defaultView?: LeftPane;
  hideViews?: LeftPane[];
};

const editorStyle = css`
  position: absolute;
  left: 60px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  label: editor;
  background: white;
`;

@observer
export class FormEditor extends React.Component<Props> {
  elements: FormElement[];

  public render() {
    const context = this.props.context;

    // bind to current version, used to reset
    context.editor.editorVersion;

    return (
      <Context.Provider value={context} key={context.editor.editorVersion}>
        <SideBar hideViews={this.props.hideViews} />

        {/* {this.props.showTopMenu && <TopMenu manager={manager} />} */}

        {context.editor.project && (
          <div className={names(styles.editorGrid, editorStyle)}>
            <SplitPane
              className=""
              split="vertical"
              minSize={[150, 300, 150]}
              defaultSizes={JSON.parse(localStorage.getItem('CORPIX.v-split-1')) || [280]}
              onDragFinished={size =>
                localStorage.setItem('CORPIX.v-split-1', JSON.stringify(size))
              }
            >
              <PaneContent>
                <FromEditorLeftPanel hideViews={this.props.hideViews} />
              </PaneContent>

              <div>
                {this.props.showTopMenu && (
                  <TopMenu
                    fileOperations={this.props.fileOperations}
                    allowSave={this.props.allowSave}
                  />
                )}
                <ToolBox hideMenu={!this.props.showTopMenu}>
                  <FormComponentView />
                </ToolBox>
              </div>
              <PropertyEditor />
            </SplitPane>
          </div>
        )}
      </Context.Provider>
    );
  }
}

FormEditor.displayName = 'FormEditor';
