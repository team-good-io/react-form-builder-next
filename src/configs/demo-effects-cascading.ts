import { FormConfig } from "../solution/types";

export const config: FormConfig = {
  template: {name: "signup"},
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
          target: 'SECOND_FIELD',
          value: {
            disabled: true,
          }
        },
        {
          type: 'setValue',
          target: 'SECOND_FIELD',
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
          target: 'SECOND_FIELD',
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
          target: 'THIRD_FIELD',
          value: {
            disabled: true,
          }
        },
        {
          type: 'setValue',
          target: 'THIRD_FIELD',
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
          target: 'THIRD_FIELD',
          value: {
            disabled: false,
          }
        }
      ]
    }
  ]
}