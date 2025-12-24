"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchStatus, mapStatus, type NodeStatus } from "@/lib/api";
import LTUASEditor from "@/components/node-stuff/editor";

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const runId = params.runId as string;

    const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
    const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'success' | 'error' | 'cancelled'>('running');

    useEffect(() => {
        if (!runId) return;

        let cancelled = false;
        let pollTimeout: NodeJS.Timeout;

        async function poll() {
            try {
                const status = await fetchStatus(runId);
                if (cancelled) return;

                setPipelineStatus(status.status);

                // Map backend statuses to frontend statuses
                if (status.nodes) {
                    const mappedStatuses: Record<string, NodeStatus> = {};
                    Object.entries(status.nodes).forEach(([nodeId, backendStatus]) => {
                        mappedStatuses[nodeId] = mapStatus(backendStatus);
                    });
                    setNodeStatuses(mappedStatuses);
                }

                // Continue polling if still running
                if (status.status === 'running') {
                    pollTimeout = setTimeout(poll, 1000);
                } else if (status.status === 'success') {
                    // Redirect to output page after a short delay
                    setTimeout(() => {
                        router.push(`/output/${runId}`);
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
    }, [runId, router]);

    return (
        <div className="h-screen flex flex-col">
            {/* Status Bar */}
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${pipelineStatus === 'running' ? 'bg-blue-500 animate-pulse' :
                            pipelineStatus === 'success' ? 'bg-green-500' :
                                pipelineStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                    <span className="font-medium">
                        {pipelineStatus === 'running' && 'Pipeline Executing...'}
                        {pipelineStatus === 'success' && 'Pipeline Completed!'}
                        {pipelineStatus === 'error' && 'Pipeline Failed'}
                    </span>
                </div>
                <div className="text-sm text-slate-400">
                    Run ID: {runId.slice(0, 8)}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <LTUASEditor nodeStatuses={nodeStatuses} />
            </div>
        </div>
    );
}
