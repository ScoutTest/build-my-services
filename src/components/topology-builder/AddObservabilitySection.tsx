import { useState } from 'react';
import { Eye, Plus, ArrowRight, Activity } from 'lucide-react';
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
import { ObservabilitySource, Relationship } from '@/types/topology';

interface AddObservabilitySectionProps {
  serviceId: string | null;
  onObservabilityAdd: (source: ObservabilitySource, relationship: Relationship) => void;
  observability: ObservabilitySource[];
}

type ObservabilityType = ObservabilitySource['type'];

const observabilityTypes: Record<ObservabilityType, string> = {
  prometheus: 'Prometheus',
  datadog: 'Datadog',
  newrelic: 'New Relic',
  grafana: 'Grafana',
  pagerduty: 'PagerDuty',
  opsgenie: 'Opsgenie',
};

export function AddObservabilitySection({
  serviceId,
  onObservabilityAdd,
  observability,
}: AddObservabilitySectionProps) {
  const [sourceType, setSourceType] = useState<ObservabilityType>('prometheus');
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!serviceId || !name.trim()) return;

    const source: ObservabilitySource = {
      id: `obs-${Date.now()}`,
      name: name.trim(),
      type: sourceType,
    };

    const relationship: Relationship = {
      id: `rel-${Date.now()}`,
      sourceId: source.id,
      targetId: serviceId,
      type: 'OBSERVED_BY',
      assertionType: 'asserted',
      assertedBy: 'manual',
      confidence: 1.0,
      createdAt: new Date(),
    };

    onObservabilityAdd(source, relationship);
    setName('');
  };

  const isDisabled = !serviceId;

  return (
    <div className={`builder-section ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="builder-section-title">
        <Eye className="w-4 h-4 text-relationship-observed" />
        Add Observability
      </div>

      {isDisabled ? (
        <p className="text-sm text-muted-foreground italic">
          Create a service first to add observability sources.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Connect monitoring and alerting tools that observe this service.
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            <span className="font-mono">Observer</span>
            <ArrowRight className="w-3 h-3" />
            <Badge variant="outline" className="text-xs border-relationship-observed text-relationship-observed">
              OBSERVED_BY
            </Badge>
            <ArrowRight className="w-3 h-3" />
            <span className="font-mono">Service</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Source Type</Label>
              <Select value={sourceType} onValueChange={(v) => setSourceType(v as ObservabilityType)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(observabilityTypes).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Source Name</Label>
              <Input
                placeholder="e.g., prod-prometheus"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-mono bg-input border-border"
              />
            </div>

            <Button onClick={handleAdd} disabled={!name.trim()} variant="secondary" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Observability Source
            </Button>
          </div>

          {observability.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs text-muted-foreground">Added Sources</Label>
              <div className="space-y-1">
                {observability.map((obs) => (
                  <div
                    key={obs.id}
                    className="flex items-center gap-2 text-sm bg-muted/50 rounded px-2 py-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-relationship-observed" />
                    <span className="font-mono text-xs">{obs.name}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {observabilityTypes[obs.type]}
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
