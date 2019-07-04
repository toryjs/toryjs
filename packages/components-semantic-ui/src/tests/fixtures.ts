// import * as fs from 'fs';
// import * as path from 'path';

import { FormElement, JSONSchema } from '@toryjs/form';

const user = {
  id: 'uid',
  uid: 'uid'
};

export const signatureSchema: JSONSchema = {
  type: 'object',
  title: 'Signature',
  properties: {
    comment: { type: 'string' },
    signature: { type: 'string' },
    verifiedState: { type: 'string', enum: ['Verified', 'Rejected'] },
    rejected: { type: 'boolean' },
    uid: { type: 'string' },
    name: { type: 'string' },
    date: { type: 'string', format: 'date-time' }
  },
  required: ['name'],
  errorMessage: {
    required: {
      name: 'Missing signature'
    }
  }
};

// tslint:disable-next-line:no-console
// console.log('Creating schemas ...');

export const personSchema: JSONSchema = {
  type: 'object',
  title: 'Person',
  properties: {
    firstName: { type: 'string' },
    middleName: { type: 'string' },
    lastName: { type: 'string' },
    fullName: { type: 'string' },
    gender: { type: 'string', enum: ['M', 'F', 'Other'] },
    email: {
      type: 'string',
      pattern:
        '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
      errorMessage: {
        pattern: 'Invalid email'
      }
    },
    uid: { type: 'string' }
  },
  required: ['firstName', 'lastName', 'fullName', 'email']
};

export const someSchema: JSONSchema = {
  title: 'Some',
  type: 'object',
  properties: {
    foo: { type: 'string' }
  }
};

// insert schema

export const person = {
  id: 'p1',
  name: 'person',
  description: 'Personal data of a user',
  schema: personSchema
};

export const signature = {
  id: 's1',
  name: 'signature',
  description: 'Schema of a signature',
  schema: signatureSchema
};

const schemas = {
  person,
  signature
};

// tslint:disable-next-line:no-console
// console.log('Creating resources ...');

/* =========================================================
      SCHEMAS
     ======================================================== */

//#region Schemas

export const baseSchema: JSONSchema = {
  type: 'object',
  properties: {
    person: {
      type: 'object',
      $ref: '#/definitions/person',
      required: ['fullName', 'uid', 'email']
    },
    supervisor: {
      type: 'string',
      $enum: [
        { value: '30031001', text: 'Trish Saladine' },
        { value: '30031003', text: 'Jodie Clark' }
      ]
    },
    unit: {
      type: 'string',
      $enum: [
        { value: '30031002', text: 'Engineering Unit 1' },
        { value: '30031004', text: 'Engineering Unit 2' }
      ]
    },
    requestConsumables: { type: 'boolean', validationGroup: 'request' },
    requestMinorEquipment: {
      type: 'boolean',
      validationGroup: 'request',
      errorMessage: 'Select at least one category'
    },
    requestSoftware: { type: 'boolean', validationGroup: 'request' },
    requestThesis: { type: 'boolean', validationGroup: 'request' },
    statement: { type: 'string' },
    amount: { type: 'number', maximum: 650, minimum: 0 },
    kids: {
      type: 'array',
      items: {
        $ref: '#/definitions/family'
      }
    },
    depenendables: {
      type: 'object',
      properties: {
        pets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              animal: { type: 'string' }
            }
          }
        }
      }
    },
    sports: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    car: {
      type: 'object',
      $ref: '#/definitions/car'
    }
  },
  required: ['unit', 'statement', 'amount', 'supervisor'],
  anyOf: [
    {
      type: 'object',
      required: ['requestConsumables'],
      errorMessage: {
        required: 'Select at least one category'
      }
    },
    {
      type: 'object',
      required: ['requestMinorEquipment'],
      errorMessage: {
        required: 'Select at least one category'
      }
    },
    {
      type: 'object',
      required: ['requestSoftware'],
      errorMessage: {
        required: 'Select at least one category'
      }
    },
    {
      type: 'object',
      required: ['requestThesis'],
      errorMessage: {
        required: 'Select at least one category'
      }
    }
  ],
  definitions: {
    person: personSchema,
    family: {
      type: 'object',
      title: 'Family',
      properties: {
        father: { type: 'string' },
        mother: { type: 'string' }
      }
    },
    car: {
      type: 'object',
      title: 'Car',
      properties: {
        parameters: {
          type: 'object',
          properties: {
            engine: { type: 'string' },
            length: { type: 'number' }
          },
          allOf: [{ required: ['engine'] }, { required: ['length'] }]
        },
        brand: { type: 'string' }
      }
    }
  }
};

