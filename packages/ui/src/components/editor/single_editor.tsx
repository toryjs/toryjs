import React from 'react';

import { FormComponentProps } from '@toryjs/form';
import { observer } from 'mobx-react';
import { SingleDropCell } from './single_drop_cell';
import { DynamicComponent } from '../dynamic_component';

export function createEditorContainer(Component: React.ComponentType<FormComponentProps>) {
  const EditorComponent: React.FC<FormComponentProps> = observer(props => {
    if (props.formElement.elements.length === 0) {
      return (
        <DynamicComponent {...props}>
          <SingleDropCell {...props} />
        </DynamicComponent>
      );
    } else return <Component {...props} />;
  });
  EditorComponent.displayName = 'EditorContainer';
  return EditorComponent;
}
