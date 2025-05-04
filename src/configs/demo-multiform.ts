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
      ]
    },
    {
      template: { name: "multiform" },
      fields: [
        {
          name: "EMAIL",
          type: "text",
        },
        {
          name: "PASSWORD",
          type: "text",
        }
      ]
    }
  ]
}