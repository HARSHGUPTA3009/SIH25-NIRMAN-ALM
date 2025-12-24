"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AudioUploadCard } from "./audio-upload-card";
import { EditorDialog } from "./editor-dialog";
import { startPipeline } from "@/lib/api";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_AUDIO_TYPES = [
    "audio/wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/m4a",
    "audio/flac",
    "audio/ogg",
];

const formSchema = z.object({
    audioFile: z
        .instanceof(File, { message: "Please upload an audio file" })
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 50MB`)
        .refine(
            (file) =>
                ACCEPTED_AUDIO_TYPES.includes(file.type) ||
                /\.(wav|mp3|m4a|flac|ogg)$/i.test(file.name),
            "Only audio files (.wav, .mp3, .m4a, .flac, .ogg) are accepted"
        ),
    prompt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadForm() {
    const [isUploading, setIsUploading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentRunId, setCurrentRunId] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const selectedFile = form.watch("audioFile");

    async function onSubmit(values: FormValues) {
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", values.audioFile);
            if (values.prompt?.trim()) {
                formData.append("prompt", values.prompt.trim());
            }

            const { runId } = await startPipeline(formData);

            // Open dialog instead of redirecting
            setCurrentRunId(runId);
            setDialogOpen(true);
            setIsUploading(false);
        } catch (error: any) {
            console.error("Failed to start pipeline:", error);
            form.setError("root", {
                message: error.message || "Failed to start pipeline",
            });
            setIsUploading(false);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Audio Upload Field */}
                    <FormField
                        control={form.control}
                        name="audioFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <AudioUploadCard
                                        onFileSelect={(file) => {
                                            form.setValue("audioFile", file, { shouldValidate: true });
                                        }}
                                        onFileRemove={() => {
                                            form.setValue("audioFile", undefined as any);
                                            form.clearErrors("audioFile");
                                        }}
                                        selectedFile={selectedFile}
                                        disabled={isUploading}
                                        error={form.formState.errors.audioFile?.message}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Optional Prompt Field */}
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Soft Prompt (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g., Focus on urgent or dangerous sounds, identify weapon types..."
                                        className="resize-none"
                                        rows={3}
                                        disabled={isUploading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Provide context to guide the AI's analysis
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Error Message */}
                    {form.formState.errors.root && (
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                {form.formState.errors.root.message}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!selectedFile || isUploading}
                        className="w-full"
                        size="lg"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Starting Pipeline...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 mr-2" />
                                Run LTUAS Pipeline
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            {/* Editor Dialog */}
            <EditorDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                runId={currentRunId}
            />
        </>
    );
}
