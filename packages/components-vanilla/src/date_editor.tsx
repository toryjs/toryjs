import React from 'react';
import { FormComponentProps, EditorComponent } from '@toryjs/form';
import { DateProps, DateView } from './date_view';
import { observer } from 'mobx-react';
import {
  Context,
  getValue,
  valueSource,
  DynamicComponent,
  propGroup,
  boundProp,
  prop
} from '@toryjs/ui';

const DateEditorComponent: React.FC<FormComponentProps<DateProps>> = observer(props => {
  const context = React.useContext(Context);
  if (!getValue(props, context)) {
    return (
      <DynamicComponent {...props}>
        {valueSource(props.formElement) ? '[Date]' : 'Component not bound!'}
      </DynamicComponent>
    );
  }
  return <DateView {...props} />;
});

export const DateEditor: EditorComponent = {
  Component: DateEditorComponent,
  title: 'Date',
  control: 'Date',
  icon: 'calendar',
  props: propGroup('Date', {
    value: boundProp(),
    local: prop({
      type: 'boolean',
      documentation:
        'Converts the stored tate to your local timezone. If this is not set, the date is displayed the way it is stored. Please use UTC dates.'
    }),
    format: boundProp({
      documentation: `Format the date according to the specified format.<br /><br />
      <b>List of all available formats:</b><br />
      <br />
      <table>
      <thead>
      <tr>
      <th>Format</th>	<th>Output</th>	<th>Description</th>
      </tr>
      </thead>
      <tbody>
      
      <tr><td>YY</td><td>	18</td><td>	Two-digit year</td></tr>
      <tr><td>YYYY</td><td>	2018</td><td>	Four-digit year</td></tr>
      <tr><td>M</td><td>	1-12</td><td>	The month, beginning at 1</td></tr>
      <tr><td>MM</td><td>	01-12</td><td>	The month, 2-digits</td></tr>
      <tr><td>MMM</td><td>	Jan-Dec</td><td>	The abbreviated month name</td></tr>
      <tr><td>MMMM</td><td>	January-December</td><td>	The full month name</td></tr>
      <tr><td>D</td><td>	1-31</td><td>	The day of the month</td></tr>
      <tr><td>DD</td><td>	01-31	</td><td>The day of the month, 2-digits</td></tr>
      <tr><td>d</td><td>	0-6</td><td>	The day of the week, with Sunday as 0</td></tr>
      <tr><td>dd</td><td>	Su-Sa</td><td>	The min name of the day of the week</td></tr>
      <tr><td>ddd</td><td>	Sun-Sat</td><td>	The short name of the day of the week</td></tr>
      <tr><td>dddd</td><td>	Sunday-Saturday</td><td>	The name of the day of the week</td></tr>
      <tr><td>H</td><td>	0-23</td><td>	The hour</td></tr>
      <tr><td>HH</td><td>	00-23</td><td>	The hour, 2-digits</td></tr>
      <tr><td>h</td><td>	1-12</td><td>	The hour, 12-hour clock</td></tr>
      <tr><td>hh</td><td>	01-12</td><td>	The hour, 12-hour clock, 2-digits</td></tr>
      <tr><td>m</td><td>	0-59</td><td>	The minute</td></tr>
      <tr><td>mm</td><td>	00-59</td><td>The minute, 2-digits</td></tr>
      <tr><td>s</td><td>	0-59</td><td>	The second</td></tr>
      <tr><td>ss</td><td>	00-59</td><td>	The second, 2-digits</td></tr>
      <tr><td>SSS</td><td>	000-999</td><td>	The millisecond, 3-digits</td></tr>
      <tr><td>Z</td><td>	+5:00</td><td>	The offset from UTC</td></tr>
      <tr><td>ZZ</td><td>	+0500</td><td>	The offset from UTC, 2-digits</td></tr>
      <tr><td>A</td><td>	AM PM	</td><td></td></tr>      
      <tr><td>a</td><td>	am pm</td><td></td></tr>     
      </tbody> 
      </table>
      `
    })
  }),
  defaultProps: {
    format: 'YYYY-MM-DD'
  }
};
