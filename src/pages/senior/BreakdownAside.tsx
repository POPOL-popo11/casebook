import { useState } from 'react'
import type { CaseContent, SkillId } from '../../contracts/types'
import { SKILLS } from '../../lib/content'

// 03 · right column: the order materials open, the roles in the team mode, and the skills trained.
export function BreakdownAside({ content }: { content: CaseContent }) {
  const firstSeen = content.materials.filter((material) => material.visibility === 'start')
  const materialTitle = (id?: string) => content.materials.find((m) => m.id === id)?.title
  const room = content.room
  const [skills, setSkills] = useState(() => new Set(content.skillIds))

  const toggle = (skill: SkillId) =>
    setSkills((current) => {
      const next = new Set(current)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      return next
    })

  return (
    <div className="bd__aside">
      <section className="card bd__side-card" aria-labelledby="bd-first">
        <h2 id="bd-first" className="title title--sm bd__side-title">
          Learner sees first
        </h2>
        <ul className="bd__first">
          <li>Case brief</li>
          {firstSeen.map((material) => (
            <li key={material.id}>{material.title}</li>
          ))}
        </ul>
        <p className="field__label bd__sub">Then, when they ask</p>
        <ol className="bd__first bd__order">
          {content.requests.map((request) => (
            <li key={request.id}>
              {request.title}
              <span className="bd__order-meta">
                {request.hours} h{materialTitle(request.materialId) ? ` · opens ${materialTitle(request.materialId)}` : ''}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {content.roles && content.roles.length > 0 && (
        <section className="card bd__side-card" aria-labelledby="bd-roles">
          <h2 id="bd-roles" className="title title--sm bd__side-title">
            Roles in the team room
          </h2>
          <ul className="bd__first">
            {content.roles.map((role) => (
              <li key={role.id}>
                {role.title}
                <span className="bd__order-meta">
                  {room?.humanRoleId === role.id
                    ? 'Played by the learner'
                    : room?.aiRoleIds.includes(role.id)
                      ? 'AI role, answers only from its brief'
                      : 'Not in the room'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card bd__side-card bd__side-card--skills" aria-labelledby="bd-skills">
        <h2 id="bd-skills" className="title title--sm bd__side-title">
          Skills trained
        </h2>
        <div className="bd__skills" role="group" aria-labelledby="bd-skills">
          {SKILLS.map((skill) => (
            <button
              key={skill.id}
              type="button"
              className="chip chip--outline bd__skill"
              aria-pressed={skills.has(skill.id)}
              onClick={() => toggle(skill.id)}
            >
              {skill.label}
            </button>
          ))}
        </div>
      </section>
      <p className="bd__note">Your answers are a reference, not an answer key.</p>
    </div>
  )
}
