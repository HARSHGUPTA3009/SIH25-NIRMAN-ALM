"use client";


import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

export const ClapNode = memo((props: any) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    // Cast data to access status property
    const data = props.data as { status?: NodeStatus };
    const status = data?.status ?? "initial";

    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <BaseExecutionNode
            {...props}
            icon="/clap-model.png"
            name="CLAP model"
            status={status}
            description="BART based sound classification model"
            onSettings={handleOpenSettings}
            ondoubleClick={handleOpenSettings}
        />
    );
});

ClapNode.displayName = "ClapNode";
