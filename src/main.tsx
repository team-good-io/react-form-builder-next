import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Form } from './solution/Form.tsx'

// import { config } from './configs/demo-validation.ts'
import { config } from './configs/demo-validation.ts'
import { config as multiConfig } from './configs/demo-multiform.ts'

import './index.css'
import { MultiForm } from './solution/MultiForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Form {...config} onValid={(values) => console.log(values)} />
    <hr />
    <h1>Multi-form</h1>
    <MultiForm {...multiConfig} onValid={(values) => console.log(values)} />
  </StrictMode>,
)
