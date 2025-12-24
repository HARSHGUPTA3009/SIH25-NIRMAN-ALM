"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { SoftPromptNode } from './executions/components/soft-prompt-node/node';
import { MellowPromptNode } from './executions/components/mellow-prompt-node/node';
import { AudioFileNode } from './executions/components/audio-file-node/node';
import { ClapNode } from './executions/components/clap-node/node';
import { WhisperNode } from './executions/components/whisper-node/node';
import { LLMNode } from './executions/components/llm-node/node';
import { MellowNode } from './executions/components/mellow-node/node';
import { OutputNode } from './executions/components/output-node/node';
import type { NodeStatus } from '@/lib/api';

const nodeTypes = {
    softprompt: SoftPromptNode,
    mellowprompt: MellowPromptNode,
    audiofile: AudioFileNode,
    clapmodel: ClapNode,
    whispermodel: WhisperNode,
    llmlayer: LLMNode,
    mellowmodel: MellowNode,
    jsonoutput: OutputNode,
};

const createInitialNodes = () => [
    {
        id: 'user-prompt',
        type: 'softprompt',
        position: { x: 100, y: 60 },
        data: { status: 'initial' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: 'describe-audio',
        type: 'mellowprompt',
        position: { x: 100, y: 210 },
        data: { status: 'initial' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: 'audio-file',
        type: 'audiofile',
        position: { x: 100, y: 370 },
        data: { status: 'initial' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: 'clap',
        type: 'clapmodel',
        position: { x: 490, y: 110 },
        data: { status: 'initial' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: 'whisper',
        type: 'whispermodel',
        position: { x: 490, y: 340 },
        data: { status: 'initial' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: 'llm-layer',
        type: 'llmlayer',
        position: { x: 760, y: 230 },
        data: { status: 'initial' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: 'mellow',
        type: 'mellowmodel',
        position: { x: 1030, y: 150 },
        data: { status: 'initial' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
    {
        id: 'json-output',
        type: 'jsonoutput',
        position: { x: 1300, y: 250 },
        data: { status: 'initial' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
    },
];

const initialEdges = [
    { id: 'e1', source: 'user-prompt', target: 'clap', animated: true, style: { stroke: '#94a3b8', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e2', source: 'user-prompt', target: 'llm-layer', animated: true, style: { stroke: '#94a3b8', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e3', source: 'describe-audio', target: 'llm-layer', animated: false, style: { stroke: '#cbd5e1', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e4', source: 'describe-audio', target: 'clap', animated: false, style: { stroke: '#cbd5e1', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e5', source: 'audio-file', target: 'clap', animated: false, style: { stroke: '#e2e8f0', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e6', source: 'audio-file', target: 'whisper', animated: false, style: { stroke: '#e2e8f0', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e7', source: 'clap', target: 'llm-layer', animated: false, style: { stroke: '#06b6d4', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e8', source: 'whisper', target: 'llm-layer', animated: false, style: { stroke: '#06b6d4', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e9', source: 'audio-file', target: 'mellow', animated: false, style: { stroke: '#e9d5ff', strokeWidth: 1, strokeDasharray: '5,5' }, type: 'default' as const },
    { id: 'e10', source: 'clap', target: 'mellow', animated: false, style: { stroke: '#c7d2fe', strokeWidth: 1, strokeDasharray: '5,5' }, type: 'default' as const },
    { id: 'e11', source: 'whisper', target: 'mellow', animated: false, style: { stroke: '#c7d2fe', strokeWidth: 1, strokeDasharray: '5,5' }, type: 'default' as const },
    { id: 'e12', source: 'llm-layer', target: 'mellow', animated: true, style: { stroke: '#3b82f6', strokeWidth: 1 }, type: 'default' as const },
    { id: 'e13', source: 'mellow', target: 'json-output', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 1 }, type: 'default' as const },
];

interface LTUASEditorProps {
    nodeStatuses: Record<string, NodeStatus>;
}

export default function LTUASEditor({ nodeStatuses }: LTUASEditorProps) {
    const [nodes, setNodes] = useState(() => createInitialNodes());
    const [edges, setEdges] = useState(() => initialEdges);

    useEffect(() => {
        setNodes((prevNodes: any) =>
            prevNodes.map((node: any) => ({
                ...node,
                data: {
                    ...node.data,
                    status: nodeStatuses[node.id] || node.data.status || 'initial',
                },
            }))
        );
    }, [nodeStatuses]);

    const onNodesChange = useCallback(
        (changes: any) =>
            setNodes((nds: any) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: any) =>
            setEdges((eds: any) => applyEdgeChanges(changes, eds)),
        []
    );

    return (
        <div style={{ width: '100%', height: '100%', background: '#fafafa' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                minZoom={0.8}
                maxZoom={0.8}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                nodesDraggable={false}
                panOnDrag={false}
                nodesConnectable={false}
                connectOnClick={false}
            />
        </div>
    );
}