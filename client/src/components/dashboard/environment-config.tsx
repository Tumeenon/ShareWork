import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const envConfig = `# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/sharework_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# API Configuration
PORT=3001
NODE_ENV=development
API_BASE_URL=http://localhost:3001

# Frontend Configuration
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=ShareWork

# Prisma Configuration
PRISMA_GENERATE_DATAPROXY=false`;

export default function EnvironmentConfig() {
  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(envConfig);
  };

  return (
    <div className="bg-surface-dark rounded-xl p-6 border border-border-dark">
      <h2 className="text-xl font-semibold mb-4" data-testid="env-config-title">
        Environment Configuration
      </h2>
      <div className="bg-background rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-sm text-accent">.env.example</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyTemplate}
            className="text-xs text-subtle hover:text-text-primary flex items-center space-x-1 h-auto p-1"
            data-testid="button-copy-template"
          >
            <Copy className="w-3 h-3" />
            <span>Copy template</span>
          </Button>
        </div>
        <pre className="font-mono text-sm text-subtle overflow-x-auto" data-testid="env-config-content">
          <code>{envConfig}</code>
        </pre>
      </div>
    </div>
  );
}
