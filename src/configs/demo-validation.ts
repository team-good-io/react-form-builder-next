import { FormConfig } from "../solution/types";

export const config: FormConfig = {
  template: "signup",
  fields: [
    {
      name: "USERNAME",
      type: "text",
      registerProps: {
        minLength: 3,
        maxLength: 20,
        required: true
      }
    },
    {
      name: "EMAIL",
      type: "text",
      registerProps: {
        required: true,
        validate: [["email"], ["emailAvailability"]],
      }
    },
    {
      name: "PASSWORD",
      type: "password",
      fieldProps: {
        showValidationCheckList: true
      },
      registerProps: {
        required: true,
        validate: [
          ['range', { min: 8, max: 64 }],
          ['oneNumber'],
          ['oneLetter'],
          ['notContainValue', { fields: ["USERNAME", "EMAIL"] }]
        ],
      }
    },
    {
      name: "CONFIRM_PASSWORD",
      type: "password",
      registerProps: {
        required: true,
        validate: [['matchValue', { name: "PASSWORD" }]],
      }
    },
    {
      name: "ID_DOCUMENT_TYPE",
      type: "radio",
      options: [
        { label: "DNI", value: "DNI" },
        { label: "CE", value: "CE" }
      ]
    },
    {
      name: "ID_DOCUMENT_NUMBER",
      type: "text",
      registerProps: {
        required: true
      }
    }
  ],
  defaultValues: {
    ID_DOCUMENT_TYPE: "DNI"
  },
  effectsConfig: [
    {
      when: {
        field: 'ID_DOCUMENT_TYPE',
        operator: '===',
        value: 'DNI'
      },
      actions: [
        {
          type: 'setRegisterProps',
          target: 'ID_DOCUMENT_NUMBER',
          value: {
            validate: [
              ['pattern', { pattern: '^[0-9]{8}$' }]]
          }
        }
      ]
    },
    {
      when: {
        field: 'ID_DOCUMENT_TYPE',
        operator: '===',
        value: 'CE'
      },
      actions: [
        {
          type: 'setRegisterProps',
          target: 'ID_DOCUMENT_NUMBER',
          value: {
            validate: [
              [ 'pattern', { pattern: '^[a-zA-Z0-9]{9,12}$' } ],
            ]
          }
        }
      ]
    }
  ]
}