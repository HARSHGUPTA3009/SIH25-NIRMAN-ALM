"use client";

import React from "react";
import { Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";

interface WorkflowNodeProps {
  children: React.ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolbar = false,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) {
  return (
    <div className="relative">
      {/* Custom toolbar */}
      {showToolbar && (
        <div className="absolute right-1 top-1 z-10 flex gap-1">
          {onSettings && (
            <Button size="icon" variant="ghost" onClick={onSettings}>
              <SettingsIcon className="size-4" />
            </Button>
          )}
          {onDelete && (
            <Button size="icon" variant="ghost" onClick={onDelete}>
              <TrashIcon className="size-4" />
            </Button>
          )}
        </div>
      )}

      {children}

      {/* Node label */}
      {name && (
        <div className="mt-1 text-center">
          <p className="text-sm font-medium">{name}</p>
          {description && (
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
