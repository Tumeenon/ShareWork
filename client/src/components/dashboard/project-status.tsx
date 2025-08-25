import { CheckCircle } from "lucide-react";

const statusItems = [
  {
    title: "Backend API",
    subtitle: "Express.js",
    description: "Server configured",
    icon: CheckCircle,
    testId: "status-backend"
  },
  {
    title: "Frontend App",
    subtitle: "React + Vite",
    description: "Build tools ready",
    icon: CheckCircle,
    testId: "status-frontend"
  },
  {
    title: "TypeScript",
    subtitle: "Shared Types",
    description: "Type safety enabled",
    icon: CheckCircle,
    testId: "status-typescript"
  },
  {
    title: "Dev Tools",
    subtitle: "ESLint & Prettier",
    description: "Code quality setup",
    icon: CheckCircle,
    testId: "status-devtools"
  }
];

export default function ProjectStatus() {
  return (
    <div className="bg-surface-dark rounded-xl p-6 border border-border-dark">
      <h2 className="text-xl font-semibold mb-4" data-testid="project-status-title">
        Project Setup Status
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusItems.map((item) => (
          <div key={item.title} className="bg-background rounded-lg p-4" data-testid={item.testId}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-subtle">{item.title}</span>
              <item.icon className="text-accent w-5 h-5" />
            </div>
            <div className="text-lg font-semibold text-text-primary">{item.subtitle}</div>
            <div className="text-sm text-subtle">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
