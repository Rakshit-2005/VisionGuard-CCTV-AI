import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PPEStatusGroup, PPELabel, PPEType } from '@/components/PPEIcons';
import { mockViolations } from '@/lib/mockData';
import {
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Download,
} from 'lucide-react';

export default function Violations() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [ppeFilter, setPpeFilter] = useState<string>('all');
  
  const violations = mockViolations.filter(v => v.companyId === user?.companyId);

  const filteredViolations = violations.filter(violation => {
    const matchesSearch =
      violation.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.cameraLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || violation.severity === severityFilter;
    const matchesPPE =
      ppeFilter === 'all' || violation.missingPPE.includes(ppeFilter as PPEType);
    return matchesSearch && matchesSeverity && matchesPPE;
  });

  const stats = {
    total: violations.length,
    high: violations.filter(v => v.severity === 'high').length,
    medium: violations.filter(v => v.severity === 'medium').length,
    low: violations.filter(v => v.severity === 'low').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Safety Violations</h1>
          <p className="text-muted-foreground">
            Track and manage PPE compliance violations
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Violations</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-danger/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <p className="text-2xl font-bold text-danger">{stats.high}</p>
            <p className="text-xs text-muted-foreground">High Severity</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">{stats.medium}</p>
            <p className="text-xs text-muted-foreground">Medium Severity</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-muted-foreground">{stats.low}</p>
            <p className="text-xs text-muted-foreground">Low Severity</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee, ID, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ppeFilter} onValueChange={setPpeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="PPE Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All PPE</SelectItem>
            <SelectItem value="helmet">Helmet</SelectItem>
            <SelectItem value="shoes">Safety Shoes</SelectItem>
            <SelectItem value="goggles">Goggles</SelectItem>
            <SelectItem value="mask">Mask</SelectItem>
            <SelectItem value="gloves">Gloves</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Violations List */}
      <div className="space-y-4">
        {filteredViolations.map((violation) => (
          <div
            key={violation.id}
            className="glass-panel p-6 animate-slide-up"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Left: Employee Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      violation.severity === 'high'
                        ? 'bg-danger/20'
                        : violation.severity === 'medium'
                        ? 'bg-warning/20'
                        : 'bg-muted'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-6 h-6 ${
                        violation.severity === 'high'
                          ? 'text-danger'
                          : violation.severity === 'medium'
                          ? 'text-warning'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {violation.employeeName}
                      </span>
                      <span className="text-sm font-mono text-muted-foreground">
                        ({violation.employeeId})
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {violation.cameraLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(violation.timestamp).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(violation.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: PPE & Severity */}
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Missing PPE</p>
                  <div className="flex items-center gap-2">
                    <PPEStatusGroup missing={violation.missingPPE} />
                    <div className="text-sm text-foreground">
                      {violation.missingPPE.map((ppe, i) => (
                        <span key={ppe}>
                          <PPELabel type={ppe} />
                          {i < violation.missingPPE.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    violation.severity === 'high'
                      ? 'danger'
                      : violation.severity === 'medium'
                      ? 'warning'
                      : 'secondary'
                  }
                  className="uppercase"
                >
                  {violation.severity}
                </Badge>
              </div>
            </div>
          </div>
        ))}

        {filteredViolations.length === 0 && (
          <div className="glass-panel py-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No violations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
