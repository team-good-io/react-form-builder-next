import { MultiFormProps } from "../solution/MultiForm";

export const config: MultiFormProps = {
  defaultValues: {},
  steps: [
    {
      template: { name: "multiform" },
      fields: [
        {
          name: "FIRSTNAME",
          type: "text",
        },
        {
          name: "LASTNAME",
          type: "text",
        }
      ],
      effectsConfig: [
        {
          when: {
            field: 'FIRSTNAME',
            operator: '!==',
            value: ''
          },
          actions: [
            {
              type: 'setValue',
              target: 'EMAIL',
              value: 'effects@example.com',
            }
          ]
        }
      ]
    },
    {
      template: { name: "multiform" },
      fields: [
        {
          name: "EMAIL",
          type: "text",
          registerProps: {
            validate: [['email'], ['availability', { type: 'email' }]]
          }
        },
        {
          name: "PASSWORD",
          type: "text",
        }
      ]
    }
  ]
}