"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchStatus, mapStatus, type NodeStatus } from "@/lib/api";
import LTUASEditor from "@/components/node-stuff/editor";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface EditorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    runId: string | null;
}

export function EditorDialog({ open, onOpenChange, runId }: EditorDialogProps) {
    const router = useRouter();
    const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
    const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'success' | 'error' | 'cancelled'>('running');

    useEffect(() => {
        if (!runId || !open) return;
        const nonNullRunId = runId as string;

        let cancelled = false;
        let pollTimeout: NodeJS.Timeout;

        async function poll() {
            try {
                const status = await fetchStatus(nonNullRunId);
                if (cancelled) return;

                setPipelineStatus(status.status);

                if (status.nodes) {
                    const mappedStatuses: Record<string, NodeStatus> = {};
                    Object.entries(status.nodes).forEach(([nodeId, backendStatus]) => {
                        mappedStatuses[nodeId] = mapStatus(backendStatus);
                    });
                    setNodeStatuses(mappedStatuses);
                }

                if (status.status === 'running') {
                    pollTimeout = setTimeout(poll, 1000);
                } else if (status.status === 'success') {
                    setTimeout(() => {
                        onOpenChange(false);
                        router.push(`/output/${nonNullRunId}`);
                    }, 1500);
                }
            } catch (error: any) {
                console.error('Polling error:', error);
                if (!cancelled) {
                    setPipelineStatus('error');
                }
            }
        }

        poll();

        return () => {
            cancelled = true;
            if (pollTimeout) clearTimeout(pollTimeout);
        };
    }, [runId, open, router, onOpenChange]);

    useEffect(() => {
        if (!open) {
            setNodeStatuses({});
            setPipelineStatus('running');
        }
    }, [open]);

    if (!runId) return null;

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent className="min-w-[85vw] h-[80vh] max-h-[95vh] p-1 gap-0 flex flex-col overflow-hidden bg-zinc-50">
                <DialogHeader className="my-1">
                    <DialogTitle className="flex justify-center items-center">
                        {/* <div className="text-xs text-muted-foreground p-1 w-[5vw] rounded-xl bg-muted flex justify-center items-center border-zinc-300 border">{pipelineStatus}</div> */}
                        
                    </DialogTitle>
                </DialogHeader>
                {/* Editor - takes up remaining space */}
                <div className="flex-1 overflow-hidden min-h-0 flex flex-col justify-center items-center">
                    <div className="text-xs text-muted-foreground p-1 w-[5vw] rounded-xl bg-muted flex justify-center items-center border-zinc-300 border">{pipelineStatus}</div>
                    <LTUASEditor nodeStatuses={nodeStatuses} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
