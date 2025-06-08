
import { OptionsSourceType } from "../../form-builder/modules/Options/types";
import { FormConfig } from "../../form-builder/types";

export const config: FormConfig = {
  template: undefined,
  fields: [
    {
      name: "USERNAME",
      type: "text",
      registerProps: {
        required: true
      }
    },
    {
      name: "COUNTRY",
      type: "select",
      registerProps: {
        required: true
      }
    },
    {
      name: "COUNTY",
      type: "select",
      registerProps: {
        required: true
      }
    },
    {
      name: "CITY",
      type: "select",
      registerProps: {
        required: true
      }
    },
    {
      name: "GENDER",
      type: "radio",
      registerProps: {
        required: true
      },
      options: [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" }
      ]
    }
  ],
  optionsConfig: {
    COUNTRY: {
      type: OptionsSourceType.REMOTE,
      path: '/api/countries.json'
    },
    COUNTY: {
      type: OptionsSourceType.REMOTE_DYNAMIC,
      dependencies: ['COUNTRY'],
      path: '/api/counties.json?country={COUNTRY}',
    },
    CITY: {
      type: OptionsSourceType.REMOTE_DYNAMIC,
      dependencies: ['COUNTRY', 'COUNTY'],
      path: '/api/cities.json?country={COUNTRY}&county={COUNTY}',
    }
  },
}