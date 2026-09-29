import type { SkillFramework } from '../../contracts/types'
import { Page } from '../../components/Page'
import { skillLabel, SKILL_FRAMEWORKS, TEAMS } from '../../lib/content'
import './SkillFrameworks.css'

const teamLabel = (id: string) => TEAMS.find((t) => t.id === id)?.label ?? id

// One framework: a row per skill, a column per level, each cell an observable behaviour.
function FrameworkCard({ framework }: { framework: SkillFramework }) {
  const titleId = `sf-${framework.id}`
  return (
    <section className="card sf-card" aria-labelledby={titleId}>
      <p className="eyebrow sf-card__eyebrow">{teamLabel(framework.teamId)}</p>
      <h2 id={titleId} className="title title--sm sf-card__title">
        {framework.title}
      </h2>
      <div className="sf-scroll">
        <table className="sf-table">
          <thead>
            <tr>
              <th scope="col">Skill</th>
              {framework.levels.map((level) => (
                <th key={level} scope="col">
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {framework.skills.map((skill) => (
              <tr key={skill.skillId}>
                <th scope="row">{skillLabel(skill.skillId)}</th>
                {framework.levels.map((level, i) => (
                  <td key={level}>{skill.behaviours[i] ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// Skill Frameworks: each function's skill template, described as behaviours you can observe.
export function SkillFrameworks() {
  return (
    <Page title="Skill Frameworks" subtitle="What each skill looks like at each level: observable behaviours, never scores.">
      {SKILL_FRAMEWORKS.length === 0 ? (
        <section className="card sf-card">
          <h2 className="title title--sm sf-card__title">No frameworks yet</h2>
        </section>
      ) : (
        <div className="sf-list">
          {SKILL_FRAMEWORKS.map((framework) => (
            <FrameworkCard key={framework.id} framework={framework} />
          ))}
        </div>
      )}
    </Page>
  )
}
