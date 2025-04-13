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
        required: true,
        validate: []
      }
    },
    {
      name: "EMAIL",
      type: "text",
      registerProps: {
        required: true,
        validate: ["email"],
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
          { fn: 'range', params: { min: 8, max: 64 } },
          { fn: 'oneNumber' },
          { fn: 'oneLetter' },
          { fn: 'notContainValue', params: { fields: ["USERNAME", "EMAIL"]}}
        ],
      }
    },
    {
      name: "CONFIRM_PASSWORD",
      type: "password",
      registerProps: {
        required: true,
        validate: [{fn: 'matchValue', params: { name: "PASSWORD" }}],
      }
    }
  ]
}