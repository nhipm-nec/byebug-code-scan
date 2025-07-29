import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, ArrowRight, Bug, Shield, Clock, TrendingUp } from "lucide-react";

interface ScanVersion {
  id: number;
  timestamp: string;
  bugs_count: number;
  coverage_percentage: number;
  status: "completed" | "running" | "failed";
  vulnerabilities_count?: number;
  repo_name?: string;
}

export default function ScanVersions() {
  const [scanVersions, setScanVersions] = useState<ScanVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescanning, setRescanning] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchScanVersions();
  }, []);

  const fetchScanVersions = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - replace with actual API call
      setTimeout(() => {
        const mockData: ScanVersion[] = [
          {
            id: 3,
            timestamp: "2024-01-15T14:30:00Z",
            bugs_count: 12,
            coverage_percentage: 85,
            status: "completed",
            vulnerabilities_count: 3,
            repo_name: "myorg/web-app"
          },
          {
            id: 2,
            timestamp: "2024-01-14T10:15:00Z",
            bugs_count: 18,
            coverage_percentage: 78,
            status: "completed",
            vulnerabilities_count: 5,
            repo_name: "myorg/web-app"
          },
          {
            id: 1,
            timestamp: "2024-01-13T16:45:00Z",
            bugs_count: 25,
            coverage_percentage: 72,
            status: "completed",
            vulnerabilities_count: 8,
            repo_name: "myorg/web-app"
          }
        ];
        setScanVersions(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to load scan versions",
        description: "An error occurred while fetching scan data.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleRescan = async () => {
    setRescanning(true);
    try {
      const response = await fetch('/api/codex/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Rescan repository",
          repo: "previous-repo" // This would come from stored state
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start rescan');
      }

      toast({
        title: "Rescan Started",
        description: "A new scan has been initiated.",
      });

      // Refresh the list after a short delay
      setTimeout(() => {
        fetchScanVersions();
      }, 1000);
    } catch (error) {
      toast({
        title: "Rescan Failed",
        description: error instanceof Error ? error.message : "Failed to start rescan.",
        variant: "destructive",
      });
    } finally {
      setRescanning(false);
    }
  };

  const handleViewBugs = (versionId: number) => {
    navigate(`/bugs/${versionId}`);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "running": return "warning";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
        <div className="max-w-6xl mx-auto">
          <Header title="Scan Versions" subtitle="Loading scan history..." />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Header title="Scan Versions" subtitle="Track your security scan history" />
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
            >
              New Scan
            </Button>
            <Button
              onClick={handleRescan}
              disabled={rescanning}
              variant="primary"
              size="lg"
            >
              {rescanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rescanning...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rescan
                </>
              )}
            </Button>
          </div>
        </div>

        {scanVersions.length === 0 ? (
          <Card className="card-modern text-center py-12">
            <CardContent>
              <Bug className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Scans Found</h3>
              <p className="text-muted-foreground mb-6">
                Start your first security scan to see results here.
              </p>
              <Button onClick={() => navigate('/')} variant="primary">
                Start First Scan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {scanVersions.map((version, index) => (
              <Card 
                key={version.id} 
                className="card-modern hover-lift cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleViewBugs(version.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Scan Version {version.id}
                    </CardTitle>
                    <Badge variant={getStatusColor(version.status) as any}>
                      {version.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDate(version.timestamp)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Bug className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600">BUGS</span>
                      </div>
                      <div className="text-2xl font-bold text-red-700">
                        {version.bugs_count}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">COVERAGE</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {version.coverage_percentage}%
                      </div>
                    </div>
                  </div>

                  {version.vulnerabilities_count !== undefined && (
                    <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Shield className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-medium text-orange-600">VULNERABILITIES</span>
                      </div>
                      <div className="text-xl font-bold text-orange-700">
                        {version.vulnerabilities_count}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      {version.repo_name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}