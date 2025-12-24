import UploadForm from "@/components/upload-form";
import SonicWaveformCanvas from "@/components/sonic-waveform"; // Adjust path as needed
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="relative min-h-svh w-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <SonicWaveformCanvas />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen flex justify-center items-center p-4">
        <Card className="w-full max-w-xl backdrop-blur-sm bg-background/80 border-border/50">
          <CardHeader>
            <CardTitle>LTUAS model</CardTitle>
            <CardDescription>
              Upload your audio file along with an optional soft prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
