"use client"

import { useReactFlow } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { NodeStatus } from "@/components/react-flow/node-status-indicator";






export const AudioFileNode = memo((props: any) => {
    const data = props.data as { status?: NodeStatus };
    const status = data?.status ?? "initial";

    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);


    



    return (
        <>
            <BaseExecutionNode
                {...props}
                icon={"/audio-file.png"}
                name="Audio file"
                status={status}
                description={"Input audio file (.mp3, .wav, .flace, etc)"}
                onSettings={handleOpenSettings}
                ondoubleClick={handleOpenSettings}
            />
        </>
    )
})

AudioFileNode.displayName = "AudioFileNode";