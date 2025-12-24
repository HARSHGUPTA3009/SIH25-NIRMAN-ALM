"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { fetchStatus } from "@/lib/api";
import { pipelineResultAtom, PipelineResult } from "@/state/pipeline-result";
import { ArrowLeft, Download, RefreshCw, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


export default function OutputPage() {
    const params = useParams();
    const router = useRouter();
    const runId = params.runId as string;
    const setPipelineResult = useSetAtom(pipelineResultAtom);

    const [result, setResult] = useState<PipelineResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!runId) return;

        async function loadResult() {
            try {
                const status = await fetchStatus(runId);
                if (status.result) {
                    setResult(status.result);
                    setPipelineResult(status.result);
                } else if (status.error) {
                    setError(status.error);
                    setPipelineResult(null);
                } else {
                    setError("No results available");
                    setPipelineResult(null);
                }
            } catch (err: any) {
                console.error("Failed to load result:", err);
                setError(err.message || "Failed to load results");
                setPipelineResult(null);
            } finally {
                setLoading(false);
            }
        }

        loadResult();
    }, [runId, setPipelineResult]);

    const handleDownload = () => {
        if (!result) return;

        const blob = new Blob([JSON.stringify(result, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ltuas-result-${runId.slice(0, 8)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <RefreshCw className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <CardTitle>Error Loading Results</CardTitle>
                        </div>
                        <CardDescription className="text-destructive/80">
                            {error}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push("/")} className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Pipeline Results
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Run ID: <code className="text-xs">{runId}</code>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => router.push("/test")}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Chat
                        </Button>
                        <Button size="sm" onClick={() => router.push("/")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            New Analysis
                        </Button>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid gap-6 md:grid-cols-2 mb-6">
                    {/* CLAP Results */}
                    {result?.clap_inf && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    🔊 Sound Classification
                                </CardTitle>
                                <CardDescription>CLAP Model</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Dominant Sound
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {result.clap_inf.dominant_sound}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {(result.clap_inf.dominant_confidence * 100).toFixed(1)}%
                                        confidence
                                    </p>
                                </div>
                                {result.clap_inf.top_sounds && result.clap_inf.top_sounds.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                            Top Detections
                                        </p>
                                        <div className="space-y-2">
                                            {result.clap_inf.top_sounds
                                                .slice(0, 5)
                                                .map((sound, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex justify-between items-center rounded-md bg-muted/30 px-3 py-2 text-sm"
                                                    >
                                                        <span>{sound.sound}</span>
                                                        <span className="font-medium tabular-nums">
                                                            {(sound.confidence * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Speech Results */}
                    {result?.speech_inf && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    🎤 Speech Recognition
                                </CardTitle>
                                <CardDescription>Whisper Model</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {result.speech_inf.has_speech ? (
                                    <div className="space-y-4">
                                        {result.speech_inf.language && (
                                            <div className="rounded-lg border bg-muted/50 p-4">
                                                <p className="text-xs text-muted-foreground mb-1">
                                                    Language
                                                </p>
                                                <p className="font-semibold">
                                                    {result.speech_inf.language}
                                                </p>
                                            </div>
                                        )}
                                        {result.speech_inf.text && (
                                            <div className="rounded-lg border bg-muted/50 p-4">
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    Transcription
                                                </p>
                                                <p className="text-sm leading-relaxed">
                                                    "{result.speech_inf.text}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border bg-muted/50 p-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            No speech detected in audio
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* MELLOW Results */}
                    {result?.mellow_inf && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base">🧠 AI Reasoning</CardTitle>
                                <CardDescription>MELLOW Model</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {result.mellow_inf.inference}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Full JSON */}
                <Card>
                    <CardContent className="pt-6">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="json-response">
                                <AccordionTrigger>View Full JSON Response</AccordionTrigger>
                                <AccordionContent>
                                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs border">
                                        {JSON.stringify(
                                            (() => {
                                                if (!result) return result;
                                                const filtered = { ...result } as PipelineResult;
                                                if (filtered.soft_prompts) {
                                                    const { unified, ...rest } = filtered.soft_prompts;
                                                    filtered.soft_prompts = rest;
                                                }
                                                return filtered;
                                            })(),
                                            null,
                                            2
                                        )}
                                    </pre>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}