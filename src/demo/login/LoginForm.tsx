import { useEffect, useState } from "react";
import { Form } from "../../form-builder/Form";
import { LoginTemplate } from "../../ui-component-library/templates/LoginTemplate";
import { FormConfig } from "../../form-builder/types";

export function LoginForm() {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = fetch('/config/login-form.json')
        const config = await (await res).json();
        setFormConfig(config);
      } catch (error) {
        console.error('Error fetching form config:', error);
        setFormConfig(null);
      }
    }

    fetchConfig();
  }, []);

  if (!formConfig) {
    return 'Loading...';
  }

  return (
    <Form
      fields={formConfig.fields}
      template={LoginTemplate}
      onValid={(values) => console.log('Form submitted with values:', values)}
      onInvalid={() => console.error('Form validation errors')}
    />
  )
}