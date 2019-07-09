import { config, FormElement } from '@toryjs/form';

export let propertyPanel: FormElement[] = [
  {
    control: 'Group',
    props: {
      text: 'General'
    },
    elements: [
      {
        bound: true,
        props: {
          value: { source: 'label' },
          label: config.i18n`Label`
        },
        control: 'Input',
        documentation: 'Element label'
      },
      {
        bound: true,
        props: {
          value: { source: 'hidden' },
          label: config.i18n`Hide`
        },
        control: 'Checkbox'
      },
      {
        bound: true,
        props: {
          value: { source: 'className' },
          label: config.i18n`Css Class`
        },
        control: 'Input'
      },
      {
        control: 'Code',
        bound: true,
        props: {
          label: 'Style',
          display: 'topLabel',
          value: { source: 'css' },
          language: 'css',
          placeholder: 'Css styling'
        },
        documentation: `Apply css styles to your control`
      }
      // {
      //   props: { checked: { source: 'readOnly', visible: { handler: 'readonlyElements' } } },
      //   label: config.i18n`Readonly:`,
      //   control: 'Checkbox'
      // }
    ]
  }
];
