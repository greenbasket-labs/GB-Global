export default function CompanyLayout({children}:{children:React.ReactNode}){
  return <>
    {children}
    <style>{`
      body:has(.company-shell) > .top{display:none !important}
      body:has(.company-shell) > footer{margin-top:0 !important}
      body:has(.company-shell) .company-sidebar{top:0;height:100vh;min-height:100vh}
      body:has(.company-shell) .company-topbar{top:0}
      body:has(.company-shell) .welcome-brand img,
      body:has(.company-shell) .company-quick-card img{display:none !important}
    `}</style>
  </>
}
