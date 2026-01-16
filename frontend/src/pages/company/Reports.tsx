import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { complianceTrendData, ppeViolationData } from '@/lib/mockData';
import { reportsApi, violationsApi } from '@/lib/demoApi';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  MapPin,
  Loader2,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

const weeklyData = [
  { day: 'Mon', compliant: 85, violations: 12 },
  { day: 'Tue', compliant: 88, violations: 9 },
  { day: 'Wed', compliant: 82, violations: 15 },
  { day: 'Thu', compliant: 90, violations: 7 },
  { day: 'Fri', compliant: 92, violations: 5 },
  { day: 'Sat', compliant: 95, violations: 3 },
  { day: 'Sun', compliant: 94, violations: 4 },
];

const locationData = [
  { location: 'Welding Bay', violations: 25 },
  { location: 'Assembly Line A', violations: 18 },
  { location: 'Assembly Line B', violations: 12 },
  { location: 'Maintenance Hall', violations: 8 },
  { location: 'Shipping Area', violations: 5 },
];

export default function Reports() {
  const [timeRange, setTimeRange] = useState('week');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: 'pdf' | 'csv') => {
    setIsExporting(true);
    try {
      await violationsApi.exportReport(format);
      toast({
        title: 'Export Complete',
        description: `Report exported as ${format.toUpperCase()} successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsExporting(true);
    try {
      const result = await reportsApi.generateReport(timeRange as 'daily' | 'weekly' | 'monthly');
      toast({
        title: 'Report Generated',
        description: 'Your report is ready for download.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive safety compliance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('csv')} disabled={isExporting}>
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg. Compliance Rate</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-3xl font-bold text-success">92.4%</p>
          <p className="text-xs text-muted-foreground mt-1">+2.3% from last {timeRange}</p>
        </div>
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Violations</span>
            <TrendingDown className="w-4 h-4 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground">47</p>
          <p className="text-xs text-muted-foreground mt-1">-15% from last {timeRange}</p>
        </div>
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Most Common Violation</span>
          </div>
          <p className="text-xl font-bold text-warning">Missing Helmet</p>
          <p className="text-xs text-muted-foreground mt-1">35% of all violations</p>
        </div>
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">High-Risk Area</span>
            <MapPin className="w-4 h-4 text-danger" />
          </div>
          <p className="text-xl font-bold text-danger">Welding Bay</p>
          <p className="text-xs text-muted-foreground mt-1">25 violations this week</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Trend */}
        <div className="chart-container">
          <h3 className="font-semibold text-foreground mb-4">Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={complianceTrendData}>
              <defs>
                <linearGradient id="complianceGradientReport" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#complianceGradientReport)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Violations by Day */}
        <div className="chart-container">
          <h3 className="font-semibold text-foreground mb-4">Daily Violations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="violations" fill="hsl(var(--danger))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PPE Distribution */}
        <div className="chart-container">
          <h3 className="font-semibold text-foreground mb-4">Violations by PPE Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ppeViolationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={true}
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
        </div>

        {/* Location Heatmap */}
        <div className="chart-container">
          <h3 className="font-semibold text-foreground mb-4">Violations by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                dataKey="location"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="violations" radius={[0, 4, 4, 0]}>
                {locationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.violations > 20
                        ? 'hsl(var(--danger))'
                        : entry.violations > 10
                        ? 'hsl(var(--warning))'
                        : 'hsl(var(--success))'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
