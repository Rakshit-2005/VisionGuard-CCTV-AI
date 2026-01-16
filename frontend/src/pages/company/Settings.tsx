import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { mockCompanies } from '@/lib/mockData';
import { settingsApi, companiesApi } from '@/lib/demoApi';
import {
  Building2,
  User,
  Bell,
  Shield,
  LogOut,
  Save,
  Mail,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const company = mockCompanies.find(c => c.id === user?.companyId);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    violationAlerts: true,
    weeklyReports: true,
    monthlyReports: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await settingsApi.update({
        notifications: notifications.emailAlerts,
        emailAlerts: notifications.violationAlerts,
      });
      
      toast({
        title: 'Settings Saved',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your company profile and preferences
        </p>
      </div>

      {/* Company Profile */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Company Profile</h2>
            <p className="text-sm text-muted-foreground">Your organization details</p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" value={company?.name || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" value={company?.industry || ''} readOnly className="capitalize" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="companyEmail">Company Email</Label>
            <Input id="companyEmail" value={company?.email || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Admin Account */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Admin Account</h2>
            <p className="text-sm text-muted-foreground">Your personal admin details</p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="adminName">Full Name</Label>
            <Input id="adminName" value={user?.name || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email Address</Label>
            <Input id="adminEmail" value={user?.email || ''} type="email" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground">Configure alert preferences</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.emailAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Violation Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Real-time alerts for PPE violations
              </p>
            </div>
            <Switch
              checked={notifications.violationAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, violationAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly compliance summaries
              </p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weeklyReports: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Monthly Reports</Label>
              <p className="text-sm text-muted-foreground">
                Detailed monthly analytics reports
              </p>
            </div>
            <Switch
              checked={notifications.monthlyReports}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, monthlyReports: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex-1 text-danger hover:text-danger">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout from your account?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
