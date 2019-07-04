import { create } from './data';
import { FormModel } from '../form_model';

it('creates a new model', () => {
  let model = new FormModel(
    {
      documentation: 'Desc',
      elements: [],
      props: { label: 'Name' }
    },
    null,
    null
  );

  expect(model.description).to.equal('Desc');
  expect(model.elements).to.deep.equal([]);
  expect(model.name).to.equal('Name');
});

function removeWs(text: string) {
  return text
    .split('\n')
    .map(t => t.replace(/^\s*/, ''))
    .join('\n');
}

describe('Preview', () => {
  xit('generates empty', () => {
    let model = new FormModel(
      {
        documentation: 'Desc',
        elements: [],
        props: { label: 'Name' }
      },
      null,
      null
    );
    let preview = model.createHtmlPreview();
    expect(removeWs(preview)).to.equal(`<table>
<tbody>
<tr style="display: none"><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /></tr>

</tbody>
</table>`);
  });

  xit('generates basic', () => {
    let model = new FormModel(
      {
        documentation: 'Desc',
        props: { label: 'Name' },
        elements: [
          {
            props: {
              column: 0,
              row: 0,
              width: 4,
              label: 'Input Label',
              value: { source: 'input' }
            },
            control: 'Input'
          },
          {
            props: {
              row: 0,
              column: 6,
              width: 3,
              label: 'Formula Label',
              value: { source: 'formula' }
            },
            control: 'Formula'
          },
          {
            props: {
              row: 0,
              column: 15,
              width: 1,
              label: 'Text Label',
              value: { source: 'text' }
            },
            control: 'Text'
          },
          {
            props: {
              row: 1,
              column: 3,
              width: 5,
              list: 'select',
              label: 'Select Label',
              value: { source: 'select' }
            },

            control: 'Select'
          },
          {
            props: {
              row: 1,
              column: 10,
              width: 1,
              label: 'Check Yes',
              value: { source: 'checkYes' }
            },
            control: 'Checkbox'
          },
          {
            props: {
              row: 1,
              column: 11,
              width: 1,
              label: 'Check No',
              value: { source: 'checkNo' }
            },

            control: 'Checkbox'
          },
          {
            props: {
              row: 1,
              column: 15,
              width: 1,
              list: 'radio',
              label: 'Radio',
              value: { source: 'radio' }
            },

            control: 'Radio'
          },
          {
            props: {
              row: 1,
              column: 16,
              width: 1,
              label: 'Dean Signature',
              value: { source: 'signature' }
            },

            control: 'Signature'
          },
          {
            props: {
              row: 2,
              column: 0,
              width: 8,
              label: 'Repeater Label',
              value: { source: 'repeater' }
            },

            control: 'Repeater',
            elements: [
              {
                props: {
                  column: 0,
                  row: 0,
                  width: 8,
                  label: 'IR Label 1',
                  value: { source: 'input' }
                },
                control: 'Input'
              },
              {
                props: {
                  column: 8,
                  row: 0,
                  width: 8,
                  label: 'IR Label 2',
                  value: { source: 'input' }
                },
                control: 'Input'
              }
            ]
          },
          {
            props: {
              row: 2,
              column: 9,
              width: 3,
              label: 'Table Label',
              value: { source: 'repeater' }
            },
            control: 'Table',
            elements: [
              {
                props: { width: 8, label: 'IR Label 1', value: { source: 'input' } },
                control: 'Input'
              },
              {
                props: { width: 8, label: 'IR Label 2', value: { source: 'input' } },
                control: 'Input'
              }
            ]
          },
          {
            props: {
              row: 3,
              column: 0,
              width: 16,
              label: 'Form Label',
              value: { source: 'form' }
            },
            control: 'Form',
            elements: [
              {
                props: {
                  row: 0,
                  column: 0,
                  width: 16,
                  label: 'Item Label',
                  value: { source: 'input' }
                },
                control: 'Input'
              }
            ]
          }
        ]
      },
      {
        type: 'object',
        properties: {
          input: {
            type: 'number'
          },
          formula: {
            type: 'string',
            expression: 'this.input + 4'
          },
          text: {
            type: 'string'
          },
          select: {
            type: 'string',
            $enum: [
              { text: 'Sydney', value: '0' },
              { text: 'Melbourne', value: '1' },
              { text: 'Kosice', value: '2' },
              { text: 'Bratislava', value: '3' }
            ]
          },
          radio: {
            type: 'string',
            $enum: [
              { text: 'Tomas', value: '0' },
              { text: 'Michal', value: '1' },
              { text: 'Jana', value: '2' },
              { text: 'Mimo', value: '3' }
            ],
            default: '3'
          },
          checkYes: {
            type: 'boolean',
            default: true
          },
          checkNo: {
            type: 'boolean',
            default: false
          },
          repeater: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                input: {}
              }
            }
          },
          form: {
            type: 'object',
            properties: {
              input: {
                default: '123'
              }
            }
          }
        }
      },
      {
        input: 1,
        select: '2',
        text: 'My Text',
        repeater: [{ input: 'AA' }, { input: 'BB' }],
        form: {
          input: '123'
        }
      }
    );
    let preview = model.createHtmlPreview();
    expect(removeWs(preview)).to.equal(`<table>
<tbody>
<tr style="display: none"><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /></tr>
<tr>
<td colspan="4"><b>Input Label</b><br />1</td>
<td colspan="2" />
<td colspan="3"><b>Formula Label</b><br />5</td>
<td colspan="6" />
<td colspan="1"><b>Text Label</b><br />My Text</td>
</tr>
<tr>
<td colspan="3" />
<td colspan="5"><b>Select Label</b><br />Kosice</td>
<td colspan="2" />
<td colspan="1"><b>Check Yes</b><br /><input type="checkbox" checked="true" /></td>
<td colspan="1"><b>Check No</b><br /><input type="checkbox"  /></td>
<td colspan="3" />
<td colspan="1"><b>Radio</b><br />Mimo</td>
<td colspan="1"></td>
</tr>
<tr>
<td colspan="8"><fieldset>
<legend>Repeater Label</legend>
<table>
<tbody>
<tr style="display: none"><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /></tr>
<tr>
<td colspan="8"><b>IR Label 1</b><br />AA</td>
<td colspan="8"><b>IR Label 2</b><br />AA</td>
</tr>
</tbody>
</table>
<table>
<tbody>
<tr style="display: none"><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /></tr>
<tr>
<td colspan="8"><b>IR Label 1</b><br />BB</td>
<td colspan="8"><b>IR Label 2</b><br />BB</td>
</tr>
</tbody>
</table>
</fieldset></td>
<td colspan="1" />
<td colspan="3"><fieldset>
<legend>Table Label</legend>
<table>
<thead>
<tr>
<th>IR Label 1</th>
<th>IR Label 2</th>
</tr>
</thead>
<tbody>
<tr>
<td>AA</td>
<td>AA</td>
</tr>
<tr>
<td>BB</td>
<td>BB</td>
</tr>
</tbody>
</table>
</fieldset></td>
</tr>
<tr>
<td colspan="16"><fieldset>
<legend>Form Label</legend>
<table>
<tbody>
<tr style="display: none"><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /></tr>
<tr>
<td colspan="16"><b>Item Label</b><br />123</td>
</tr>
</tbody>
</table>
</fieldset></td>
</tr>
</tbody>
</table>`);

    // check text preview
    preview = model.createTextPreview();
    expect(preview).to.equal(`Input Label: 1
Formula Label: 5

Text Label
Select Label: Kosice
Check Yes: Yes
Check No: No
Radio: Mimo

== Start: Repeater Label ==
[1] IR Label 1: AA
    IR Label 2: AA

[2] IR Label 1: BB
    IR Label 2: BB
== End: Repeater Label ==

== Start: Table Label ==
[1] IR Label 1: AA
    IR Label 2: AA

[2] IR Label 1: BB
    IR Label 2: BB
== End: Table Label ==

== Start: Form Label ==
Item Label: 123
== End: Form Label ==`);
  });
});
