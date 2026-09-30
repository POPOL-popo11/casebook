import { useEffect, useRef, useState } from 'react'
import { DemoTag } from '../../components/DemoTag'
import type { RoomMessage, RoomSession } from '../../contracts/records'
import type { RoomScript } from '../../contracts/types'
import { newId } from '../../lib/records'
import { byId, useFocusAfter } from './focusAfter'
import { askQuestion, sendMessage, type RoomUpdate } from './room'
import { aiRolesFor, askedIds, evidenceText, type LearnerKind } from './roomScript'
import './fields.css'

const KINDS: { id: LearnerKind; label: string }[] = [
  { id: 'question', label: 'Ask' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'proposal', label: 'Propose' },
]

// What each message does, as the learner ('You ask') and as an AI role ('answers').
const KIND_WORDS: Record<RoomMessage['kind'], string> = {
  question: 'ask',
  challenge: 'challenge',
  proposal: 'propose',
  share: 'share',
  answer: 'answers',
}

type RoomDiscussionProps = {
  script: RoomScript
  session: RoomSession
  roleTitle: (id: string) => string
  canTalk: boolean
  update: RoomUpdate
}

// 'Discussion' in the Decision Room: the messages so far, the suggested questions for each AI
// role, and the learner's own words to one role. Every AI message is marked Demo response and can
// be added to the shared evidence, keeping its source.
export function RoomDiscussion({ script, session, roleTitle, canTalk, update }: RoomDiscussionProps) {
  const ai = aiRolesFor(script, session.roleId)
  const [to, setTo] = useState(ai[0] ?? '')
  const [kind, setKind] = useState<LearnerKind>('question')
  // What the learner is typing; it becomes a message on Send.
  const [text, setText] = useState('')
  const asked = askedIds(session)
  const inEvidence = new Set(session.sharedEvidence.map((e) => e.messageId))
  const who = (id: string) => (id === session.roleId ? 'You' : id === 'all' ? 'everyone' : roleTitle(id))
  const list = useRef<HTMLOListElement>(null)
  const focusAfter = useFocusAfter()
  // Ask and Send add the learner's message first: focus moves to it, and the answer is announced.
  const focusNewMessage = () => {
    const at = session.messages.length
    focusAfter(() => list.current?.children[at])
  }

  // Each new AI answer, read out politely (the key makes a repeated answer count as new).
  const [heard, setHeard] = useState({ key: 0, text: '' })
  const seen = useRef(session.messages.length)
  useEffect(() => {
    const fresh = session.messages.slice(seen.current).filter((m) => m.demo)
    seen.current = session.messages.length
    if (fresh.length > 0) {
      const text = fresh.map((m) => `${roleTitle(m.from)} answered: ${m.text}`).join(' ')
      setHeard((prev) => ({ key: prev.key + 1, text }))
    }
  }, [session.messages, roleTitle])

  const addEvidence = (m: RoomMessage) => {
    focusAfter(byId(`jr-added-${m.id}`))
    update((s) => {
      if (s.sharedEvidence.some((e) => e.messageId === m.id)) return
      s.sharedEvidence.push({ id: newId('ev'), text: evidenceText(script, m), sourceRoleId: m.from, messageId: m.id, at: new Date().toISOString() })
    })
  }

  const send = () => {
    if (!text.trim() || !to) return
    focusNewMessage()
    sendMessage(update, script, to, kind, text.trim())
    setText('')
  }

  return (
    <section className="card jr-room-card jr-talk" aria-labelledby="jr-talk-title">
      <h2 id="jr-talk-title" className="title title--sm jr-room-card__title">
        Discussion
      </h2>
      {session.messages.length === 0 ? (
        <p className="jr-room-card__text">No messages yet. Ask a question below, or share something from your brief.</p>
      ) : (
        <ol ref={list} className="jr-talk__list">
          {session.messages.map((m) => (
            <li key={m.id} className="jr-msg" data-from={m.demo ? 'ai' : 'you'} tabIndex={m.demo ? undefined : -1}>
              <p className="jr-msg__meta">
                <strong>{who(m.from)}</strong> {KIND_WORDS[m.kind]} {m.kind !== 'answer' && `· to ${who(m.to)}`}
                {m.demo && <DemoTag kind="response" className="jr-msg__tag" />}
              </p>
              <p className="jr-msg__text">{m.text}</p>
              {m.demo && m.text !== script.unknownAnswer && (
                inEvidence.has(m.id) ? (
                  <p id={`jr-added-${m.id}`} className="jr-msg__added" tabIndex={-1}>
                    In shared evidence
                  </p>
                ) : (
                  session.status === 'in-progress' && (
                    <button type="button" className="btn btn--link jr-msg__add" onClick={() => addEvidence(m)}>
                      Add to shared evidence
                    </button>
                  )
                )
              )}
            </li>
          ))}
        </ol>
      )}
      {canTalk ? (
        <>
          {ai.map((roleId) => {
            const open = script.questions.filter((q) => q.toRoleId === roleId && !asked.has(q.id))
            return (
              open.length > 0 && (
                <div key={roleId} className="field jr-talk__suggest">
                  <span className="field__label">Ask the {roleTitle(roleId)}</span>
                  <ul className="jr-chips">
                    {open.map((q) => (
                      <li key={q.id}>
                        <button
                          type="button"
                          className="chip chip--outline jr-talk__question"
                          onClick={() => {
                            focusNewMessage()
                            askQuestion(update, script, q)
                          }}
                        >
                          {q.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )
          })}
          <div className="jr-talk__compose">
            <div className="jr-talk__controls">
              <label className="visually-hidden" htmlFor="jr-talk-to">
                To
              </label>
              <select id="jr-talk-to" className="select jr-talk__to" value={to} onChange={(e) => setTo(e.target.value)}>
                {ai.map((roleId) => (
                  <option key={roleId} value={roleId}>
                    To the {roleTitle(roleId)}
                  </option>
                ))}
              </select>
              <div className="segmented jr-talk__kinds" role="group" aria-label="Kind of message">
                {KINDS.map(({ id, label }) => (
                  <button key={id} type="button" className="segmented__item" aria-pressed={kind === id} onClick={() => setKind(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <label className="visually-hidden" htmlFor="jr-talk-text">
              Your message
            </label>
            <textarea
              id="jr-talk-text"
              className="textarea jr-grow jr-talk__text"
              rows={2}
              placeholder="Write in your own words"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="button" className="btn btn--primary btn--sm jr-talk__send" disabled={!text.trim()} onClick={send}>
              Send
            </button>
          </div>
        </>
      ) : (
        session.status === 'in-progress' && (
          <p className="callout jr-talk__locked">Write your initial position first. Then talk to the others.</p>
        )
      )}
      <div className="visually-hidden" aria-live="polite">
        {heard.text && <p key={heard.key}>{heard.text}</p>}
      </div>
    </section>
  )
}
