import { useState } from 'react';
import { Server, Users, Globe, AlertTriangle, Plus, Check } from 'lucide-react';
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
import { Service, Environment, Criticality } from '@/types/topology';

interface ServiceDefinitionFormProps {
  onServiceCreate: (service: Service) => void;
  existingService?: Service | null;
}

export function ServiceDefinitionForm({ onServiceCreate, existingService }: ServiceDefinitionFormProps) {
  const [name, setName] = useState(existingService?.name || '');
  const [team, setTeam] = useState(existingService?.team || '');
  const [environment, setEnvironment] = useState<Environment>(existingService?.environment || 'production');
  const [criticality, setCriticality] = useState<Criticality>(existingService?.criticality || 'medium');
  const [isCreated, setIsCreated] = useState(!!existingService);

  const handleSubmit = () => {
    if (!name.trim() || !team.trim()) return;

    const service: Service = {
      id: existingService?.id || `svc-${Date.now()}`,
      name: name.trim(),
      team: team.trim(),
      environment,
      criticality,
      createdAt: existingService?.createdAt || new Date(),
    };

    onServiceCreate(service);
    setIsCreated(true);
  };

  const criticalityColors: Record<Criticality, string> = {
    critical: 'text-destructive',
    high: 'text-warning',
    medium: 'text-info',
    low: 'text-muted-foreground',
  };

  return (
    <div className="builder-section">
      <div className="builder-section-title">
        <Server className="w-4 h-4 text-primary" />
        Service Definition
      </div>

      <p className="text-sm text-muted-foreground">
        Define the core service that will be the root of your topology.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="service-name" className="text-sm font-medium">
            Service Name
          </Label>
          <Input
            id="service-name"
            placeholder="e.g., payment-service"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-mono bg-input border-border focus:border-primary focus:ring-primary"
            disabled={isCreated}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team" className="text-sm font-medium flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            Owner Team
          </Label>
          <Input
            id="team"
            placeholder="e.g., platform-team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="font-mono bg-input border-border focus:border-primary focus:ring-primary"
            disabled={isCreated}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              Environment
            </Label>
            <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)} disabled={isCreated}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Criticality
            </Label>
            <Select value={criticality} onValueChange={(v) => setCriticality(v as Criticality)} disabled={isCreated}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="critical">
                  <span className={criticalityColors.critical}>Critical</span>
                </SelectItem>
                <SelectItem value="high">
                  <span className={criticalityColors.high}>High</span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className={criticalityColors.medium}>Medium</span>
                </SelectItem>
                <SelectItem value="low">
                  <span className={criticalityColors.low}>Low</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || !team.trim()}
          className={`w-full ${isCreated ? 'bg-success hover:bg-success/90' : ''}`}
        >
          {isCreated ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Service Created
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
