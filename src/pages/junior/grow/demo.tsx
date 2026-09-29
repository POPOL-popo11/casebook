import { DemoTag } from '../../../components/DemoTag'

// Every preset question, suggestion and piece of feedback on the growth screens, and every
// seeded record, carries one of these labels.
export function DemoResponse() {
  return <DemoTag kind="response" />
}

export function DemoData() {
  return <DemoTag kind="data" />
}
