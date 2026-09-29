import type { SkillFramework } from '../contracts/types'

// Skill Frameworks (Case Expert): observable behaviours for each skill, never scores.
// One framework tonight, for Solutions. Every behaviour is a DRAFT: to be confirmed, drawn from the
// Solutions row of requirements §3 (materials: client interview, engineering schedule, operations
// support capacity, forecast basis; submission: launch scope, preconditions, risk owners, review
// plan; assessed on clarifying the real goal and identifying cross-team dependencies) and from the
// source's Solutions progression: from understanding needs and completing configuration, to
// clarifying the real goal, identifying dependencies and negotiating a plan that can be delivered.
export const SKILL_FRAMEWORKS: SkillFramework[] = [
  {
    id: 'solutions-junior-to-senior',
    teamId: 'solutions',
    title: 'Solutions & Implementation: junior to senior',
    levels: ['Getting started', 'Independent', 'Ready for senior'],
    skills: [
      {
        skillId: 'framing',
        behaviours: [
          "Restates the client's request, deadline and constraints accurately.",
          'Separates what the client must have from what can move, and confirms which is which with the client.',
          "Frames the launch around the client's real goal, and agrees the scope with the client before work is committed.",
        ],
      },
      {
        skillId: 'evidence',
        behaviours: [
          'Notes where each figure in a plan comes from.',
          'Treats a forecast with no stated method or source as an assumption, and says so.',
          'Shows the evidence behind every commitment in the plan, so others can check it.',
        ],
      },
      {
        skillId: 'investigation',
        behaviours: [
          'Reads the materials provided and asks for the ones that are missing.',
          'Chooses what to ask first by what could change the launch scope, within the time available.',
          'Finds the work nobody has estimated yet, such as the support load after launch.',
        ],
      },
      {
        skillId: 'decision',
        behaviours: [
          'Picks an option and names one gain and one cost.',
          'Turns engineering limits into launch conditions instead of ignoring them.',
          'Recommends a scope with preconditions, stop conditions and a review date, and states the risk that remains.',
        ],
      },
      {
        skillId: 'collaboration',
        behaviours: [
          'Keeps the teams named in the plan informed.',
          'Confirms dependencies with Engineering and Operations before committing a date.',
          'Agrees a plan every team can deliver and support, with an owner for each risk.',
        ],
      },
      {
        skillId: 'escalation',
        behaviours: [
          'Raises a blocker as soon as they see it.',
          'Says what they may decide alone and what needs approval.',
          "Escalates a commitment the team can't support before it is made, with the options and their costs.",
        ],
      },
    ],
  },
]
