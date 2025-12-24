"use client";

import { Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
} from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "../../workflow-node";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";
import { Separator } from "@/components/ui/separator";

/**
 * Minimal shapes we depend on (structural typing only)
 */
type MinimalNode = { id: string };
type MinimalEdge = { source: string; target: string };

interface BaseExecutionNodeProps {
  id?: string;
  data?: unknown;
  selected?: boolean;

  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  ondoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    status = "initial",
    onSettings,
    ondoubleClick,
  }: BaseExecutionNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes((nodes) =>
        nodes.filter((n: MinimalNode) => n.id !== id)
      );

      setEdges((edges) =>
        edges.filter(
          (e: MinimalEdge) => e.source !== id && e.target !== id
        )
      );
    };

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
        showToolbar={false}
      >
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode
            status={status}
            onDoubleClick={ondoubleClick}
            className="w-[14vw]"
          >
            <BaseNodeHeader className="flex items-center gap-2">
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={name} width={18} height={18} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              <span className="text-sm">{name}</span>
            </BaseNodeHeader>

            <Separator />

            <BaseNodeContent className="text-sm text-zinc-500">
              {description}
              {children}

              <BaseHandle
                id="target-1"
                type="target"
                position={Position.Left}
              />
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  }
);

BaseExecutionNode.displayName = "BaseExecutionNode";
