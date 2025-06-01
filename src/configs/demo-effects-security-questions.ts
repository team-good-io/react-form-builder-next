
import { OptionsSourceType } from "../form-builder/modules/Options/types";
import { FormConfig } from "../form-builder/types";

export const config: FormConfig = {
  template: {name: "signup"},
  fields: [
    {
      name: "SECURITY_QUESTION_1",
      type: "select",
      registerProps: {
        required: true
      },
    },
    {
      name: "SECURITY_QUESTION_1_ANSWER",
      type: "text",
      registerProps: {
        required: true
      },
    },
    {
      name: "SECURITY_QUESTION_2",
      type: "select",
      registerProps: {
        required: true
      },
    },
    {
      name: "SECURITY_QUESTION_2_ANSWER",
      type: "text",
      registerProps: {
        required: true
      },
    }
  ],
  optionsConfig: {
    SECURITY_QUESTION_1: {
      type: OptionsSourceType.STATIC,
      options: [
        { label: "What is your mother's maiden name?", value: "MOTHER_MAIDEN_NAME" },
        { label: "What was the name of your first pet?", value: "FIRST_PET_NAME" },
        { label: "What was the name of your elementary school?", value: "ELEMENTARY_SCHOOL" },
      ]
    },
    SECURITY_QUESTION_2: {
      type: OptionsSourceType.STATIC,
      options: [
        { label: "What is your mother's maiden name?", value: "MOTHER_MAIDEN_NAME" },
        { label: "What was the name of your first pet?", value: "FIRST_PET_NAME" },
        { label: "What was the name of your elementary school?", value: "ELEMENTARY_SCHOOL" },
      ]
    }
  },
  effectsConfig: [
    {
      when: {
        type: 'OR',
        conditions: [
          { field: 'SECURITY_QUESTION_1', operator: '!==', value: '' },
          { field: 'SECURITY_QUESTION_2', operator: '!==', value: '' }
        ]
      },
      actions: [
        {
          type: 'deduplicateOptions',
          targets: ['SECURITY_QUESTION_1', 'SECURITY_QUESTION_2'],
          runOnInit: true
        }
      ]
    }
  ]
}