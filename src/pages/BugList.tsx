import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Bug, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter,
  FileText,
  Loader2
} from "lucide-react";

interface BugItem {
  id: number;
  name: string;
  description: string;
  file_path: string;
  line_number: number;
  type: "vulnerability" | "logic_error" | "test_failure" | "code_smell";
  status: "open" | "resolved" | "in_progress";
  severity: "low" | "medium" | "high" | "critical";
}

export default function BugList() {
  const { versionId } = useParams<{ versionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bugs, setBugs] = useState<BugItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchBugs();
  }, [versionId]);

  const fetchBugs = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - replace with actual API call
      setTimeout(() => {
        const mockData: BugItem[] = [
          {
            id: 1,
            name: "SQL Injection Vulnerability",
            description: "Potential SQL injection in user authentication query",
            file_path: "src/auth/login.ts",
            line_number: 45,
            type: "vulnerability",
            status: "open",
            severity: "critical"
          },
          {
            id: 2,
            name: "Unhandled Promise Rejection",
            description: "Promise rejection not properly caught in async function",
            file_path: "src/utils/api.ts",
            line_number: 128,
            type: "logic_error",
            status: "in_progress",
            severity: "medium"
          },
          {
            id: 3,
            name: "Missing Unit Test Coverage",
            description: "Critical function lacks proper unit test coverage",
            file_path: "src/services/payment.ts",
            line_number: 89,
            type: "test_failure",
            status: "open",
            severity: "high"
          },
          {
            id: 4,
            name: "XSS Vulnerability",
            description: "Potential cross-site scripting in user input handling",
            file_path: "src/components/UserForm.tsx",
            line_number: 67,
            type: "vulnerability",
            status: "resolved",
            severity: "high"
          },
          {
            id: 5,
            name: "Code Duplication",
            description: "Duplicate validation logic across multiple files",
            file_path: "src/utils/validation.ts",
            line_number: 12,
            type: "code_smell",
            status: "open",
            severity: "low"
          }
        ];
        setBugs(mockData);
        setLoading(false);
      }, 800);
    } catch (error) {
      toast({
        title: "Failed to load bugs",
        description: "An error occurred while fetching bug data.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vulnerability": return <Shield className="w-4 h-4" />;
      case "logic_error": return <Bug className="w-4 h-4" />;
      case "test_failure": return <AlertTriangle className="w-4 h-4" />;
      case "code_smell": return <FileText className="w-4 h-4" />;
      default: return <Bug className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in_progress": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "open": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "warning";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vulnerability": return "text-red-700 bg-red-100";
      case "logic_error": return "text-orange-700 bg-orange-100";
      case "test_failure": return "text-blue-700 bg-blue-100";
      case "code_smell": return "text-gray-700 bg-gray-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const filteredBugs = bugs.filter(bug => {
    const typeMatch = filterType === "all" || bug.type === filterType;
    const statusMatch = filterStatus === "all" || bug.status === filterStatus;
    return typeMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
        <div className="max-w-7xl mx-auto">
          <Header title={`Bugs - Version ${versionId}`} subtitle="Loading bug details..." />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/scan-versions')}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Versions
          </Button>
          <Header 
            title={`Bugs - Version ${versionId}`} 
            subtitle={`Found ${filteredBugs.length} issues to review`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-modern">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{bugs.filter(b => b.status === 'open').length}</div>
                <div className="text-sm text-muted-foreground">Open Issues</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{bugs.filter(b => b.status === 'in_progress').length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{bugs.filter(b => b.status === 'resolved').length}</div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{bugs.filter(b => b.type === 'vulnerability').length}</div>
                <div className="text-sm text-muted-foreground">Vulnerabilities</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-modern">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Bug Details
              </CardTitle>
              <div className="flex gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vulnerability">Vulnerabilities</SelectItem>
                    <SelectItem value="logic_error">Logic Errors</SelectItem>
                    <SelectItem value="test_failure">Test Failures</SelectItem>
                    <SelectItem value="code_smell">Code Smells</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBugs.map((bug) => (
                  <TableRow key={bug.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-semibold">{bug.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {bug.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 w-fit ${getTypeColor(bug.type)}`}
                      >
                        {getTypeIcon(bug.type)}
                        {bug.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        <div>{bug.file_path}</div>
                        <div className="text-muted-foreground">Line {bug.line_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(bug.severity) as any}>
                        {bug.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bug.status)}
                        <span className="capitalize">{bug.status.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredBugs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No bugs found matching the selected filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}