import { FormConfig } from "../../form-builder/types";

export const config: FormConfig = {
  template: undefined,
  fields: [
    {
      name: "FIRST_FIELD",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ]
    },
    {
      name: "SECOND_FIELD",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ]
    },
    {
      name: "THIRD_FIELD",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ]
    },
  ],
  effectsConfig: [
    {
      when: {
        field: 'FIRST_FIELD',
        operator: '===',
        value: ''
      },
      actions: [
        {
          type: 'setFieldProps',
          targets: ['SECOND_FIELD'],
          value: {
            disabled: true,
          },
        },
        {
          type: 'setValue',
          targets: ['SECOND_FIELD'],
          value: '',
        }
      ]
    },
    {
      when: {
        field: 'FIRST_FIELD',
        operator: '!==',
        value: ''
      },
      actions: [
        {
          type: 'setFieldProps',
          targets: ['SECOND_FIELD'],
          value: {
            disabled: false,
          }
        }
      ]
    },
    {
      when: {
        field: 'SECOND_FIELD',
        operator: '===',
        value: ''
      },
      actions: [
        {
          type: 'setFieldProps',
          targets: ['THIRD_FIELD'],
          value: {
            disabled: true,
          },
        },
        {
          type: 'setValue',
          targets: ['THIRD_FIELD'],
          value: '',
        }
      ]
    },
    {
      when: {
        field: 'SECOND_FIELD',
        operator: '!==',
        value: ''
      },
      actions: [
        {
          type: 'setFieldProps',
          targets: ['THIRD_FIELD'],
          value: {
            disabled: false,
          }
        }
      ]
    }
  ]
}