export const studentSchema: JSONSchema = {
  type: 'object',
  title: 'Student',
  properties: {
    studentSignature: {
      $import: schemas.signature.id
    }
  }
};

export const supervisorSchema: JSONSchema = {
  type: 'object',
  title: 'Supervisor',
  properties: {
    supervisorSignature: {
      $import: schemas.signature.id
    },
    studentSignature: {
      $import: schemas.signature.id
    }
  }
};

export const unitCoordinatorSchema: JSONSchema = {
  type: 'object',
  title: 'Unit Coordinator',
  properties: {
    unitCoordinatorSignature: {
      $import: schemas.signature.id
    },
    studentSignature: {
      $import: schemas.signature.id
    }
  }
};

export const adminValidationSchema: JSONSchema = {
  type: 'object',
  title: 'Admin',
  properties: {
    adminComment: {
      type: 'string'
    },
    formValid: {
      type: 'boolean'
    }
  }
};

export const userAdjustmentSchema: JSONSchema = {
  type: 'object',
  title: 'User Adjustment',
  properties: {
    adminComment: {
      type: 'string'
    },
    studentSignature: {
      $import: schemas.signature.id
    }
  }
};

export const completeSchema: JSONSchema = {
  type: 'object',
  properties: {
    supervisorSignature: {
      $import: schemas.signature.id
    },
    unitCoordinatorSignature: {
      $import: schemas.signature.id
    },
    studentSignature: {
      $import: schemas.signature.id
    }
  }
};

//#endregion

// info document
const info = ''; // fs.readFileSync(path.resolve('./src/fixtures/spf_info.md'), { encoding: 'utf-8' });

/* =========================================================
      FORMS
     ======================================================== */

//#region Forms

export const baseForm: FormElement = {
  documentation: 'Application form for the project funding ',
  control: 'Form',
  props: {
    control: 'Form',
    label: 'Application Form'
  },
  elements: [
    {
      control: 'Grid',
      props: {
        control: 'Grid',
        rows: 10,
        columns: 4,
        gap: '12px'
      },
      elements: [
        {
          control: 'Image',
          props: {
            control: 'Logo',
            imageWidth: '300px',
            column: 1,
            width: 2,
            row: 1,
            target: 'https://d20xd7mbt7xiju.cloudfront.net/test/wsu/WSU_logo.jpg',
            label: 'Logo'
          }
        },
        {
          control: 'Text',
          props: {
            control: 'Text',
            text: 'School of Computing, Engineering and Mathematics',
            row: 1,
            column: 3,
            width: 2,
            style: {
              textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '18px'
            },
            horizontalAlign: 'center',
            verticalAlign: 'center'
          }
        },
        {
          control: 'Text',
          props: {
            row: 2,
            column: 1,
            width: 4,
            control: 'Text',
            style: {
              text: '2019 U/G Engineering Student Project Funding Application Form',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '24px',
              marginBottom: '12px'
            }
          }
        },
        {
          control: 'Input',
          props: {
            row: 3,
            column: 1,
            width: 2,
            control: 'Input',
            label: 'Student Name',
            value: {
              source: 'person.fullName'
            }
          }
        },
        {
          control: 'Input',
          props: {
            row: 3,
            column: 3,
            width: 2,
            control: 'Input',
            label: 'Student ID',
            value: {
              source: 'person.uid'
            }
          }
        },
        {
          control: 'Input',
          props: {
            row: 4,
            column: 1,
            width: 2,
            control: 'Input',
            label: 'Email',
            value: {
              source: 'person.email'
            }
          }
        },
        {
          control: 'Select',
          props: {
            row: 4,
            column: 3,
            width: 2,
            control: 'Select',
            list: 'unit',
            label: 'Unit Number',
            value: {
              source: 'unit'
            }
          }
        },
        {
          control: 'Text',
          props: {
            text: 'Please select the categories from which your funds will be expended:',
            row: 6,
            column: 1,
            width: 4,
            control: 'Text'
          }
        },
        {
          control: 'Checkbox',
          props: {
            text: 'Consumables ',
            row: 7,
            column: 1,
            width: 1,
            control: 'Checkbox',
            value: {
              source: 'requestConsumables'
            }
          }
        },
        {
          control: 'Checkbox',
          props: {
            text: 'Minor Equipment  ',
            row: 7,
            column: 2,
            width: 1,
            control: 'Checkbox',
            value: {
              source: 'requestMinorEquipment'
            }
          }
        },
        {
          control: 'Checkbox',
          props: {
            text: 'Specialist Software',
            row: 7,
            column: 3,
            width: 1,
            control: 'Checkbox',
            value: {
              source: 'requestSoftware'
            }
          }
        },
        {
          control: 'Checkbox',
          props: {
            text: 'Thesis printing/binding',
            row: 7,
            column: 4,
            width: 1,
            control: 'Checkbox',
            value: {
              source: 'requestThesis'
            }
          }
        },
        {
          control: 'Textarea',
          props: {
            row: 8,
            column: 1,
            width: 4,
            control: 'Textarea',
            label:
              'Statement detailing the resources required, the purposes and activities proposed, the service provider, itemised costs and the quote',
            value: {
              source: 'statement'
            }
          }
        },
        {
          control: 'Input',
          props: {
            label: 'Total Amount requested',
            labelPosition: 'left',
            row: 9,
            column: 1,
            width: 2,
            control: 'Input',
            value: {
              source: 'amount'
            }
          }
        },
        {
          control: 'Text',
          props: {
            text:
              '(<b>maximum amount - $650</b> this covers Engineering Project and Honours Thesis units – see conditions of funding on page 1)',
            row: 9,
            column: 3,
            width: 2,
            control: 'Text'
          }
        }
      ]
    }
  ]
};
export const studentForm: FormElement = {
  elements: [
    {
      props: {
        row: 0,
        column: 0,
        width: 16,
        sourceRef: 'baseForm'
      },
      control: 'Form'
    },
    {
      control: 'Signature',
      props: {
        row: 1,
        column: 0,
        submit: true,
        label: 'Student Signature',
        value: {
          source: 'studentSignature'
        }
      }
    }
  ],
  props: {
    label: 'Funding Application Form'
  }
};

