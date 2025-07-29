import { Button } from "@/components/ui/button";
import { TestTube, Network, Shield } from "lucide-react";

interface ScanPromptButtonsProps {
  onPromptSelect: (prompt: string) => void;
}

const promptTemplates = [
  {
    id: "UT",
    label: "Unit Tests",
    icon: TestTube,
    prompt: "Scan for common unit test smells in the codebase.",
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  {
    id: "IT",
    label: "Integration Tests",
    icon: Network,
    prompt: "Analyze integration test reliability and coverage issues.",
    color: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  {
    id: "Vulnerability",
    label: "Vulnerabilities",
    icon: Shield,
    prompt: "Scan for top 10 OWASP vulnerabilities.",
    color: "bg-red-100 text-red-700 hover:bg-red-200",
  },
];

export const ScanPromptButtons = ({ onPromptSelect }: ScanPromptButtonsProps) => {
  return (
    <div className="mb-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Quick Scan Templates
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promptTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Button
              key={template.id}
              variant="outline"
              size="lg"
              onClick={() => onPromptSelect(template.prompt)}
              className={`h-auto p-4 flex-col gap-3 hover-lift ${template.color} border-2`}
            >
              <IconComponent className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">{template.label}</div>
                <div className="text-xs opacity-80 mt-1">
                  Click to auto-fill prompt
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};