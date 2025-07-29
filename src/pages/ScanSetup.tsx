import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { ScanPromptButtons } from "@/components/ScanPromptButtons";
import { RepoSelector } from "@/components/RepoSelector";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, History } from "lucide-react";

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

      navigate(`/scan-versions?repo=${selectedRepo}`);
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

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div></div>
            <Button
              variant="outline"
              onClick={() => navigate('/repo-history')}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </div>

          <ScanPromptButtons onPromptSelect={handlePromptSelect} />

          <Card className="card-modern animate-fade-in max-w-2xl mx-auto">
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

          <Card className="card-modern max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                Scans typically take 2-5 minutes depending on repository size
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}