export const supervisorForm: FormElement = {
  elements: [
    {
      props: { row: 0, column: 0, width: 16, sourceRef: 'baseForm', readOnly: true },
      control: 'Form'
    },
    {
      control: 'Signature',
      props: {
        row: 1,
        column: 0,
        submit: true,
        allowComment: true,
        allowReject: true,
        label: 'Supervisor Signature',
        value: { source: 'supervisorSignature' }
      }
    }
  ],
  props: { label: 'Funding Application Form' }
};

export const unitCoordinatorForm: FormElement = {
  elements: [
    { props: { row: 0, column: 0, width: 16, sourceRef: 'baseForm' }, control: 'Form' },
    {
      control: 'Signature',
      props: {
        row: 1,
        column: 0,
        submit: true,
        allowComment: true,
        allowReject: true,
        label: 'Unit Coordinator Signature',
        value: { source: 'unitCoordinatorSignature' }
      }
    }
  ],
  props: { label: 'Funding Application Form' }
};

export const adminValidationForm: FormElement = {
  elements: [
    { props: { row: 0, column: 0, width: 16, sourceRef: 'baseForm' }, control: 'Form' },
    {
      props: { row: 1, column: 0, width: 16, label: 'Comment', value: { source: 'adminComment' } },
      control: 'Textarea'
    },
    {
      props: { row: 2, column: 2, width: 2, value: { source: 'formValid' } },
      control: 'ApproveButton'
    },
    {
      props: { row: 2, column: 0, width: 2, value: { source: 'formValid' } },
      control: 'RejectButton'
    }
  ],
  props: { label: 'Admin Validation Form' }
};

export const userAdjustmentForm: FormElement = {
  elements: [
    { props: { row: 0, column: 0, width: 16, sourceRef: 'baseForm' }, control: 'Form' },
    {
      props: { row: 1, column: 0, width: 16, label: 'Comment', value: { source: 'adminComment' } },
      control: 'Comment'
    },
    {
      control: 'Signature',
      props: {
        submit: true,
        row: 1,
        column: 0,
        label: 'Student Signature',
        value: { source: 'studentSignature' }
      }
    }
  ],
  props: { label: 'User Adjustment - Funding Application Form' }
};

