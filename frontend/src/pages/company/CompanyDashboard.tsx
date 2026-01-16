import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/KPICard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PPEStatusGroup } from '@/components/PPEIcons';
import { mockEmployees, mockViolations, mockCameras, complianceTrendData, ppeViolationData, mockCompanies } from '@/lib/mockData';
import {
  Users,
  AlertTriangle,
  Video,
  ShieldCheck,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function CompanyDashboard() {
  const { user } = useAuth();
  
  const company = mockCompanies.find(c => c.id === user?.companyId);
  const employees = mockEmployees.filter(e => e.companyId === user?.companyId);
  const violations = mockViolations.filter(v => v.companyId === user?.companyId);
  const cameras = mockCameras.filter(c => c.companyId === user?.companyId);
  
  const nonCompliantCount = employees.filter(e => e.complianceStatus === 'non-compliant').length;
  const activeCameras = cameras.filter(c => c.status === 'active').length;
  const todayViolations = violations.filter(v => {
    const today = new Date().toDateString();
    return new Date(v.timestamp).toDateString() === today;
  });

  const recentViolations = violations.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with safety compliance today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <ShieldCheck className="w-3 h-3" />
            {company?.complianceRate || 94.5}% Compliant
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Employees"
          value={employees.length}
          subtitle="Monitored personnel"
          icon={Users}
        />
        <KPICard
          title="Non-Compliant"
          value={nonCompliantCount}
          subtitle="Employees needing attention"
          icon={AlertTriangle}
          variant="danger"
        />
        <KPICard
          title="Active Cameras"
          value={`${activeCameras}/${cameras.length}`}
          subtitle="CCTV feeds online"
          icon={Video}
          variant="success"
        />
        <KPICard
          title="Violations Today"
          value={todayViolations.length}
          subtitle="PPE violations detected"
          icon={AlertTriangle}
          variant="warning"
          trend={{ value: 15, isPositive: false }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Trend */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Compliance Rate</h3>
              <p className="text-sm text-muted-foreground">Last 7 days trend</p>
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={complianceTrendData}>
              <defs>
                <linearGradient id="complianceGradientCompany" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="compliance"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#complianceGradientCompany)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PPE Violation Distribution */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Violation by PPE Type</h3>
              <p className="text-sm text-muted-foreground">This week's distribution</p>
            </div>
          </div>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={ppeViolationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ppeViolationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {ppeViolationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Violations */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Recent Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Latest PPE violation detections
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/company/violations">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {recentViolations.map(violation => (
            <div
              key={violation.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border animate-slide-up"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    violation.severity === 'high'
                      ? 'bg-danger/20'
                      : violation.severity === 'medium'
                      ? 'bg-warning/20'
                      : 'bg-muted'
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      violation.severity === 'high'
                        ? 'text-danger'
                        : violation.severity === 'medium'
                        ? 'text-warning'
                        : 'text-muted-foreground'
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{violation.employeeName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{violation.cameraLocation}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(violation.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PPEStatusGroup missing={violation.missingPPE} />
                <Badge
                  variant={
                    violation.severity === 'high'
                      ? 'danger'
                      : violation.severity === 'medium'
                      ? 'warning'
                      : 'secondary'
                  }
                >
                  {violation.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
