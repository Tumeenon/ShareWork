import { Server, Monitor, Share } from "lucide-react";

const modules = [
  {
    icon: Server,
    title: "Backend API",
    subtitle: "Express.js Server",
    bgColor: "bg-primary/20",
    iconColor: "text-primary",
    features: [
      { name: "Authentication", description: "JWT middleware & user auth" },
      { name: "Database Models", description: "Users, Projects, Tasks" },
      { name: "API Routes", description: "RESTful endpoints" }
    ],
    testId: "module-backend"
  },
  {
    icon: Monitor,
    title: "Frontend App",
    subtitle: "React + Vite",
    bgColor: "bg-accent/20",
    iconColor: "text-accent",
    features: [
      { name: "Components", description: "Reusable UI components" },
      { name: "Pages & Routing", description: "React Router setup" },
      { name: "State Management", description: "Context API & hooks" }
    ],
    testId: "module-frontend"
  },
  {
    icon: Share,
    title: "Shared Resources",
    subtitle: "Cross-platform code",
    bgColor: "bg-primary/20",
    iconColor: "text-primary",
    features: [
      { name: "TypeScript Types", description: "Interface definitions" },
      { name: "Constants", description: "Shared configurations" },
      { name: "Utilities", description: "Helper functions" }
    ],
    testId: "module-shared"
  }
];

export default function ArchitectureOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <div 
          key={module.title} 
          className="bg-surface-dark rounded-xl p-6 border border-border-dark"
          data-testid={module.testId}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 ${module.bgColor} rounded-lg flex items-center justify-center`}>
              <module.icon className={`${module.iconColor} w-5 h-5`} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{module.title}</h3>
              <p className="text-sm text-subtle">{module.subtitle}</p>
            </div>
          </div>
          <div className="space-y-3">
            {module.features.map((feature) => (
              <div key={feature.name} className="bg-background rounded-lg p-3">
                <div className="font-mono text-sm text-accent mb-1">{feature.name}</div>
                <div className="text-sm text-subtle">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
