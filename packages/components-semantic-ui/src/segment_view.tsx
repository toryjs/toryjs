import * as React from 'react';

import { observer } from 'mobx-react';
import { Segment, SegmentProps } from 'semantic-ui-react';
import { FormComponentProps } from '@toryjs/form';
import { createComponents, DynamicComponent } from '@toryjs/ui';

export const controlProps = [
  'attached',
  'basic',
  'circular',
  'clearing',
  'disabled',
  'color',
  'compact',
  'floated',
  'inverted',
  'loading',
  'name',
  'padded',
  'piled',
  'placeholder',
  'raised',
  'secondary',
  'size',
  'stacked',
  'tertiary',
  'textAlign',
  'vertical'
];

export const SegmentView: React.FC<FormComponentProps<SegmentProps>> = observer(props => {
  return (
    <DynamicComponent {...props} controlProps={controlProps} control={Segment}>
      {createComponents(props)}
    </DynamicComponent>
  );
});
