import { FlowBuilderProps } from "../../flow-builder";

export const config: FlowBuilderProps = {
  defaultValues: {},
  steps: [
    {
      template: undefined,
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
              targets: ['EMAIL'],
              value: 'effects@example.com',
            },
          ]
        }
      ]
    },
    {
      type: "promo",
      template: undefined,
      fields: []
    },
    {
      template: undefined,
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