import React from 'react';
import { FormComponentProps, EditorComponent } from '@toryjs/form';

import { propGroup, boundProp, DropComponentEditor } from '@toryjs/ui';
import { FlexView, FlexProps } from './flex_view';

export const FlexEditorComponent: React.FC<FormComponentProps<FlexProps>> = props => (
  <DropComponentEditor
    {...props}
    Component={FlexView.Component as any}
    layout={props.formElement.props.layout as any}
  />
);

export const FlexEditor: EditorComponent = {
  Component: FlexEditorComponent,
  control: 'Flex',
  icon: 'align justify',
  title: 'Flex Layout',
  group: 'Layout',
  defaultProps: {
    layout: 'column'
  },
  props: propGroup('Flex', {
    layout: boundProp({
      documentation: 'Items can either be stacked in rows or columns',
      label: 'Layout',
      type: 'string',
      $enum: [{ text: 'Rows', value: 'row' }, { text: 'Columns', value: 'column' }]
    }),
    gap: boundProp({
      documentation: 'Spacing between cells',
      label: 'Gap',
      control: 'Select',
      type: 'string',
      $enum: [
        { text: 'None', value: '0px' },
        { text: 'Tiny', value: '3px' },
        { text: 'Small', value: '6px' },
        { text: 'Normal', value: '12px' },
        { text: 'Big', value: '18px' },
        { text: 'Huge', value: '24px' }
      ]
    }),
    wrap: boundProp({
      documentation: 'Items can wrap if no space remains',
      label: 'Wrap',
      control: 'Select',
      type: 'string',
      $enum: [
        { text: 'Wrap', value: 'wrap' },
        { text: 'No Wrap', value: 'no-wrap' },
        { text: 'Reverse Wrap', value: 'wrap-reverse' }
      ]
    }),
    justifyContent: boundProp({
      control: 'Select',
      documentation: `Set how elements are distributed in the container. <br>
          <ul>
          <li><i>Start (default)</i>: items are packed toward the start line</li>
          <li><i>End:</i> items are packed toward the end line</li>
          <li><i>Center</i>: items are centered along the line</li>
          <li><i>Space Between</i>: items are evenly distributed in the line; first item is on the start line, last item on the end line</li>
          <li><i>Space Around</i>: items are evenly distributed in the line with equal space around them. Note that visually the spaces aren't equal, since all the items have equal space on both sides. The first item will have one unit of space against the container edge, but two units of space between the next item because that next item has its own spacing that applies.</li>
          <li><i>Space Evenly</i>: items are distributed so that the spacing between any two items (and the space to the edges) is equal.</li>
          </ul>
          Information taken from <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">this guide</a> for more details`,
      label: 'Justify',

      type: 'string',
      $enum: [
        { text: 'Start', value: 'flex-start' },
        { text: 'End', value: 'flex-end' },
        { text: 'Center', value: 'center' },
        { text: 'Space Between', value: 'space-between' },
        { text: 'Space Around', value: 'space-around' },
        { text: 'Space Evenly', value: 'space-evenly' }
      ]
    }),
    alignItems: boundProp({
      documentation: `This defines the default behavior for how items are laid out along horizontal (column layout) or vertical (row layout) axis.<br>
          <ul>
          <li><i>Stretch (default)</i>: stretch to fill the container</li>
          <li><i>Start</i>: items are aligned at the beginning of their container</li>
          <li><i>End</i>: items are aligned at the end of their container</li>
          <li><i>Center</i>: items are centered</li>
          <li><i>Baseline</i>: items are aligned based on text position</li>
          </ul>
          Information taken from <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">this guide</a> for more details`,
      label: 'Align Items',
      type: 'string',
      $enum: [
        { text: 'Stretch', value: 'stretch' },
        { text: 'Start', value: 'flex-start' },
        { text: 'End', value: 'flex-end' },
        { text: 'Center', value: 'center' },
        { text: 'Baseline', value: 'baseline' }
      ]
    }),
    alignContent: boundProp({
      control: 'Select',
      documentation: `This defines the default behavior for how items are laid out along vertical (column layout) or horizontal (row layout) axis.<br>
          <ul>
          <li><i>Start</i>: lines packed to the start of the container</li>
          <li><i>End</i>: lines packed to the end of the container</li>
          <li><i>Center</i>: lines packed to the center of the container</li>
          <li><i>Space Between</i>: lines evenly distributed; the first line is at the start of the container while the last one is at the end</li>
          <li><i>Space Around:</i> lines evenly distributed with equal space around each line</li>
          <li><i>Stretch (default)</i></i>: lines stretch to take up the remaining space</li>
          </ul>
          Information taken from <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">this guide</a> for more details`,
      label: 'Align Content',
      type: 'string',
      $enum: [
        { text: 'Start', value: 'flex-start' },
        { text: 'End', value: 'flex-end' },
        { text: 'Center', value: 'center' },
        { text: 'Space Between', value: 'space-between' },
        { text: 'Space Around', value: 'space-around' },
        { text: 'Stretch', value: 'stretch' }
      ]
    })
  }),
  childProps: {
    basis: boundProp({
      group: 'Layout',
      documentation: 'Base width of the item. Value can be in [px, %, auto]',
      label: 'Width',
      type: 'string'
    }),
    grow: boundProp({
      group: 'Layout',
      label: 'Grow',
      documentation:
        'Ratio to which the item grows in relation to other items. If all items have grow value 1, all grow the same way. If one item has grow value 1 and other 2, the one with value 2 will grow twice as big.',
      type: 'number'
    }),
    shrink: boundProp({
      group: 'Layout',
      documentation:
        'Ratio to which the item shrinks in relation to other items. If all items have grow value 1, all shrink the same way. If one item has shrink value 1 and other 2, the one with value 2 will shrink twice smaller.',
      label: 'Shrink',
      type: 'number'
    }),
    alignSelf: boundProp({
      group: 'Layout',
      control: 'Select',
      documentation: `This defines the default behavior for how the item is laid out along horizontal (column layout) or vertical (row layout) axis.<br>
          <ul>
          <li><i>Stretch (default)</i>: stretch to fill the container</li>
          <li><i>Start</i>: items are aligned at the beginning of their container</li>
          <li><i>End</i>: items are aligned at the end of their container</li>
          <li><i>Center</i>: items are centered</li>
          <li><i>Baseline</i>: items are aligned based on text position</li>
          </ul>
          Information taken from <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">this guide</a> for more details`,
      label: 'Align Item',
      type: 'string',
      $enum: [
        { text: 'Stretch', value: 'stretch' },
        { text: 'Start', value: 'flex-start' },
        { text: 'End', value: 'flex-end' },
        { text: 'Center', value: 'center' },
        { text: 'Baseline', value: 'baseline' }
      ]
    })
  }
};
