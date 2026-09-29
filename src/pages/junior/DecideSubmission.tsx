import type { SubmissionField } from '../../contracts/types'

type DecideSubmissionProps = {
  submission: { name: string; fields: SubmissionField[] }
  // SubmissionField id → answer.
  values: Record<string, string>
  readOnly: boolean
  onChange: (fieldId: string, value: string) => void
}

// The case's own submission on Decide, e.g. 'Launch Recommendation': a full-width card under the
// options and the reasoning, its fields two to a row.
export function DecideSubmission({ submission, values, readOnly, onChange }: DecideSubmissionProps) {
  return (
    <section className="card jr-submission" aria-labelledby="jr-submission-title">
      <h2 id="jr-submission-title" className="title title--sm jr-submission__title">
        {submission.name}
      </h2>
      <div className="jr-submission__grid">
        {submission.fields.map((field) => (
          <div key={field.id} className="field">
            <label className="field__label" htmlFor={`jr-field-${field.id}`}>
              {field.label}
            </label>
            <textarea
              id={`jr-field-${field.id}`}
              className="textarea jr-submission__input"
              rows={2}
              placeholder={field.hint}
              readOnly={readOnly}
              value={values[field.id] ?? ''}
              onChange={(e) => onChange(field.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
