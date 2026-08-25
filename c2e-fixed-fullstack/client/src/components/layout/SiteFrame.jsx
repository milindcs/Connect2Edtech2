import WhatsAppChat from '../common/WhatsAppChat.jsx'

// Outer page wrapper. Per the homepage redesign brief, the black device-frame
// border that used to run around the entire page has been removed — the site
// now extends edge-to-edge with no outer border/frame. Kept as a thin
// pass-through component so the rest of the app doesn't need to change.
function SiteFrame({ children }) {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      {children}
      <WhatsAppChat />
    </div>
  )
}

export default SiteFrame

