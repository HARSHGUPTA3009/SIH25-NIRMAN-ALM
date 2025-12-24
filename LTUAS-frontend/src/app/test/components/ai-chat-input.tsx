"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send, AudioLinesIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDERS = [
    "Ask me anything...",
    "What would you like to know?",
    "Type your message here...",
    "How can I help you today?",
];

interface AIChatInputNewProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    disabled?: boolean;
}

const AIChatInputNew: React.FC<AIChatInputNewProps> = ({
    value,
    onChange,
    onSubmit,
    disabled = false,
}) => {
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [thinkActive, setThinkActive] = useState(false);
    const [deepSearchActive, setDeepSearchActive] = useState(false);
    const [AudioFile, setAudioFile] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive || value) return;

        const interval = setInterval(() => {
            setShowPlaceholder(false);
            setTimeout(() => {
                setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
                setShowPlaceholder(true);
            }, 400);
        }, 3000);

        return () => clearInterval(interval);
    }, [isActive, value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                if (!value) setIsActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    const handleActivate = () => setIsActive(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim() && !disabled) {
            onSubmit(value);
        }
    };

    const containerVariants: any = {
        collapsed: {
            height: 56,
            transition: { type: "spring", stiffness: 120, damping: 18 },
        },
        expanded: {
            height: 116,
            transition: { type: "spring", stiffness: 120, damping: 18 },
        },
    };

    const placeholderContainerVariants = {
        initial: {},
        animate: { transition: { staggerChildren: 0.025 } },
        exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
    };

    const letterVariants = {
        initial: { opacity: 0, filter: "blur(12px)", y: 10 },
        animate: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
                opacity: { duration: 0.25 },
                filter: { duration: 0.4 },
                y: { type: "spring" as const, stiffness: 80, damping: 20 },
            },
        },
        exit: {
            opacity: 0,
            filter: "blur(12px)",
            y: -10,
            transition: {
                opacity: { duration: 0.2 },
                filter: { duration: 0.3 },
                y: { type: "spring" as const, stiffness: 80, damping: 20 },
            },
        },
    };

    return (
        <motion.div
            ref={wrapperRef}
            className="w-full border rounded-3xl bg-background shadow-sm"
            variants={containerVariants}
            animate={isActive || value ? "expanded" : "collapsed"}
            initial="collapsed"
            onClick={handleActivate}
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex items-center gap-2 px-3 py-2">
                    <button
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        title="Attach file"
                        type="button"
                        tabIndex={-1}
                    >
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </button>

                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled}
                            className="w-full border-0 outline-0 bg-transparent text-sm py-2 disabled:opacity-50"
                            style={{ position: "relative", zIndex: 1 }}
                            onFocus={handleActivate}
                        />
                        <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center py-2">
                            <AnimatePresence mode="wait">
                                {showPlaceholder && !isActive && !value && (
                                    <motion.span
                                        key={placeholderIndex}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground select-none text-sm"
                                        variants={placeholderContainerVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                    >
                                        {PLACEHOLDERS[placeholderIndex]
                                            .split("")
                                            .map((char, i) => (
                                                <motion.span
                                                    key={i}
                                                    variants={letterVariants}
                                                    style={{ display: "inline-block" }}
                                                >
                                                    {char === " " ? "\u00A0" : char}
                                                </motion.span>
                                            ))}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <button
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        title="Voice input"
                        type="button"
                        tabIndex={-1}
                    >
                        <Mic className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button
                        className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full font-medium justify-center disabled:opacity-50 transition-colors"
                        title="Send"
                        type="submit"
                        disabled={disabled || !value.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>

                <motion.div
                    className="px-4 pb-2 flex gap-2"
                    variants={{
                        hidden: {
                            opacity: 0,
                            y: -10,
                            pointerEvents: "none" as const,
                        },
                        visible: {
                            opacity: 1,
                            y: 0,
                            pointerEvents: "auto" as const,
                            transition: { duration: 0.3, delay: 0.05 },
                        },
                    }}
                    initial="hidden"
                    animate={isActive || value ? "visible" : "hidden"}
                >
                    <button
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${deepSearchActive
                                ? "bg-primary/10 border border-primary/20 text-primary"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeepSearchActive((a) => !a);
                        }}
                    >
                        <AudioLinesIcon className="h-3.5 w-3.5" />
                        {AudioFile}
                    </button>
                </motion.div>
            </form>
        </motion.div>
    );
};

export { AIChatInputNew };
