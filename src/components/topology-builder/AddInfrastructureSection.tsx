import { useState } from 'react';
import { Database, Cloud, Server, HardDrive, Plus, ArrowRight } from 'lucide-react';
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
import { Infrastructure, InfrastructureType, Relationship, RelationshipType } from '@/types/topology';

interface AddInfrastructureSectionProps {
  serviceId: string | null;
  onInfrastructureAdd: (infra: Infrastructure, relationship: Relationship) => void;
  infrastructure: Infrastructure[];
}

const infraTypeConfig: Record<InfrastructureType, { label: string; icon: typeof Database }> = {
  cluster: { label: 'Cluster', icon: Server },
  region: { label: 'Region', icon: Cloud },
  'cloud-account': { label: 'Cloud Account', icon: Cloud },
  datastore: { label: 'Datastore', icon: Database },
  queue: { label: 'Message Queue', icon: HardDrive },
  cache: { label: 'Cache', icon: HardDrive },
};

export function AddInfrastructureSection({
  serviceId,
  onInfrastructureAdd,
  infrastructure,
}: AddInfrastructureSectionProps) {
  const [infraType, setInfraType] = useState<InfrastructureType>('cluster');
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [relationshipType, setRelationshipType] = useState<'RUNS_ON' | 'USES'>('RUNS_ON');

  const handleAdd = () => {
    if (!serviceId || !name.trim()) return;

    const infra: Infrastructure = {
      id: `infra-${Date.now()}`,
      type: infraType,
      name: name.trim(),
      provider: provider.trim() || undefined,
    };

    const relationship: Relationship = {
      id: `rel-${Date.now()}`,
      sourceId: serviceId,
      targetId: infra.id,
      type: relationshipType,
      assertionType: 'asserted',
      assertedBy: 'manual',
      confidence: 1.0,
      createdAt: new Date(),
    };

    onInfrastructureAdd(infra, relationship);
    setName('');
    setProvider('');
  };

  const isDisabled = !serviceId;

  const getRelationshipColor = (type: RelationshipType) => {
    return type === 'RUNS_ON' ? 'text-relationship-runs border-relationship-runs' : 'text-relationship-uses border-relationship-uses';
  };

  return (
    <div className={`builder-section ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="builder-section-title">
        <Database className="w-4 h-4 text-relationship-uses" />
        Add Infrastructure
      </div>

      {isDisabled ? (
        <p className="text-sm text-muted-foreground italic">
          Create a service first to add infrastructure.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Connect infrastructure resources that this service runs on or uses.
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            <span className="font-mono">Service</span>
            <ArrowRight className="w-3 h-3" />
            <Badge variant="outline" className={`text-xs ${getRelationshipColor(relationshipType)}`}>
              {relationshipType}
            </Badge>
            <ArrowRight className="w-3 h-3" />
            <span className="font-mono">Infrastructure</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Resource Type</Label>
              <Select value={infraType} onValueChange={(v) => setInfraType(v as InfrastructureType)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(infraTypeConfig).map(([value, { label }]) => (
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
                placeholder="e.g., prod-cluster-east"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-mono bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Provider (optional)</Label>
              <Input
                placeholder="e.g., AWS, GCP, Azure"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="font-mono bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Relationship</Label>
              <Select value={relationshipType} onValueChange={(v) => setRelationshipType(v as 'RUNS_ON' | 'USES')}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="RUNS_ON">RUNS_ON (execution environment)</SelectItem>
                  <SelectItem value="USES">USES (consumes resource)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAdd} disabled={!name.trim()} variant="secondary" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Infrastructure
            </Button>
          </div>

          {infrastructure.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs text-muted-foreground">Added Infrastructure</Label>
              <div className="space-y-1">
                {infrastructure.map((infra) => {
                  const Icon = infraTypeConfig[infra.type].icon;
                  return (
                    <div
                      key={infra.id}
                      className="flex items-center gap-2 text-sm bg-muted/50 rounded px-2 py-1.5"
                    >
                      <Icon className="w-3.5 h-3.5 text-relationship-uses" />
                      <span className="font-mono text-xs">{infra.name}</span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {infraTypeConfig[infra.type].label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
