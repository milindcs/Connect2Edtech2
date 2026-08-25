// Plain, page-level wrapper. Provides the page's white background so every
// section below the hero sits on a normal white page with no video behind it.
function MainLayout({ children }) {
  return (
    <div className="relative w-full flex flex-col font-sans bg-white">
      {children}
    </div>
  )
}

export default MainLayout

