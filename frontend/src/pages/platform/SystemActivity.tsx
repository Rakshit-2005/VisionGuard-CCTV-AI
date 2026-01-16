import React from 'react';
import { Badge } from '@/components/ui/badge';
import { mockCompanies, mockViolations } from '@/lib/mockData';
import {
  Activity,
  Building2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'company_approved' | 'company_registered' | 'violation_detected' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ElementType;
  variant: 'success' | 'warning' | 'danger' | 'default';
}

const generateActivities = (): ActivityItem[] => {
  const activities: ActivityItem[] = [];

  // Add company registrations
  mockCompanies.forEach(company => {
    if (company.status === 'pending') {
      activities.push({
        id: `reg-${company.id}`,
        type: 'company_registered',
        title: 'New Company Registration',
        description: `${company.name} submitted a registration request`,
        timestamp: new Date(company.createdAt),
        icon: Building2,
        variant: 'warning',
      });
    } else if (company.status === 'active') {
      activities.push({
        id: `app-${company.id}`,
        type: 'company_approved',
        title: 'Company Approved',
        description: `${company.name} has been approved and activated`,
        timestamp: new Date(company.createdAt),
        icon: CheckCircle,
        variant: 'success',
      });
    }
  });

  // Add some violations
  mockViolations.slice(0, 5).forEach(violation => {
    activities.push({
      id: `vio-${violation.id}`,
      type: 'violation_detected',
      title: 'PPE Violation Detected',
      description: `${violation.employeeName} missing ${violation.missingPPE.join(', ')}`,
      timestamp: new Date(violation.timestamp),
      icon: AlertTriangle,
      variant: 'danger',
    });
  });

  // Add system events
  activities.push({
    id: 'sys-1',
    type: 'system',
    title: 'System Update',
    description: 'AI detection model updated to v2.1.0',
    timestamp: new Date(Date.now() - 3600000 * 24),
    icon: Activity,
    variant: 'default',
  });

  // Sort by timestamp
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function SystemActivity() {
  const activities = generateActivities();

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Activity</h1>
        <p className="text-muted-foreground">
          Real-time platform events and notifications
        </p>
      </div>

      {/* Activity Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {activities.filter(a => a.type === 'company_approved').length}
            </p>
            <p className="text-xs text-muted-foreground">Approvals</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {activities.filter(a => a.type === 'company_registered').length}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-danger/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {activities.filter(a => a.type === 'violation_detected').length}
            </p>
            <p className="text-xs text-muted-foreground">Violations</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{activities.length}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="glass-panel p-6">
        <h2 className="font-semibold text-foreground mb-6">Recent Activity</h2>
        
        <div className="space-y-1">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="relative">
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
                )}
                
                <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.variant === 'success'
                        ? 'bg-success/20'
                        : activity.variant === 'warning'
                        ? 'bg-warning/20'
                        : activity.variant === 'danger'
                        ? 'bg-danger/20'
                        : 'bg-muted'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        activity.variant === 'success'
                          ? 'text-success'
                          : activity.variant === 'warning'
                          ? 'text-warning'
                          : activity.variant === 'danger'
                          ? 'text-danger'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <Badge
                        variant={
                          activity.variant === 'success'
                            ? 'success'
                            : activity.variant === 'warning'
                            ? 'warning'
                            : activity.variant === 'danger'
                            ? 'danger'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
