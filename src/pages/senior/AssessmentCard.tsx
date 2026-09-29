import { DIMENSIONS, type CaseContent } from '../../contracts/types'

const dimensionLabel = (id: string) => DIMENSIONS.find((d) => d.id === id)?.label ?? id

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <>
      <p className="field__label bd__sub">{title}</p>
      <ul className="bd__bullets">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  )
}

// 03 · the assessment (overnight): how Case Experts and Team Leads judge the reasoning.
export function AssessmentCard({ content }: { content: CaseContent }) {
  const assessment = content.assessment
  if (!assessment) return null
  return (
    <section className="card bd__card" aria-labelledby="bd-assessment">
      <h2 id="bd-assessment" className="title title--sm bd__side-title">
        How the reasoning is assessed
      </h2>
      <p className="bd__lead">For Case Experts and Team Leads. Learners see it only after they submit.</p>
      <ul className="bd__criteria">
        {assessment.criteria.map((criterion) => (
          <li key={criterion.id} className="bd__criterion">
            <p className="bd__criterion-label">{criterion.label}</p>
            <p className="bd__criterion-meta">
              {dimensionLabel(criterion.dimensionId)} · {criterion.lookFor}
            </p>
          </li>
        ))}
      </ul>
      <List title="Common misses" items={assessment.commonMisses} />
      <List title="Other sound plans" items={assessment.acceptableAlternatives} />
      <List title="Must be escalated" items={assessment.mustEscalate} />
    </section>
  )
}

// 03 · the variant (overnight): the changed-condition challenge after submitting.
export function VariantCard({ content }: { content: CaseContent }) {
  const variant = content.variant
  if (!variant) return null
  return (
    <section className="card bd__card" aria-labelledby="bd-variant">
      <h2 id="bd-variant" className="title title--sm bd__side-title">
        Changed-condition challenge
      </h2>
      <p className="bd__criterion-label bd__variant-title">{variant.title}</p>
      <p className="bd__text">{variant.changedFact}</p>
      <p className="bd__criterion-meta">What it tests: {variant.lookFor}</p>
    </section>
  )
}
