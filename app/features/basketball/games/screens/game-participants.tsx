import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

export default function GameParticipants() {
  return (
    <Card className="mx-4 min-h-[calc(100vh-96px)]">
      <CardHeader>
        <CardTitle>참가자 관리</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2"></CardContent>
    </Card>
  );
}
