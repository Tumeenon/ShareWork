import FileTree from "@/components/dashboard/file-tree";

export default function Sidebar() {
  return (
    <aside className="w-80 bg-surface-dark border-r border-border-dark overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-subtle uppercase tracking-wide mb-4">
          Project Structure
        </h2>
        <FileTree />
      </div>

      <div className="p-4 border-t border-border-dark">
        <h3 className="text-sm font-semibold text-subtle mb-3">Project Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Database Models</span>
            <span className="text-sm font-mono text-accent" data-testid="stat-total-files">11</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">API Endpoints</span>
            <span className="text-sm font-mono text-accent" data-testid="stat-dependencies">25</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Modules</span>
            <span className="text-sm font-mono text-accent" data-testid="stat-dev-dependencies">6</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
