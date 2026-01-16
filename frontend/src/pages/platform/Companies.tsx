import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockCompanies, Company } from '@/lib/mockData';
import { companiesApi } from '@/lib/demoApi';
import {
  Building2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Clock,
  Factory,
  FlaskConical,
  Warehouse,
  HardHat,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const industryIcons = {
  factory: Factory,
  lab: FlaskConical,
  warehouse: Warehouse,
  construction: HardHat,
};

export default function Companies() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState(mockCompanies);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: 'approve' | 'reject' | null }>({
    open: false,
    action: null,
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (company: Company, action: 'approve' | 'reject') => {
    setSelectedCompany(company);
    setActionDialog({ open: true, action });
  };

  const confirmAction = async () => {
    if (!selectedCompany || !actionDialog.action) return;

    setIsLoading(true);
    try {
      if (actionDialog.action === 'approve') {
        await companiesApi.approve(selectedCompany.id);
      } else {
        await companiesApi.reject(selectedCompany.id);
      }

      const newStatus = actionDialog.action === 'approve' ? 'active' : 'rejected';
      setCompanies(prev =>
        prev.map(c =>
          c.id === selectedCompany.id ? { ...c, status: newStatus as Company['status'] } : c
        )
      );

      toast({
        title: actionDialog.action === 'approve' ? 'Company Approved' : 'Company Rejected',
        description: `${selectedCompany.name} has been ${actionDialog.action === 'approve' ? 'approved and notified' : 'rejected'}.`,
      });

      setActionDialog({ open: false, action: null });
      setSelectedCompany(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process the request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Company Management</h1>
        <p className="text-muted-foreground">
          Manage company registrations and access
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Companies Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Admin</th>
                <th>Status</th>
                <th>Stats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(company => {
                const IndustryIcon = industryIcons[company.industry];
                return (
                  <tr key={company.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <IndustryIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize">{company.industry}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">{company.adminName}</p>
                        <p className="text-xs text-muted-foreground">{company.adminEmail}</p>
                      </div>
                    </td>
                    <td>
                      <Badge
                        variant={
                          company.status === 'active'
                            ? 'active'
                            : company.status === 'pending'
                            ? 'pending'
                            : 'danger'
                        }
                      >
                        {company.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {company.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {company.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {company.status}
                      </Badge>
                    </td>
                    <td>
                      {company.status === 'active' ? (
                        <div className="text-sm">
                          <p className="text-foreground">{company.employeeCount} employees</p>
                          <p className="text-muted-foreground">{company.cameraCount} cameras</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {company.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleAction(company, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(company, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {company.status === 'active' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/platform/companies/${company.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCompanies.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No companies found</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'approve' ? 'Approve Company' : 'Reject Company'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === 'approve' ? (
                <>
                  Are you sure you want to approve <strong>{selectedCompany?.name}</strong>?
                  They will be notified and gain access to the platform.
                </>
              ) : (
                <>
                  Are you sure you want to reject <strong>{selectedCompany?.name}</strong>?
                  They will not be able to access the platform.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, action: null })}>
              Cancel
            </Button>
            <Button
              variant={actionDialog.action === 'approve' ? 'success' : 'destructive'}
              onClick={confirmAction}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
