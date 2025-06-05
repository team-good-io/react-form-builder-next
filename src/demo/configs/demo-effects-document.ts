import { FormConfig } from "../../form-builder/types";

export const config: FormConfig = {
  template: {name: "signup"},
  fields: [
    {
      name: "ID_DOCUMENT_TYPE",
      type: "radio",
      registerProps: {
        required: true
      },
      options: [
        { label: "DNI", value: "DNI" },
        { label: "CE", value: "CE" }
      ]
    },
    {
      name: "ID_DOCUMENT_NUMBER",
      type: "text",
      fieldProps: {
        inputMode: "numeric",
      },
      registerProps: {
        required: true
      }
    },
    {
      name: "CITIZENSHIP",
      type: "select",
      registerProps: {
        required: true
      },
      options: [
        { label: "Peru", value: "PE" },
        { label: "Colombia", value: "CO" }
      ]
    },
    {
      name: 'CE_EXPIRY',
      type: 'text',
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
            minLength: 8
          }
        },
        {
          type: 'setValue',
          target: 'CITIZENSHIP',
          value: 'PE',
          runOnInit: true
        },
        {
          type: 'setFieldProps',
          target: 'CITIZENSHIP',
          value: {
            disabled: true
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
            minLength: 10
          }
        },
        {
          type: 'setFieldProps',
          target: 'CITIZENSHIP',
          value: {
            disabled: false
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
          type: 'showField',
          target: 'CE_EXPIRY'
        }
      ]
    },
    {
      when: {
        field: 'ID_DOCUMENT_TYPE',
        operator: '!==',
        value: 'CE'
      },
      actions: [
        {
          type: 'hideField',
          target: 'CE_EXPIRY'
        }
      ]
    }
  ]
}