import { Loader2Icon } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="inset-0 flex min-h-[calc(100vh-64px)] items-center justify-center">
      <Loader2Icon className="text-primary mr-4 h-6 w-6 animate-spin" />
      <span className="text-muted-foreground text-sm font-medium">
        페이지를 불러오는 중...
      </span>
    </div>
  );
}
