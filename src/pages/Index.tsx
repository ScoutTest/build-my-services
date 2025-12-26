import { Link } from 'react-router-dom';
import { Network, ArrowRight, Server, GitBranch, Database, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            <span className="font-semibold">Topology Manager</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/topology-builder">
              <Button variant="ghost" size="sm">
                Topology Builder
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Network className="w-4 h-4" />
              Service Topology Management
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Define Your Infrastructure
              <span className="text-primary block mt-2">Topology</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Intentionally construct and manage service dependencies, runtime configurations, 
              and infrastructure relationships with our visual topology builder.
            </p>

            <Link to="/topology-builder">
              <Button size="lg" className="group">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-lg bg-relationship-deployed/20 flex items-center justify-center mx-auto mb-4">
                <Server className="w-6 h-6 text-relationship-deployed" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Services</h3>
              <p className="text-sm text-muted-foreground">
                Define core services with ownership and criticality levels
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-lg bg-relationship-depends/20 flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-6 h-6 text-relationship-depends" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Dependencies</h3>
              <p className="text-sm text-muted-foreground">
                Map service dependencies with criticality markers
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-lg bg-relationship-runs/20 flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-relationship-runs" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Infrastructure</h3>
              <p className="text-sm text-muted-foreground">
                Connect clusters, datastores, and cloud resources
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-lg bg-relationship-observed/20 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-relationship-observed" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Observability</h3>
              <p className="text-sm text-muted-foreground">
                Link monitoring and alerting tools
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          Service Topology Builder — Intentional infrastructure management
        </div>
      </footer>
    </div>
  );
};

export default Index;
