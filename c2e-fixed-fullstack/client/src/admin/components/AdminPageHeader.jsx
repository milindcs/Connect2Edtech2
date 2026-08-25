// Consistent page header for the admin section: icon chip + title/subtitle
// on the left, optional action (button/filter) on the right.
// Consistent page toolbar for the admin section: a subtle icon chip + subtitle
// on the left, optional action (button/filter) on the right. The visible page
// title lives in the sticky AdminLayout header to avoid duplication; we still
// render it here as a screen-reader-only <h1> so each page has one real heading.
function AdminPageHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <h1 className="sr-only">{title}</h1>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="hidden sm:flex w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-br from-accent/15 to-pink/10 text-accent items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          {subtitle && <p className="text-[11px] sm:text-xs text-gray-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export default AdminPageHeader;
