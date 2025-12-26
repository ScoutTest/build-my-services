import { useState } from 'react';
import { GitBranch, Plus, ArrowRight, AlertCircle } from 'lucide-react';
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
import { Dependency, DependencyCriticality, Relationship } from '@/types/topology';

interface AddDependenciesSectionProps {
  serviceId: string | null;
  onDependencyAdd: (dependency: Dependency, relationship: Relationship) => void;
  dependencies: Dependency[];
}

export function AddDependenciesSection({
  serviceId,
  onDependencyAdd,
  dependencies,
}: AddDependenciesSectionProps) {
  const [serviceName, setServiceName] = useState('');
  const [criticality, setCriticality] = useState<DependencyCriticality>('blocking');

  const handleAdd = () => {
    if (!serviceId || !serviceName.trim()) return;

    const dependency: Dependency = {
      id: `dep-${Date.now()}`,
      serviceId: `svc-dep-${Date.now()}`,
      serviceName: serviceName.trim(),
      criticality,
    };

    const relationship: Relationship = {
      id: `rel-${Date.now()}`,
      sourceId: serviceId,
      targetId: dependency.serviceId,
      type: 'DEPENDS_ON',
      assertionType: 'asserted',
      assertedBy: 'manual',
      confidence: 1.0,
      createdAt: new Date(),
      metadata: { criticality },
    };

    onDependencyAdd(dependency, relationship);
    setServiceName('');
  };

  const isDisabled = !serviceId;

  return (
    <div className={`builder-section ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="builder-section-title">
        <GitBranch className="w-4 h-4 text-relationship-depends" />
        Add Dependencies
      </div>

      {isDisabled ? (
        <p className="text-sm text-muted-foreground italic">
          Create a service first to add dependencies.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Define other services that this service depends on.
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            <span className="font-mono">Service</span>
            <ArrowRight className="w-3 h-3" />
            <Badge variant="outline" className="text-xs border-relationship-depends text-relationship-depends">
              DEPENDS_ON
            </Badge>
            <ArrowRight className="w-3 h-3" />
            <span className="font-mono">Dependency</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Dependent Service Name</Label>
              <Input
                placeholder="e.g., auth-service"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="font-mono bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Dependency Criticality</Label>
              <Select value={criticality} onValueChange={(v) => setCriticality(v as DependencyCriticality)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="blocking">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                      <span>Blocking (service fails without it)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="optional">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Optional (graceful degradation)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAdd} disabled={!serviceName.trim()} variant="secondary" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Dependency
            </Button>
          </div>

          {dependencies.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs text-muted-foreground">Added Dependencies</Label>
              <div className="space-y-1">
                {dependencies.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center gap-2 text-sm bg-muted/50 rounded px-2 py-1.5"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-relationship-depends" />
                    <span className="font-mono text-xs">{dep.serviceName}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ml-auto ${
                        dep.criticality === 'blocking'
                          ? 'border-destructive text-destructive'
                          : 'border-muted-foreground text-muted-foreground'
                      }`}
                    >
                      {dep.criticality}
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
