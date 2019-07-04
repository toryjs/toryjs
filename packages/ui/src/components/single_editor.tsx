import React from 'react';
import { FormComponentProps } from '@toryjs/form';

import { DynamicComponent } from './dynamic_component';
import { SingleDropCell } from '../editor/layouts_common_editor';
import { observer } from 'mobx-react';

export function initSingleEditor(Component: React.ComponentType<FormComponentProps>) {
  const EditorComponent: React.FC<FormComponentProps> = observer(props => {
    if (props.formElement.elements.length === 0) {
      return (
        <DynamicComponent {...props}>
          <SingleDropCell {...props} />
        </DynamicComponent>
      );
    } else return <Component {...props} />;
  });
  return EditorComponent;
}
