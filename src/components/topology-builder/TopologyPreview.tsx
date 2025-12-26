import { useMemo } from 'react';
import {
  Server,
  Box,
  Database,
  GitBranch,
  Eye,
  Cloud,
  HardDrive,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Service,
  Runtime,
  Infrastructure,
  Dependency,
  ObservabilitySource,
  Relationship,
  RelationshipType,
} from '@/types/topology';

interface TopologyPreviewProps {
  service: Service | null;
  runtimes: Runtime[];
  infrastructure: Infrastructure[];
  dependencies: Dependency[];
  observability: ObservabilitySource[];
  relationships: Relationship[];
}

const relationshipColors: Record<RelationshipType, string> = {
  DEPLOYED_AS: 'bg-relationship-deployed',
  DEPENDS_ON: 'bg-relationship-depends',
  USES: 'bg-relationship-uses',
  RUNS_ON: 'bg-relationship-runs',
  OBSERVED_BY: 'bg-relationship-observed',
};

const relationshipTextColors: Record<RelationshipType, string> = {
  DEPLOYED_AS: 'text-relationship-deployed',
  DEPENDS_ON: 'text-relationship-depends',
  USES: 'text-relationship-uses',
  RUNS_ON: 'text-relationship-runs',
  OBSERVED_BY: 'text-relationship-observed',
};

export function TopologyPreview({
  service,
  runtimes,
  infrastructure,
  dependencies,
  observability,
  relationships,
}: TopologyPreviewProps) {
  const isEmpty = !service && runtimes.length === 0 && infrastructure.length === 0;

  const groupedRelationships = useMemo(() => {
    const groups: Record<RelationshipType, Relationship[]> = {
      DEPLOYED_AS: [],
      DEPENDS_ON: [],
      USES: [],
      RUNS_ON: [],
      OBSERVED_BY: [],
    };
    relationships.forEach((rel) => {
      groups[rel.type].push(rel);
    });
    return groups;
  }, [relationships]);

  if (isEmpty) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Server className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Topology Yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start by creating a service on the left panel. Your topology will appear here as you build it.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Service Node (Root) */}
      {service && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center shadow-glow">
              <Server className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground font-mono">{service.name}</h3>
              <p className="text-xs text-muted-foreground">
                {service.team} • {service.environment}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`ml-auto ${
                service.criticality === 'critical'
                  ? 'border-destructive text-destructive'
                  : service.criticality === 'high'
                  ? 'border-warning text-warning'
                  : 'border-muted-foreground text-muted-foreground'
              }`}
            >
              {service.criticality}
            </Badge>
          </div>
        </div>
      )}

      {/* Relationship Groups */}
      <div className="space-y-6 pl-4 border-l-2 border-border">
        {/* Runtimes */}
        {runtimes.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${relationshipColors.DEPLOYED_AS}`} />
              <span className={`text-xs font-medium uppercase tracking-wider ${relationshipTextColors.DEPLOYED_AS}`}>
                Deployed As ({runtimes.length})
              </span>
            </div>
            <div className="space-y-2 pl-4">
              {runtimes.map((rt) => (
                <div
                  key={rt.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-relationship-deployed/50 transition-colors"
                >
                  <Box className="w-5 h-5 text-relationship-deployed" />
                  <div>
                    <p className="font-mono text-sm">{rt.name}</p>
                    <p className="text-xs text-muted-foreground">{rt.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Infrastructure */}
        {infrastructure.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${relationshipColors.RUNS_ON}`} />
              <span className={`text-xs font-medium uppercase tracking-wider ${relationshipTextColors.RUNS_ON}`}>
                Infrastructure ({infrastructure.length})
              </span>
            </div>
            <div className="space-y-2 pl-4">
              {infrastructure.map((infra) => {
                const rel = relationships.find((r) => r.targetId === infra.id);
                const Icon =
                  infra.type === 'datastore'
                    ? Database
                    : infra.type === 'cluster'
                    ? Server
                    : infra.type === 'region' || infra.type === 'cloud-account'
                    ? Cloud
                    : HardDrive;
                return (
                  <div
                    key={infra.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-relationship-runs/50 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-relationship-runs" />
                    <div>
                      <p className="font-mono text-sm">{infra.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {infra.type}
                        {infra.provider && ` • ${infra.provider}`}
                      </p>
                    </div>
                    {rel && (
                      <Badge
                        variant="outline"
                        className={`ml-auto text-xs ${
                          rel.type === 'USES'
                            ? 'border-relationship-uses text-relationship-uses'
                            : 'border-relationship-runs text-relationship-runs'
                        }`}
                      >
                        {rel.type}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dependencies */}
        {dependencies.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${relationshipColors.DEPENDS_ON}`} />
              <span className={`text-xs font-medium uppercase tracking-wider ${relationshipTextColors.DEPENDS_ON}`}>
                Dependencies ({dependencies.length})
              </span>
            </div>
            <div className="space-y-2 pl-4">
              {dependencies.map((dep) => (
                <div
                  key={dep.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-relationship-depends/50 transition-colors"
                >
                  <GitBranch className="w-5 h-5 text-relationship-depends" />
                  <div>
                    <p className="font-mono text-sm">{dep.serviceName}</p>
                    <p className="text-xs text-muted-foreground">service dependency</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`ml-auto text-xs ${
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

        {/* Observability */}
        {observability.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${relationshipColors.OBSERVED_BY}`} />
              <span className={`text-xs font-medium uppercase tracking-wider ${relationshipTextColors.OBSERVED_BY}`}>
                Observed By ({observability.length})
              </span>
            </div>
            <div className="space-y-2 pl-4">
              {observability.map((obs) => (
                <div
                  key={obs.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-relationship-observed/50 transition-colors"
                >
                  <Activity className="w-5 h-5 text-relationship-observed" />
                  <div>
                    <p className="font-mono text-sm">{obs.name}</p>
                    <p className="text-xs text-muted-foreground">{obs.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {service && (
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-relationship-deployed">{runtimes.length}</p>
              <p className="text-xs text-muted-foreground">Runtimes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-relationship-runs">{infrastructure.length}</p>
              <p className="text-xs text-muted-foreground">Infrastructure</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-relationship-depends">{dependencies.length}</p>
              <p className="text-xs text-muted-foreground">Dependencies</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-relationship-observed">{observability.length}</p>
              <p className="text-xs text-muted-foreground">Observers</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
