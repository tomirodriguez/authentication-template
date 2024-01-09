import { SettingsForm } from "@/components/settings-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">📝 Settings</p>
      </CardHeader>
      <CardContent>
        <SettingsForm />
      </CardContent>
    </Card>
  );
}