export const completeForm: FormElement = {
  elements: [
    { props: { row: 0, column: 0, width: 16, sourceRef: 'adminValidation' }, control: 'Form' },
    {
      control: 'Signature',
      props: {
        row: 1,
        column: 0,
        width: 4,
        submit: true,
        label: 'Student Signature',
        value: { source: 'studentSignature' }
      }
    },
    {
      control: 'Signature',
      props: {
        row: 1,
        column: 4,
        width: 4,
        submit: true,
        allowComment: true,
        label: 'Supervisor Signature',
        value: { source: 'supervisorSignature' }
      }
    },
    {
      control: 'Signature',
      props: {
        row: 1,
        column: 8,
        width: 4,
        submit: true,
        allowComment: true,
        label: 'Unit Coordinator Signature',
        value: { source: 'unitCoordinatorSignature' }
      }
    }
  ],
  props: { label: 'Funding Application Form' }
};

export const completeStudentPositiveForm: FormElement = {
  elements: [
    {
      props: {
        row: 0,
        column: 0,
        width: 16,
        value:
          '<h3>Your funding request was approved!</h3>\nPlease see the form below for your reference.\n<hr />\n      '
      },
      control: 'Text'
    },
    { props: { row: 1, column: 0, width: 16, sourceRef: 'completeForm' }, control: 'Form' }
  ],
  props: { label: 'Funding Application Form' }
};

export const completeStudentNegativeForm: FormElement = {
  elements: [
    {
      props: {
        row: 0,
        column: 0,
        width: 16,
        value:
          '<h3><b>Your funding request was rejected ;(</b></h3>\nPlease see the form below for your reference.<br />\n<hr />\n<br />\n      '
      },
      control: 'Text'
    },
    { props: { row: 1, column: 0, width: 16, sourceRef: 'completeForm' }, control: 'Form' }
  ],
  props: { label: 'Funding Application Form' }
};

export const completeTechForm: FormElement = {
  elements: [
    {
      props: {
        row: 0,
        column: 0,
        width: 16,
        value:
          'Dear Tech Support<br />\n<h3>Following student request for funding was approved. Please proceed with purchase.</h3>\nThank you!<br />\n<br />\n<hr />\n      '
      },
      control: 'Text'
    },
    { props: { row: 1, column: 0, width: 16, sourceRef: 'completeForm' }, control: 'Form' }
  ],
  props: { label: 'Funding Application Form' }
};

//#endregion

/* =========================================================
      RESOURCES
     ======================================================== */

//#region Resources

export const baseFormResource = {
  refName: 'baseForm',
  type: 'Form',
  createdById: user.uid,
  title: 'Funding Application Form',
  model: baseForm,
  schema: baseSchema
};

export const completeFormResource = {
  refName: 'completeForm',
  type: 'Form',
  createdById: user.uid,
  title: 'Funding Application Form',
  model: completeForm,
  schema: completeSchema
};

export const studentFormResource = {
  refName: 'studentForm',
  type: 'Form',
  createdById: user.uid,
  title: 'Funding Application Form',
  model: studentForm,
  schema: studentSchema
};

export const supervisorFormResource = {
  refName: 'supervisorForm',
  type: 'Form',
  createdById: user.uid,
  title: 'Funding Application Form',
  model: supervisorForm,
  schema: supervisorSchema
};

export const unitCoordinatorFormResource = {
  refName: 'unitCoordinatorForm',
  type: 'Form',
  createdById: user.uid,
  title: 'Funding Application Form',
  model: unitCoordinatorForm,
  schema: unitCoordinatorSchema
};

export const documentResource = {
  refName: 'document',
  type: 'Document',
  createdById: user.uid,
  title: 'Guidelines',
  text: info,
  contentType: 'Markdown'
};

export const adminValidationResource = {
  refName: 'adminValidation',
  type: 'Form',
  createdById: user.uid,
  title: 'Admin Validation Form',
  model: adminValidationForm,
  schema: adminValidationSchema
};

export const userAdjustmentResource = {
  refName: 'userAdjustment',
  type: 'Form',
  createdById: user.uid,
  title: 'User Adjustment - Funding Application Form',
  model: userAdjustmentForm,
  schema: userAdjustmentSchema
};

export const notifyStudentPositiveResource = {
  refName: 'notifyStudentPositive',
  type: 'Form',
  createdById: user.uid,
  title: 'Notify Student Email',
  model: completeStudentPositiveForm,
  schema: completeSchema
};

export const notifyStudentNegativeResource = {
  refName: 'notifyStudentNegative',
  type: 'Form',
  createdById: user.uid,
  title: 'Notify Student Email',
  model: completeStudentNegativeForm,
  schema: completeSchema
};

export const notifyTechResource = {
  refName: 'notifyTech',
  type: 'Form',
  createdById: user.uid,
  title: 'Notify Tech Email',
  model: completeTechForm,
  schema: completeSchema
};

//#endregion
