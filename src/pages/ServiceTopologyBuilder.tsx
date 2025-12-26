import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Network, ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ServiceDefinitionForm } from '@/components/topology-builder/ServiceDefinitionForm';
import { AddRuntimeSection } from '@/components/topology-builder/AddRuntimeSection';
import { AddInfrastructureSection } from '@/components/topology-builder/AddInfrastructureSection';
import { AddDependenciesSection } from '@/components/topology-builder/AddDependenciesSection';
import { AddObservabilitySection } from '@/components/topology-builder/AddObservabilitySection';
import { TopologyPreview } from '@/components/topology-builder/TopologyPreview';
import { RelationshipInspector } from '@/components/topology-builder/RelationshipInspector';
import {
  Service,
  Runtime,
  Infrastructure,
  Dependency,
  ObservabilitySource,
  Relationship,
} from '@/types/topology';

export default function ServiceTopologyBuilder() {
  const { toast } = useToast();
  
  // Core state
  const [service, setService] = useState<Service | null>(null);
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [observability, setObservability] = useState<ObservabilitySource[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  // Modal state
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [pendingRelationship, setPendingRelationship] = useState<{
    relationship: Partial<Relationship>;
    sourceName: string;
    targetName: string;
    onConfirm: () => void;
  } | null>(null);

  const handleServiceCreate = useCallback((newService: Service) => {
    setService(newService);
    toast({
      title: 'Service Created',
      description: `${newService.name} has been created successfully.`,
    });
  }, [toast]);

  const handleRuntimeAdd = useCallback((runtime: Runtime, relationship: Relationship) => {
    setPendingRelationship({
      relationship,
      sourceName: service?.name || 'Service',
      targetName: runtime.name,
      onConfirm: () => {
        setRuntimes((prev) => [...prev, runtime]);
        setRelationships((prev) => [...prev, relationship]);
        setInspectorOpen(false);
        toast({
          title: 'Runtime Added',
          description: `${runtime.name} linked via DEPLOYED_AS.`,
        });
      },
    });
    setInspectorOpen(true);
  }, [service, toast]);

  const handleInfrastructureAdd = useCallback((infra: Infrastructure, relationship: Relationship) => {
    setPendingRelationship({
      relationship,
      sourceName: service?.name || 'Service',
      targetName: infra.name,
      onConfirm: () => {
        setInfrastructure((prev) => [...prev, infra]);
        setRelationships((prev) => [...prev, relationship]);
        setInspectorOpen(false);
        toast({
          title: 'Infrastructure Added',
          description: `${infra.name} linked via ${relationship.type}.`,
        });
      },
    });
    setInspectorOpen(true);
  }, [service, toast]);

  const handleDependencyAdd = useCallback((dependency: Dependency, relationship: Relationship) => {
    setPendingRelationship({
      relationship,
      sourceName: service?.name || 'Service',
      targetName: dependency.serviceName,
      onConfirm: () => {
        setDependencies((prev) => [...prev, dependency]);
        setRelationships((prev) => [...prev, relationship]);
        setInspectorOpen(false);
        toast({
          title: 'Dependency Added',
          description: `${dependency.serviceName} marked as ${dependency.criticality} dependency.`,
        });
      },
    });
    setInspectorOpen(true);
  }, [service, toast]);

  const handleObservabilityAdd = useCallback((source: ObservabilitySource, relationship: Relationship) => {
    setPendingRelationship({
      relationship,
      sourceName: source.name,
      targetName: service?.name || 'Service',
      onConfirm: () => {
        setObservability((prev) => [...prev, source]);
        setRelationships((prev) => [...prev, relationship]);
        setInspectorOpen(false);
        toast({
          title: 'Observability Added',
          description: `${source.name} now observes this service.`,
        });
      },
    });
    setInspectorOpen(true);
  }, [service, toast]);

  const handleReset = () => {
    setService(null);
    setRuntimes([]);
    setInfrastructure([]);
    setDependencies([]);
    setObservability([]);
    setRelationships([]);
    toast({
      title: 'Topology Reset',
      description: 'All entities and relationships have been cleared.',
    });
  };

  const handleSave = () => {
    if (!service) {
      toast({
        title: 'Cannot Save',
        description: 'Please create a service first.',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would persist to a backend
    const topology = {
      service,
      runtimes,
      infrastructure,
      dependencies,
      observability,
      relationships,
      savedAt: new Date().toISOString(),
    };

    console.log('Saving topology:', topology);
    
    toast({
      title: 'Topology Saved',
      description: `${service.name} topology with ${relationships.length} relationships saved.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              <h1 className="font-semibold">Service Topology Builder</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Topology
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Panel - Builder */}
        <div className="w-[420px] border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Build Your Topology</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Define your service and construct relationships step by step.
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <ServiceDefinitionForm
                onServiceCreate={handleServiceCreate}
                existingService={service}
              />
              <AddRuntimeSection
                serviceId={service?.id || null}
                onRuntimeAdd={handleRuntimeAdd}
                runtimes={runtimes}
              />
              <AddInfrastructureSection
                serviceId={service?.id || null}
                onInfrastructureAdd={handleInfrastructureAdd}
                infrastructure={infrastructure}
              />
              <AddDependenciesSection
                serviceId={service?.id || null}
                onDependencyAdd={handleDependencyAdd}
                dependencies={dependencies}
              />
              <AddObservabilitySection
                serviceId={service?.id || null}
                onObservabilityAdd={handleObservabilityAdd}
                observability={observability}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-muted/30">
          <div className="p-4 border-b border-border bg-background">
            <h2 className="font-semibold text-foreground">Live Topology Preview</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your topology updates in real-time as you build.
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <TopologyPreview
              service={service}
              runtimes={runtimes}
              infrastructure={infrastructure}
              dependencies={dependencies}
              observability={observability}
              relationships={relationships}
            />
          </div>
        </div>
      </div>

      {/* Relationship Inspector Modal */}
      <RelationshipInspector
        open={inspectorOpen}
        onOpenChange={setInspectorOpen}
        relationship={pendingRelationship?.relationship || null}
        sourceName={pendingRelationship?.sourceName || ''}
        targetName={pendingRelationship?.targetName || ''}
        onConfirm={() => pendingRelationship?.onConfirm()}
        onCancel={() => setInspectorOpen(false)}
      />
    </div>
  );
}
