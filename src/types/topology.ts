export type Environment = 'production' | 'staging' | 'development' | 'testing';
export type Criticality = 'critical' | 'high' | 'medium' | 'low';
export type ResourceType = 'kubernetes-deployment' | 'kubernetes-job' | 'lambda-function' | 'ecs-service';
export type InfrastructureType = 'cluster' | 'region' | 'cloud-account' | 'datastore' | 'queue' | 'cache';
export type RelationshipType = 'DEPLOYED_AS' | 'DEPENDS_ON' | 'USES' | 'RUNS_ON' | 'OBSERVED_BY';
export type DependencyCriticality = 'blocking' | 'optional';

export interface Service {
  id: string;
  name: string;
  team: string;
  environment: Environment;
  criticality: Criticality;
  createdAt: Date;
}

export interface Runtime {
  id: string;
  type: ResourceType;
  name: string;
  namespace?: string;
}

export interface Infrastructure {
  id: string;
  type: InfrastructureType;
  name: string;
  provider?: string;
}

export interface Dependency {
  id: string;
  serviceId: string;
  serviceName: string;
  criticality: DependencyCriticality;
}

export interface ObservabilitySource {
  id: string;
  name: string;
  type: 'prometheus' | 'datadog' | 'newrelic' | 'grafana' | 'pagerduty' | 'opsgenie';
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  assertionType: 'asserted';
  assertedBy: 'manual';
  confidence: 1.0;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface TopologyNode {
  id: string;
  label: string;
  type: 'service' | 'runtime' | 'infrastructure' | 'observability';
  subtype?: string;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: RelationshipType;
}
