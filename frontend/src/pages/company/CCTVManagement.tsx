import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PPEStatusGroup } from '@/components/PPEIcons';
import { mockCameras, Camera } from '@/lib/mockData';
import { camerasApi } from '@/lib/demoApi';
import {
  Video,
  Plus,
  Settings,
  Power,
  MapPin,
  Clock,
  Activity,
  Eye,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CCTVManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cameras, setCameras] = useState(
    mockCameras.filter(c => c.companyId === user?.companyId)
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    streamSource: '',
  });

  const handleAddCamera = async () => {
    if (!newCamera.name || !newCamera.location || !newCamera.streamSource) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // First test the connection
      const testResult = await camerasApi.testConnection(newCamera.streamSource);

      if (!testResult.success) {
        toast({
          title: 'Connection Failed',
          description: 'Could not connect to the camera stream.',
          variant: 'destructive',
        });
        return;
      }

      const camera = await camerasApi.create({
        name: newCamera.name,
        location: newCamera.location,
        streamSource: newCamera.streamSource,
        companyId: user?.companyId || '',
        status: 'active',
        lastActivity: new Date().toISOString(),
      });

      setCameras([...cameras, camera]);
      setNewCamera({ name: '', location: '', streamSource: '' });
      setAddDialogOpen(false);

      toast({
        title: 'Camera Added',
        description: `${camera.name} has been added successfully. Latency: ${testResult.latency}ms`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add camera. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCameraStatus = async (cameraId: string) => {
    const camera = cameras.find(c => c.id === cameraId);
    if (!camera) return;

    const newStatus = camera.status === 'active' ? 'inactive' : 'active';

    try {
      await camerasApi.update(cameraId, { status: newStatus });
      setCameras(prev =>
        prev.map(cam =>
          cam.id === cameraId
            ? { ...cam, status: newStatus }
            : cam
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update camera status.',
        variant: 'destructive',
      });
    }
  };

  const stats = {
    total: cameras.length,
    active: cameras.filter(c => c.status === 'active').length,
    inactive: cameras.filter(c => c.status === 'inactive').length,
    maintenance: cameras.filter(c => c.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CCTV Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage your camera feeds
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Camera
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Camera</DialogTitle>
              <DialogDescription>
                Configure a new CCTV camera for PPE monitoring
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cameraName">Camera Name</Label>
                <Input
                  id="cameraName"
                  placeholder="e.g., CAM-WB03"
                  value={newCamera.name}
                  onChange={(e) =>
                    setNewCamera({ ...newCamera, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Welding Bay 3"
                  value={newCamera.location}
                  onChange={(e) =>
                    setNewCamera({ ...newCamera, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="streamSource">Stream Source (RTSP URL)</Label>
                <Input
                  id="streamSource"
                  placeholder="rtsp://192.168.1.xxx/stream"
                  value={newCamera.streamSource}
                  onChange={(e) =>
                    setNewCamera({ ...newCamera, streamSource: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCamera} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Add Camera
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Cameras</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-success">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Power className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">{stats.maintenance}</p>
            <p className="text-xs text-muted-foreground">Maintenance</p>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            className={`glass-panel overflow-hidden cursor-pointer transition-all hover:border-primary/50 ${selectedCamera?.id === camera.id ? 'ring-2 ring-primary' : ''
              }`}
            onClick={() => setSelectedCamera(camera)}
          >
            {/* Video Preview Placeholder */}

            <div className="relative aspect-video bg-muted/50">
              {camera.status === 'active' && (
                <img
                  src={`http://localhost:8000/stream/${camera.id}`}
                  className="w-full h-full object-cover"
                  alt="Camera feed"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              {camera.status !== 'active' && (

                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Camera Offline</p>
                </div>
              )}

              {/* Status indicator */}
              <div className="absolute top-3 left-3">
                <Badge
                  variant={
                    camera.status === 'active'
                      ? 'success'
                      : camera.status === 'maintenance'
                        ? 'warning'
                        : 'secondary'
                  }
                  className="gap-1"
                >
                  {camera.status === 'active' && (
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  )}
                  {camera.status}
                </Badge>
              </div>

              {/* PPE Detection overlay (mock) */}
              {camera.status === 'active' && (
                <div className="absolute bottom-3 right-3">
                  <PPEStatusGroup all missing={[]} size="sm" />
                </div>
              )}
            </div>

            {/* Camera Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{camera.name}</h3>
                <Switch
                  checked={camera.status === 'active'}
                  onCheckedChange={() => toggleCameraStatus(camera.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{camera.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Last activity:{' '}
                    {new Date(camera.lastActivity).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`http://localhost:8000/stream/${camera.id}`, '_blank');
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>

                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cameras.length === 0 && (
        <div className="glass-panel py-16 text-center">
          <Video className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No cameras configured</h3>
          <p className="text-muted-foreground mb-4">
            Add your first CCTV camera to start monitoring PPE compliance
          </p>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Camera
          </Button>
        </div>
      )}
    </div>
  );
}
