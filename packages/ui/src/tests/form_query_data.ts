import { FormElement } from '@toryjs/form';

export const defaultForm: FormElement = {
  documentation: 'Test Form',
  elements: []
};

export const defaultFormElement: FormElement = {
  control: null,
  props: null,
  elements: null
};

export const create = {
  grid(form: Partial<FormElement> = {}): FormElement {
    return {
      control: 'Form',
      elements: [{ control: 'Grid', ...form, props: { gap: '12px', ...form.props } }]
    };
  },
  stack(form: Partial<FormElement> = {}): FormElement {
    return {
      control: 'Form',
      elements: [
        {
          control: 'Stack',
          ...form,
          props: {
            gap: '12px',
            layout: 'column',
            final: true,
            ...form.props
          }
        }
      ]
    };
  },
  formElement(form: Partial<FormElement> = {}): FormElement {
    return { ...form };
  }
};
