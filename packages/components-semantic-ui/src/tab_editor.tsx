import React from 'react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';

import { propGroup, prop, boundProp, tableProp, SingleDropCell } from '@toryjs/ui';
import { TabProps, TabView } from './tab_view';

// const TabsEditorComponent = (props: FormComponentProps<TabProps>) => {
//   return (
//     <DynamicComponent {...props}>
//       <TemplateEditor {...props} extra={props.extra} Component={TabView} options={templates} />
//     </DynamicComponent>
//   );
// };

const TabsEditorComponent = (props: FormComponentProps<TabProps>) => {
  return (
    <TabView.Component
      {...props}
      EmptyCell={(props: FormComponentProps) => <SingleDropCell id="0" {...props} />}
    />
  );
};

TabsEditorComponent.displayName = 'TabsEditor';

export const TabsEditor: EditorComponent = {
  Component: TabsEditorComponent,
  bound: true,
  valueProvider: 'value',
  title: 'Tabs',
  control: 'Tabs',
  icon: 'th list',
  props: {
    ...propGroup('Tab Config', {
      value: boundProp({ type: 'string' }, 'SourceHandler'),
      valueField: boundProp({ type: 'string' }),
      textField: boundProp({ type: 'string' }),
      vertical: prop({ type: 'boolean' })
    }),
    // ...propGroup('Editor', {
    //   template: prop({
    //     control: 'Select',
    //     props: {
    //       default: 'component',
    //       options: templates
    //     }
    //   })
    // }),
    menuItems: tableProp({}, 'Tab Items', [
      {
        control: 'Input',
        props: { placeholder: 'Icon', value: { source: 'icon', label: 'Icon' } }
      }
    ])
  }
};
