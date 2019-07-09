import * as schemaHandlers from './schema_panel.handlers';

import { config, FormElement } from '@toryjs/form';

export { schemaHandlers };

export const schemaPanel: FormElement[] = [
  {
    control: 'Group',
    props: {
      text: 'Data',
      display: 'group'
    },
    elements: [
      /* =========================================================
              NAME / TITLE
             ======================================================== */

      {
        props: {
          value: {
            source: 'title',
            handler: 'titleValueHandler',
            parse: 'titleParseHandler'
          },
          label: config.i18n`Name:`
        },

        control: 'Input',
        documentation: 'Name of the element'
      },

      /* =========================================================
              TYPE
             ======================================================== */
      {
        props: {
          value: {
            source: 'type',
            handler: 'typeValueHandler',
            parse: 'typeParseHandler'
          },
          label: 'Type',
          options: { handler: 'typeOptions' }
        },
        control: 'Select',
        documentation: `Data type of the schema element`
      },

      /* =========================================================
              Default value
             ======================================================== */

      {
        props: {
          label: 'Default',
          value: { source: 'default' },
          visible: { handler: 'atomicTypeVisibility' }
        },
        control: 'Input',
        documentation: `Default value of the element`
      },

      /* =========================================================
              READONLY
             ======================================================== */
      {
        props: {
          label: 'Read Only',
          value: { source: 'readOnly' },
          visible: { handler: 'atomicTypeVisibility' }
        },
        control: 'Checkbox',
        documentation: `Value is readonly`
      },

      /* =========================================================
              FAKER
             ======================================================== */
      // {
      //   label: 'Faker',
      //   props: {
      //     search: true,
      //     value: { source: 'faker' },
      //     visible: { handler: 'atomicTypeVisibility' },
      //     options: { handler: 'fakedOptions' }
      //   },
      //   control: 'Select',
      //   documentation: `Utility type to generate fake data when previewing the form.`
      // },
      {
        props: { label: 'Description', value: { source: 'description' } },
        control: 'Textarea',
        documentation: `Element descriptions`
      },

      /* =========================================================
              Share
             ======================================================== */

      {
        props: {
          value: { label: 'Share', source: 'share' },
          visible: { handler: 'objectVisibilityHandler' }
        },
        control: 'Checkbox',
        documentation: `Any data stored in the shared type is saved into the database and shared among all new processes.
                  This allows for data sharing between processes. When another process uses the same type the data is automatically loaded in the form`
      }
    ]
  },
  {
    control: 'Group',
    props: {
      text: 'Validations'
    },
    elements: [
      /* =========================================================
              NUMBERS
             ======================================================== */
      {
        props: {
          type: 'number',
          inputLabel: 'max',
          value: { source: 'maximum' },
          visible: { handler: 'numberVisibleHandler' }
        },
        tuple: 'Range',
        control: 'Input',
        documentation: `Maximum value of the field, e.g.value <= maximum`
      },
      {
        props: {
          label: 'Exclusive Maximum',
          type: 'number',
          inputLabel: 'max',
          value: { source: 'exclusiveMaximum' },
          visible: { handler: 'numberVisibleHandler' }
        },
        tuple: 'Exclusive',
        control: 'Input',
        documentation: `Exclusive maximum value of the field, e.g.value < maximum`
      },
      {
        props: {
          label: 'Minimum',
          type: 'number',
          inputLabel: 'min',
          visible: { handler: 'numberVisibleHandler' },
          value: { source: 'minimum' }
        },
        tuple: 'Range',
        control: 'Input',
        documentation: `Minimum value of the field, e.g.value >= maximum`
      },
      {
        props: {
          label: 'Exclusive Minimum',
          type: 'number',
          inputLabel: 'min',
          visible: { handler: 'numberVisibleHandler' },
          value: { source: 'exclusiveMinimum' }
        },
        tuple: 'Exclusive',
        control: 'Input',
        documentation: `Exclusive minimum value of the field, e.g.value > maximum`
      },

      {
        props: {
          label: 'Multiple Of',
          type: 'number',
          value: { source: 'multipleOf' },
          visible: { handler: 'numberVisibleHandler' }
        },
        control: 'Input',
        documentation: `Value has to be a multiple of specified number, e.g. for 3, the correct values are 0, 3, 6, 9 ...`
      },

      /* =========================================================
              STRING
             ======================================================== */
      {
        props: {
          label: 'Format',
          value: { source: 'format' },
          visible: { handler: 'stringVisibleHandler' },
          options: { handler: 'formatOptions' }
        },
        control: 'Select',

        documentation: `Specific format of the string. Please see <a href="https://json-schema.org/understanding-json-schema/reference/string.html" target="_blank">following page</a> for more details`
      },
      {
        props: {
          label: 'Minimum Length',
          type: 'number',
          inputLabel: 'min',
          visible: { handler: 'stringVisibleHandler' },
          value: { source: 'minLength' }
        },
        tuple: 'Length',
        control: 'Input',
        documentation: `Minimum length of the string`
      },
      {
        props: {
          label: 'Maximum Length',
          type: 'number',
          inputLabel: 'max',
          visible: { handler: 'stringVisibleHandler' },
          value: { source: 'maxLength' }
        },
        tuple: 'Length',
        control: 'Input',
        documentation: `Maximum length of the string`
      },

      {
        props: {
          label: 'RegEx Pattern',
          value: { source: 'pattern', validate: 'regexValidateHandler' },
          visible: { handler: 'stringVisibleHandler' }
        },
        control: 'Input',
        documentation: `Regular expression that has to match the string.`
      },
      /* =========================================================
              ARRAY
             ======================================================== */
      {
        props: {
          label: 'Items Type',
          visible: { handler: 'arrayVisibleHandler' },
          value: {
            source: 'items.type',
            handler: 'itemsTypeValueHandler',
            parse: 'itemsTypeParseHandler'
          },
          options: { handler: 'typeOptions' }
        },
        control: 'Select',
        documentation: `Minimum number of items in the array`
      },
      {
        props: {
          label: 'Maximum Items',
          visible: { handler: 'arrayVisibleHandler' },
          type: 'number',
          value: { source: 'maxItems' }
        },
        control: 'Input',
        documentation: `Maximum number of items in the array`
      },
      {
        props: {
          label: 'Minimum Items',
          value: { source: 'minItems' },
          visible: { handler: 'arrayVisibleHandler' },
          type: 'number'
        },
        control: 'Input',
        documentation: `Minimum number of items in the array`
      },
      {
        props: {
          label: 'Unique Items',
          visible: { handler: 'arrayVisibleHandler' },
          value: { source: 'uniqueItems' }
        },
        control: 'Checkbox',
        documentation: `Array has to contain only unique items`
      },

      /* =========================================================
              GENERAL
             ======================================================== */
      {
        props: { label: 'Group', value: { source: 'validationGroup' } },
        control: 'Input',
        documentation: `Fields in the same validation group are validated together. When changing a member of a validation group all other members of this group are validated.`
      },
      {
        props: {
          label: 'Required',
          visible: { handler: 'atomicTypeVisibility' },
          value: { source: 'title', handler: 'requiredValue', parse: 'requiredParse' }
        },
        control: 'Checkbox',
        documentation: `Value of this field is required.`
      },
      {
        props: {
          visible: { handler: 'errorMessageVisibleHandler' },
          label: config.i18n`Message`,
          value: { source: 'errorMessage' }
        },
        control: 'Input',
        documentation:
          'You can define a single error message if any of the validations fail, or you can define custom messages for each validation element.'
        // visible: owner => owner.getValue('type') === 'object'
      }
    ]
  },
  {
    control: 'Map',
    props: {
      text: 'Custom Messages',
      value: { source: 'errorMessage' },
      options: { handler: 'errorMessageOptions' }
    },
    documentation: 'You can define an error message per validation category.'
    // visible: owner => owner.getValue('type') === 'object'
  },

  /* =========================================================
          Required
         ======================================================== */
  // {
  //   props: {
  //     text: config.i18n`Required Fields`,
  //     value: { source: 'required' },
  //     visible: { handler: 'objectVisibilityHandler' }
  //   },
  //   control: 'Table',
  //   elements: [
  //     {
  //       control: 'Select',
  //       props: {
  //         value: { source: '.' },
  //         options: { handler: 'requiredOptionsHandler' }
  //       }
  //     }
  //   ],
  //   documentation: 'List of fields which value is required'
  //   // visible: owner => owner.getValue('type') === 'object'
  // },
  {
    control: 'Table',
    props: {
      value: { source: '$enum' },
      text: 'Enumerations'
    },
    elements: [
      {
        control: 'Input',
        props: {
          label: 'Text',
          value: { source: 'text' },
          width: 10,
          placeholder: 'Text'
        }
      },
      {
        control: 'Input',
        props: {
          label: 'Value',
          width: 6,
          value: { source: 'value' },
          placeholder: 'Value'
        }
      }
    ]
  },
  {
    control: 'Group',
    props: {
      text: 'Value Expression',
      bare: true
    },
    elements: [
      {
        control: 'Textarea',
        props: {
          value: { source: 'expression', validate: 'expressionValidationHandler' },
          placeholder: 'Javascript Expression',
          css: 'min-height: 80px'
        },

        documentation: `Dynamic expression that evaluates automatically when your data changes.
      Expressions use javascript and you can use <i>this</i> keyword to access the dataset.<br/><br />
      <p>
      <b>Example:</b>
      <p>Consider following dataset:</p>
      <p style="font-family: Courier">
      purchasePrice: number<br />
      currentCountry: object<br />
      &nbsp;&nbsp;&nbsp;&nbsp;tax: number
      </p>
      <p>You can write a following expression:</p>
      <p style="font-family: Courier">
      this.purchasePrice + this.currentCountry.tax 
      </p>
      </p>`
      }
    ]
  },
  {
    control: 'Group',
    props: {
      text: 'Validation Expression',
      bare: true
    },
    elements: [
      {
        control: 'Textarea',
        props: {
          value: { source: 'validationExpression' },
          placeholder: 'Javascript Expression'
        },
        documentation: `Dynamic expression that automatically validates when your data changes.
    Expressions use javascript and you can use <i>this</i> keyword to access the dataset and <i>value</i> keyword to access the current value.<br/><br />
    <p>
    <b>Example:</b>
    <p style="font-family: Courier">
    value > this.price 
    </p>
    </p>`
      }
    ]
  }
];

// type Props = {
//   project: ProjectDataSet;
//   selected: SchemaDataSet;
// };

// export const SchemaEditor = observer(({ project, selected }: Props) => {
//   // subscribe to changes to name
//   project.state.selectedSchemaName;

//   return (
//     <>
//       {renderElements(tabs, selected, handlers as any, null /* catalogue */)}
//       {/* <DeleteSchema schema={selected} property={project.state.selectedSchemaName} /> */}
//       {/* <PropertiesView
//         owner={activeElement}
//         handlers={handlers}
//         tabs={tabs}
//         Buttons={() => (
//           <DeleteSchema schema={context.schema} property={project.state.selectedSchemaName} />
//         )}
//       /> */}
//     </>
//   );
// });

// SchemaEditor.displayName = 'SchemaEditor';
