import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { ScanPromptButtons } from "@/components/ScanPromptButtons";
import { RepoSelector } from "@/components/RepoSelector";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play } from "lucide-react";

export default function ScanSetup() {
  const [prompt, setPrompt] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const handleSubmit = async () => {
    if (!selectedRepo) {
      toast({
        title: "Repository Required",
        description: "Please select a repository to scan.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/codex/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt || undefined,
          repo: selectedRepo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start scan');
      }

      toast({
        title: "Scan Started",
        description: "Your repository scan has been initiated successfully.",
        variant: "default",
      });

      navigate('/scan-versions');
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An error occurred while starting the scan.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        <Header 
          title="ByeBug" 
          subtitle="Advanced Bug & Vulnerability Scanner"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Setup Panel */}
          <div className="lg:col-span-2 space-y-6">
            <ScanPromptButtons onPromptSelect={handlePromptSelect} />

            <Card className="card-modern animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Scan Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Custom Prompt (Optional)
                  </label>
                  <Textarea
                    placeholder="Enter a custom scanning prompt or use one of the templates above..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Repository *
                  </label>
                  <RepoSelector
                    selectedRepo={selectedRepo}
                    onRepoSelect={setSelectedRepo}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedRepo}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting Scan...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card className="card-modern animate-slide-up">
              <CardHeader>
                <CardTitle className="text-lg">Scan Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                  <div>
                    <div className="font-medium">OWASP Vulnerabilities</div>
                    <div className="text-muted-foreground">Detect top 10 security risks</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                  <div>
                    <div className="font-medium">Code Quality</div>
                    <div className="text-muted-foreground">Find bugs and code smells</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <div className="font-medium">Test Coverage</div>
                    <div className="text-muted-foreground">Analyze test reliability</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardContent className="pt-6">
                <div className="text-center text-sm text-muted-foreground">
                  Scans typically take 2-5 minutes depending on repository size
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}