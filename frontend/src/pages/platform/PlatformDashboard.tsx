import React from 'react';
import { Link } from 'react-router-dom';
import { KPICard } from '@/components/KPICard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockCompanies, mockEmployees, mockViolations, violationsByCompany, complianceTrendData } from '@/lib/mockData';
import {
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function PlatformDashboard() {
  const activeCompanies = mockCompanies.filter(c => c.status === 'active').length;
  const pendingCompanies = mockCompanies.filter(c => c.status === 'pending').length;
  const totalEmployees = mockCompanies.reduce((acc, c) => acc + c.employeeCount, 0);
  const todayViolations = mockViolations.filter(v => {
    const today = new Date().toDateString();
    return new Date(v.timestamp).toDateString() === today;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
          <p className="text-muted-foreground">
            Monitor all companies and safety compliance across the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="pending" className="gap-1">
            <Clock className="w-3 h-3" />
            {pendingCompanies} pending approval
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Companies"
          value={mockCompanies.length}
          subtitle={`${activeCompanies} active, ${pendingCompanies} pending`}
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Approved Companies"
          value={activeCompanies}
          subtitle="Currently active"
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Total Employees"
          value={totalEmployees.toLocaleString()}
          subtitle="Across all companies"
          icon={Users}
        />
        <KPICard
          title="Violations Today"
          value={todayViolations}
          subtitle="Detected across platform"
          icon={AlertTriangle}
          variant="danger"
          trend={{ value: 8, isPositive: false }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Trend */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Compliance Trend</h3>
              <p className="text-sm text-muted-foreground">Last 7 days across all companies</p>
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={complianceTrendData}>
              <defs>
                <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
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
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fill="url(#complianceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Violations by Company */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Violations by Company</h3>
              <p className="text-sm text-muted-foreground">This week</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={violationsByCompany} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="company" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="violations" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingCompanies > 0 && (
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Pending Company Approvals</h3>
              <p className="text-sm text-muted-foreground">
                Review and approve new company registrations
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/platform/companies">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {mockCompanies
              .filter(c => c.status === 'pending')
              .slice(0, 3)
              .map(company => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.adminName} · {company.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="pending">Pending</Badge>
                    <Button size="sm">Review</Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Active Companies Overview */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Active Companies</h3>
            <p className="text-sm text-muted-foreground">
              Companies currently using the platform
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/platform/companies">
              Manage Companies
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Employees</th>
                <th>Cameras</th>
                <th>Compliance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCompanies
                .filter(c => c.status === 'active')
                .map(company => (
                  <tr key={company.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.adminEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="capitalize">{company.industry}</td>
                    <td>{company.employeeCount}</td>
                    <td>{company.cameraCount}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success rounded-full"
                            style={{ width: `${company.complianceRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{company.complianceRate}%</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant="active">Active</Badge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



