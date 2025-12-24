"use client"

import { useReactFlow } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { NodeStatus } from "@/components/react-flow/node-status-indicator";






export const MellowPromptNode = memo((props: any) => {
    const data = props.data as { status?: NodeStatus };
    const status = data?.status ?? "initial";

    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);


    const nodeStatus = "initial";



    return (
        <>
            <BaseExecutionNode
                {...props}
                icon={"/soft-prompt.png"}
                name="mellow prompt"
                status={status}
                description={"this is the hardcoded prompt"}
                onSettings={handleOpenSettings}
                ondoubleClick={handleOpenSettings}
            />
        </>
    )
})

MellowPromptNode.displayName = "MellowPromptNode";