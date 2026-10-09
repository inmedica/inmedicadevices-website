import type { SpecTable } from '@/data/types';

export function SpecTables({ tables }: { tables: SpecTable[] }) {
  return (
    <>
      {tables.map((t, ti) => {
        const cols = t.head?.length ?? 2;
        return (
          <div key={ti} className="spec-block">
            {t.title && <div className="spec-title">{t.title}</div>}
            <div className="spec-scroll">
              <table className={'spec-table' + (cols > 2 && !t.wrap ? ' multi' : '') + (t.wrap ? ' wrap' : '')}>
                {t.head && (
                  <thead>
                    <tr>{t.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
                  </thead>
                )}
                <tbody>
                  {t.rows.map((r, ri) => r.length === 1 ? (
                    <tr key={ri} className="spec-group"><th colSpan={cols} scope="colgroup">{r[0]}</th></tr>
                  ) : (
                    <tr key={ri}>
                      <th scope="row">{r[0]}</th>
                      {r.length === 2 && cols > 2
                        ? <td colSpan={cols - 1}>{r[1]}</td>
                        : r.slice(1).map((c, ci) => <td key={ci}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      {!tables.every(t => t.wrap) && <div className="spec-note">Specifications are for reference only and may change without notice.</div>}
    </>
  );
}
