/**
 * Renders the admin's plain-text legal pages: "## " starts a heading, "- " a bullet,
 * blank lines separate paragraphs. No HTML is interpreted.
 */
export function LegalText({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, '').split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        const out: React.ReactNode[] = [];
        let list: string[] = [];
        const flush = () => { if (list.length) { out.push(<ul key={out.length}>{list.map((l, j) => <li key={j}>{l}</li>)}</ul>); list = []; } };
        for (const l of lines) {
          if (l.startsWith('## ')) { flush(); out.push(<h2 key={out.length}>{l.slice(3)}</h2>); }
          else if (/^[-*] /.test(l)) list.push(l.slice(2));
          else { flush(); out.push(<p key={out.length}>{l}</p>); }
        }
        flush();
        return <div key={i}>{out}</div>;
      })}
    </>
  );
}
