import { X, Check, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Relationship, RelationshipType } from '@/types/topology';

interface RelationshipInspectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relationship: Partial<Relationship> | null;
  sourceName: string;
  targetName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const relationshipDescriptions: Record<RelationshipType, string> = {
  DEPLOYED_AS: 'The service is deployed as this runtime resource',
  DEPENDS_ON: 'The service requires this dependency to function',
  USES: 'The service consumes this infrastructure resource',
  RUNS_ON: 'The service executes on this infrastructure',
  OBSERVED_BY: 'This tool monitors the service',
};

const relationshipColors: Record<RelationshipType, string> = {
  DEPLOYED_AS: 'border-relationship-deployed text-relationship-deployed',
  DEPENDS_ON: 'border-relationship-depends text-relationship-depends',
  USES: 'border-relationship-uses text-relationship-uses',
  RUNS_ON: 'border-relationship-runs text-relationship-runs',
  OBSERVED_BY: 'border-relationship-observed text-relationship-observed',
};

export function RelationshipInspector({
  open,
  onOpenChange,
  relationship,
  sourceName,
  targetName,
  onConfirm,
  onCancel,
}: RelationshipInspectorProps) {
  if (!relationship?.type) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Confirm Relationship
          </DialogTitle>
          <DialogDescription>
            Review the relationship being created between entities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Relationship Visualization */}
          <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="px-3 py-1.5 bg-primary/20 border border-primary rounded text-sm font-mono">
                {sourceName}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Source</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-px bg-border" />
              <Badge
                variant="outline"
                className={`text-xs my-1 ${relationshipColors[relationship.type]}`}
              >
                {relationship.type}
              </Badge>
              <div className="w-8 h-px bg-border" />
            </div>
            <div className="text-center">
              <div className="px-3 py-1.5 bg-secondary border border-border rounded text-sm font-mono">
                {targetName}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target</p>
            </div>
          </div>

          {/* Relationship Description */}
          <p className="text-sm text-muted-foreground text-center">
            {relationshipDescriptions[relationship.type]}
          </p>

          {/* Assertion Details */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Assertion Type</span>
              <Badge variant="secondary">asserted</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Asserted By</span>
              <span className="font-mono text-foreground">manual</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-mono text-success">1.0</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <Check className="w-4 h-4 mr-2" />
            Save Relationship
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
