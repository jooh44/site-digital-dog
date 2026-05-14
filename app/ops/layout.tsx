const OPS_LAYOUT_STYLES = `
  body > header,
  body > footer,
  [aria-label="Aviso de cookies e privacidade"] {
    display: none !important;
  }

  body {
    background: #09090b;
  }
`

export default function OpsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: OPS_LAYOUT_STYLES }} />
      {children}
    </>
  )
}
