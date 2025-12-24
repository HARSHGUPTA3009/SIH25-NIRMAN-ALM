"use client"

import { useReactFlow } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { NodeStatus } from "@/components/react-flow/node-status-indicator";






export const LLMNode = memo((props: any) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);


    const data = props.data as { status?: NodeStatus };
    const status = data?.status ?? "initial";



    return (
        <>
            <BaseExecutionNode
                {...props}
                icon={"/meta.png"}
                name="Synthesizer LLM layer"
                status={status}
                description={"meta-llama/Llama-3.1-8B"}
                onSettings={handleOpenSettings}
                ondoubleClick={handleOpenSettings}
            />
        </>
    )
})

LLMNode.displayName = "LLMNode";