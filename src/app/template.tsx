/** Re-mounts on every navigation: fade + 12px rise into each new page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
