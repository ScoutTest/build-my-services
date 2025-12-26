import { useState } from 'react';
import { Box, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Runtime, ResourceType, Relationship } from '@/types/topology';

interface AddRuntimeSectionProps {
  serviceId: string | null;
  onRuntimeAdd: (runtime: Runtime, relationship: Relationship) => void;
  runtimes: Runtime[];
}

const resourceTypeLabels: Record<ResourceType, string> = {
  'kubernetes-deployment': 'Kubernetes Deployment',
  'kubernetes-job': 'Kubernetes Job',
  'lambda-function': 'Lambda Function',
  'ecs-service': 'ECS Service',
};

export function AddRuntimeSection({ serviceId, onRuntimeAdd, runtimes }: AddRuntimeSectionProps) {
  const [resourceType, setResourceType] = useState<ResourceType>('kubernetes-deployment');
  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');

  const handleAdd = () => {
    if (!serviceId || !name.trim()) return;

    const runtime: Runtime = {
      id: `rt-${Date.now()}`,
      type: resourceType,
      name: name.trim(),
      namespace: namespace.trim() || undefined,
    };

    const relationship: Relationship = {
      id: `rel-${Date.now()}`,
      sourceId: serviceId,
      targetId: runtime.id,
      type: 'DEPLOYED_AS',
      assertionType: 'asserted',
      assertedBy: 'manual',
      confidence: 1.0,
      createdAt: new Date(),
    };

    onRuntimeAdd(runtime, relationship);
    setName('');
    setNamespace('');
  };

  const isDisabled = !serviceId;

  return (
    <div className={`builder-section ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="builder-section-title">
        <Box className="w-4 h-4 text-relationship-deployed" />
        Add Runtime
      </div>

      {isDisabled ? (
        <p className="text-sm text-muted-foreground italic">
          Create a service first to add runtime resources.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Attach a runtime resource that this service is deployed as.
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            <span className="font-mono">Service</span>
            <ArrowRight className="w-3 h-3" />
            <Badge variant="outline" className="border-relationship-deployed text-relationship-deployed text-xs">
              DEPLOYED_AS
            </Badge>
            <ArrowRight className="w-3 h-3" />
            <span className="font-mono">Runtime</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Resource Type</Label>
              <Select value={resourceType} onValueChange={(v) => setResourceType(v as ResourceType)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(resourceTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Resource Name</Label>
              <Input
                placeholder="e.g., payment-deployment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-mono bg-input border-border"
              />
            </div>

            {(resourceType === 'kubernetes-deployment' || resourceType === 'kubernetes-job') && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Namespace (optional)</Label>
                <Input
                  placeholder="e.g., payments"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className="font-mono bg-input border-border"
                />
              </div>
            )}

            <Button onClick={handleAdd} disabled={!name.trim()} variant="secondary" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Runtime
            </Button>
          </div>

          {runtimes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs text-muted-foreground">Added Runtimes</Label>
              <div className="space-y-1">
                {runtimes.map((rt) => (
                  <div
                    key={rt.id}
                    className="flex items-center gap-2 text-sm bg-muted/50 rounded px-2 py-1.5"
                  >
                    <Box className="w-3.5 h-3.5 text-relationship-deployed" />
                    <span className="font-mono text-xs">{rt.name}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {resourceTypeLabels[rt.type]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
