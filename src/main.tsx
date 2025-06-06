import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Form } from './form-builder/Form.tsx'

// import { config } from './demo/configs/demo-effects-document.ts'
// import { config } from './demo/configs/demo-effects-cascading.ts'
import { config } from './demo/configs/demo-options.ts'
// import { config } from './demo/configs/demo-validation.ts'
// import { config } from './demo/configs/demo-effects-security-questions.ts'
import { config as multiConfig } from './demo/configs/demo-multiform.ts'

import './index.css'

import { FlowBuilder } from './flow-builder/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Form {...config} onValid={(values) => console.log(values)} />
    <hr />
    <h1>Multi-form</h1>
    <FlowBuilder {...multiConfig} onValid={(values) => console.log(values)} />
  </StrictMode>,
)
