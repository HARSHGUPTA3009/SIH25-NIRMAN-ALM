"use client";

import React, { forwardRef, type ReactNode } from "react";
import { Handle, Position } from "@xyflow/react";

import { BaseNode } from "@/components/react-flow/base-node";

/**
 * Minimal props for PlaceholderNode.
 * DO NOT depend on XYFlow NodeProps (removed in v12+).
 */
export interface PlaceholderNodeProps {
  id?: string;
  selected?: boolean;
  data?: unknown;

  children?: ReactNode;
  onClick?: () => void;
}

export const PlaceholderNode = forwardRef<
  HTMLDivElement,
  PlaceholderNodeProps
>(({ children, onClick }, ref) => {
  return (
    <BaseNode
      ref={ref}
      className="w-auto h-auto border-none bg-card p-4 text-center text-gray-400 shadow-md cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all"
      onClick={onClick}
    >
      {children}

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{ visibility: "hidden" }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{ visibility: "hidden" }}
      />
    </BaseNode>
  );
});

PlaceholderNode.displayName = "PlaceholderNode";
