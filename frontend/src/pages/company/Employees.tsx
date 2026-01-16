import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { mockEmployees, Employee } from '@/lib/mockData';
import { employeesApi } from '@/lib/demoApi';
import {
  Users,
  Search,
  Plus,
  Upload,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function Employees() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState(
    mockEmployees.filter(e => e.companyId === user?.companyId)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    department: '',
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.complianceStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.employeeId || !newEmployee.department) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const employee = await employeesApi.create({
        employeeId: newEmployee.employeeId,
        name: newEmployee.name,
        department: newEmployee.department,
        companyId: user?.companyId || '',
        complianceStatus: 'unknown',
      });

      setEmployees([...employees, employee]);
      setNewEmployee({ name: '', employeeId: '', department: '' });
      setAddDialogOpen(false);
      
      toast({
        title: 'Employee Added',
        description: `${employee.name} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add employee. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    setIsLoading(true);
    try {
      // Create a mock file for demo
      const mockFile = new File([''], 'employees.csv');
      const result = await employeesApi.bulkUpload(mockFile);
      
      toast({
        title: 'Bulk Upload Complete',
        description: `${result.count} employees imported successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload employees.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    try {
      await employeesApi.delete(id);
      setEmployees(employees.filter(e => e.id !== id));
      toast({
        title: 'Employee Removed',
        description: `${name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove employee.',
        variant: 'destructive',
      });
    }
  };

  const complianceStats = {
    total: employees.length,
    compliant: employees.filter(e => e.complianceStatus === 'compliant').length,
    nonCompliant: employees.filter(e => e.complianceStatus === 'non-compliant').length,
    unknown: employees.filter(e => e.complianceStatus === 'unknown').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">
            Manage employee records and compliance status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBulkUpload} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Bulk Upload
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the employee details below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    placeholder="e.g., TF-009"
                    value={newEmployee.employeeId}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, employeeId: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newEmployee.department}
                    onValueChange={(value) =>
                      setNewEmployee({ ...newEmployee, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assembly Line A">Assembly Line A</SelectItem>
                      <SelectItem value="Assembly Line B">Assembly Line B</SelectItem>
                      <SelectItem value="Welding">Welding</SelectItem>
                      <SelectItem value="Quality Control">Quality Control</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Packaging">Packaging</SelectItem>
                      <SelectItem value="Shipping">Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Add Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{complianceStats.total}</p>
            <p className="text-xs text-muted-foreground">Total Employees</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-success">{complianceStats.compliant}</p>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-danger/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <p className="text-2xl font-bold text-danger">{complianceStats.nonCompliant}</p>
            <p className="text-xs text-muted-foreground">Non-Compliant</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-muted-foreground">{complianceStats.unknown}</p>
            <p className="text-xs text-muted-foreground">Unknown</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
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
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="non-compliant">Non-Compliant</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employees Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Violation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{emp.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-sm">{emp.employeeId}</td>
                  <td>{emp.department}</td>
                  <td>
                    <Badge
                      variant={
                        emp.complianceStatus === 'compliant'
                          ? 'success'
                          : emp.complianceStatus === 'non-compliant'
                          ? 'danger'
                          : 'secondary'
                      }
                    >
                      {emp.complianceStatus === 'compliant' && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {emp.complianceStatus === 'non-compliant' && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {emp.complianceStatus}
                    </Badge>
                  </td>
                  <td>
                    {emp.lastViolation ? (
                      <span className="text-sm text-muted-foreground">
                        {new Date(emp.lastViolation).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-danger"
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No employees found</p>
          </div>
        )}
      </div>
    </div>
  );
}
