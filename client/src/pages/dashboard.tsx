import { useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ProjectStatus from "@/components/dashboard/project-status";
import ArchitectureOverview from "@/components/dashboard/architecture-overview";
import DevelopmentCommands from "@/components/dashboard/development-commands";
import EnvironmentConfig from "@/components/dashboard/environment-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b border-border-dark mb-6">
                <TabsList className="h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="overview" 
                    className="py-2 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:text-subtle hover:text-text-primary transition-colors text-sm bg-transparent rounded-none"
                    data-testid="tab-overview"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="backend" 
                    className="py-2 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:text-subtle hover:text-text-primary transition-colors text-sm bg-transparent rounded-none ml-8"
                    data-testid="tab-backend"
                  >
                    Backend Config
                  </TabsTrigger>
                  <TabsTrigger 
                    value="frontend" 
                    className="py-2 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:text-subtle hover:text-text-primary transition-colors text-sm bg-transparent rounded-none ml-8"
                    data-testid="tab-frontend"
                  >
                    Frontend Config
                  </TabsTrigger>
                  <TabsTrigger 
                    value="devtools" 
                    className="py-2 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:text-subtle hover:text-text-primary transition-colors text-sm bg-transparent rounded-none ml-8"
                    data-testid="tab-devtools"
                  >
                    Development Tools
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                <ProjectStatus />
                <ArchitectureOverview />
                <DevelopmentCommands />
                <EnvironmentConfig />
              </TabsContent>

              <TabsContent value="backend" className="space-y-6">
                <div className="bg-surface-dark rounded-xl p-6 border border-border-dark">
                  <h2 className="text-xl font-semibold mb-4">Backend Configuration</h2>
                  <p className="text-subtle">Backend configuration settings and API endpoints will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="frontend" className="space-y-6">
                <div className="bg-surface-dark rounded-xl p-6 border border-border-dark">
                  <h2 className="text-xl font-semibold mb-4">Frontend Configuration</h2>
                  <p className="text-subtle">Frontend build settings and development tools configuration will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="devtools" className="space-y-6">
                <div className="bg-surface-dark rounded-xl p-6 border border-border-dark">
                  <h2 className="text-xl font-semibold mb-4">Development Tools</h2>
                  <p className="text-subtle">ESLint, Prettier, and other development tool configurations will be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
