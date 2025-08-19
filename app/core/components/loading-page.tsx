import { Loader2Icon } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <Loader2Icon className="text-primary mr-4 h-6 w-6 animate-spin" />
      <span className="text-muted-foreground text-sm font-medium">
        페이지를 불러오는 중...
      </span>
    </div>
  );
}
