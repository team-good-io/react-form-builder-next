import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Form } from './solution/Form.tsx'

import { config } from './configs/demo-effects-document.ts'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Form {...config} onValid={(values) => console.log(values)} />
  </StrictMode>,
)
