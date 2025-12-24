"use client"

import { useReactFlow } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { NodeStatus } from "@/components/react-flow/node-status-indicator";






export const MellowNode = memo((props: any) => {
    const data = props.data as { status?: NodeStatus };
    const status = data?.status ?? "initial";

    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);



    return (
        <>
            <BaseExecutionNode
                {...props}
                icon={"/neural.png"}
                name="Mellow model"
                status={status}
                description={"fine-tuned LTU audio model"}
                onSettings={handleOpenSettings}
                ondoubleClick={handleOpenSettings}
            />
        </>
    )
})

MellowNode.displayName = "MellowNode";