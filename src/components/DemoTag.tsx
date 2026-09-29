import { DEMO_DATA_LABEL, DEMO_RESPONSE_LABEL } from '../contracts/types'
import './DemoTag.css'

// The label on anything the app did not get from a person (types.ts):
//   <DemoTag kind="response" />  'Demo response': a preset answer from an AI role or the app
//   <DemoTag kind="data" />      'Demo data': a seeded record (source 'demo'), not the viewer's own
const TAGS = {
  response: { label: DEMO_RESPONSE_LABEL, title: 'A preset answer written for this demo, not live AI' },
  data: { label: DEMO_DATA_LABEL, title: 'A sample record that came with the demo' },
} as const

export function DemoTag({ kind, className }: { kind: keyof typeof TAGS; className?: string }) {
  const tag = TAGS[kind]
  return (
    <span className={`badge badge--neutral demo-tag${className ? ` ${className}` : ''}`} title={tag.title}>
      {tag.label}
    </span>
  )
}
