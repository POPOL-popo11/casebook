import type { Material } from '../contracts/types'
import './MaterialBody.css'

type Block = { kind: 'line'; text: string } | { kind: 'table'; rows: string[][] }

// The body's format (types.ts Material.body): '\n' is a line break. Lines with '|' are the rows of
// a small table, the first row its header; '---' separator rows are skipped; a blank line or a
// line without '|' ends the table.
function toBlocks(body: string): Block[] {
  const blocks: Block[] = []
  let table: string[][] | null = null
  for (const line of body.split('\n')) {
    const text = line.trim()
    if (!text.includes('|')) {
      table = null
      if (text) blocks.push({ kind: 'line', text })
      continue
    }
    const cells = text
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim())
    if (cells.every((cell) => /^:?-+:?$/.test(cell))) continue
    if (table) table.push(cells)
    else {
      table = [cells]
      blocks.push({ kind: 'table', rows: table })
    }
  }
  return blocks
}

function Table({ rows }: { rows: string[][] }) {
  const [head, ...body] = rows
  return (
    <div className="material-body__scroll">
      <table className="material-body__table">
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th key={i} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// A case material's text, then who made it, when, and what it covers.
export function MaterialBody({ material }: { material: Material }) {
  const rows: [string, string | undefined][] = [
    ['Source', material.source],
    ['Date', material.date],
    ['Scope', material.scope],
  ]
  const meta = rows.filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <div className="material-body">
      {material.body ? (
        <div className="material-body__text">
          {toBlocks(material.body).map((block, i) =>
            block.kind === 'line' ? <p key={i}>{block.text}</p> : <Table key={i} rows={block.rows} />,
          )}
        </div>
      ) : (
        <p className="material-body__empty">The full text of this material isn’t written yet.</p>
      )}
      {meta.length > 0 && (
        <dl className="material-body__meta">
          {meta.map(([label, value]) => (
            <div key={label} className="material-body__row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
