const commandSections = [
  {
    title: "Development",
    commands: [
      { description: "# Install dependencies", command: "npm run install:all" },
      { description: "# Start development servers", command: "npm run dev" }
    ],
    testId: "commands-development"
  },
  {
    title: "Production",
    commands: [
      { description: "# Build for production", command: "npm run build" },
      { description: "# Start production server", command: "npm start" }
    ],
    testId: "commands-production"
  }
];

export default function DevelopmentCommands() {
  return (
    <div className="bg-surface-dark rounded-xl p-6 border border-border-dark">
      <h2 className="text-xl font-semibold mb-4" data-testid="dev-commands-title">
        Quick Start Commands
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commandSections.map((section) => (
          <div key={section.title} className="space-y-3" data-testid={section.testId}>
            <h3 className="font-medium text-accent">{section.title}</h3>
            <div className="bg-background rounded-lg p-4 font-mono text-sm">
              {section.commands.map((cmd, index) => (
                <div key={index}>
                  <div className="text-subtle mb-2">{cmd.description}</div>
                  <div className="text-text-primary">{cmd.command}</div>
                  {index < section.commands.length - 1 && <div className="mt-3"></div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
