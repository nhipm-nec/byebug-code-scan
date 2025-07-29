import { Bug } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
          <Bug className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gradient">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-lg text-muted-foreground ml-15">
          {subtitle}
        </p>
      )}
    </div>
  );
};