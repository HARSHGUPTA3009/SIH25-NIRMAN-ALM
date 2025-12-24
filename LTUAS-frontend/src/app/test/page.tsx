'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { AIChatInputNew } from './components/ai-chat-input';
import { Markdown } from './components/markdown';
import { StopCircle, Bot, User } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import SonicWaveformCanvas from "@/components/sonic-waveform";
import { useAtom } from 'jotai';
import { pipelineResultAtom } from '@/state/pipeline-result';


export default function Page() {
    const [pipelineResult, setPipelineResult] = useAtom(pipelineResultAtom);
    const { messages, sendMessage, status, stop } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
            
        }),
    });
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(()=>{
        sendMessage({text:`You are ALM (Audio Language Model) assistant which answers based on the following Audio Analysis data: ${JSON.stringify(pipelineResult)}`})        
    },[])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (value: string) => {
        if (value.trim() && status === 'ready') {
            sendMessage({ text: value });
            setInput('');
        }
    };

    return (
        <main className="relative min-h-svh w-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <SonicWaveformCanvas />
            </div>
            <div className="relative z-5 flex items-center justify-center min-h-screen p-4 from-gray-50 to-gray-100/50">
                <Card className="w-full max-w-4xl h-[85vh] flex flex-col shadow-lg border-none opacity-90">
                    {/* Messages Container with Blur Overlays */}
                    <div className="relative flex-1 overflow-hidden">
                        {/* Top Blur Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-16 from-background via-background/50 to-transparent pointer-events-none z-10" />

                        {/* Scrollable Content */}
                        <CardContent className="h-full overflow-y-auto p-6">
                            <ScrollArea className="h-full w-full ">
                                {messages.length === 0 && (
                                    <div className="flex items-center justify-center h-full text-center">
                                        <div className="space-y-3">
                                            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                <Bot className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-xl font-semibold">
                                                Start a conversation
                                            </h3>
                                            <p className="text-sm text-muted-foreground max-w-sm">
                                                Ask me anything about the audio to get started
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {messages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                                }`}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className={` w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                {message.role === 'user' ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4" />
                                                )}
                                            </div>

                                            {/* Message Bubble */}
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                <div className="text-sm leading-relaxed">
                                                    {message.parts.map((part, index) =>
                                                        part.type === 'text' ? (
                                                            message.role === 'assistant' ? (
                                                                <Markdown key={index} content={part.text} />
                                                            ) : (
                                                                <span key={index}>{part.text}</span>
                                                            )
                                                        ) : null,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Streaming/Loading State */}
                                    {(status === 'submitted' || status === 'streaming') && (
                                        <div className="flex gap-3 justify-start">
                                            <div className=" w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                            <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-muted">
                                                <div className="flex items-center gap-3">
                                                    {status === 'submitted' && (
                                                        <>
                                                            <Spinner className="h-4 w-4" />
                                                            <span className="text-sm text-muted-foreground">
                                                                Thinking...
                                                            </span>
                                                        </>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => stop()}
                                                        className="ml-auto h-7 px-2"
                                                    >
                                                        <StopCircle className="h-3.5 w-3.5 mr-1.5" />
                                                        Stop
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>

                        {/* Bottom Blur Gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 from-background via-background/50 to-transparent pointer-events-none z-10" />
                    </div>

                    {/* Input Footer */}
                    <CardFooter className="px-4 py-1">
                        <AIChatInputNew
                            value={input}
                            onChange={setInput}
                            onSubmit={handleSubmit}
                            disabled={status !== 'ready'}
                        />
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}