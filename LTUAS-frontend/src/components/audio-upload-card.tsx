"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";

interface AudioUploadCardProps {
    className?: string;
    onFileSelect?: (file: File) => void;
    onFileRemove?: () => void;
    selectedFile?: File;
    disabled?: boolean;
    error?: string;
}

interface WaveformProps {
    width?: number;
    height?: number;
    bars?: number;
}

interface UploadCardBaseProps {
    children?: React.ReactNode;
    className?: string;
    isDragOver?: boolean;
    isUploading?: boolean;
    hasError?: boolean;
}

const Waveform = ({ width = 300, height = 40, bars = 60 }: WaveformProps) => {
    const [barsArray, setBarsArray] = useState<React.ReactElement[]>([]);

    useEffect(() => {
        const barWidth = (width / bars) * 0.5;
        const spacing = (width / bars) * 0.4;
        const centerY = height / 2;
        const cornerRadius = barWidth * 0.7;

        const newBarsArray = [];
        const totalBarsWidth = (barWidth + spacing) * bars - spacing;
        const startX = (width - totalBarsWidth) / 2;

        for (let i = 0; i < bars; i++) {
            const x = startX + i * (barWidth + spacing);
            const barHeight = Math.random() * (height * 0.6) + height * 0.1;
            const topY = centerY - barHeight / 2;

            newBarsArray.push(
                <rect
                    key={i}
                    x={x}
                    y={topY}
                    width={barWidth}
                    height={barHeight}
                    rx={cornerRadius}
                    ry={cornerRadius}
                    fill="currentColor"
                    className="text-muted-foreground/60"
                />
            );
        }

        setBarsArray(newBarsArray);
    }, [width, height, bars]);

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {barsArray}
        </svg>
    );
};

const UploadCardBase = ({
    children,
    className,
    isDragOver = false,
    isUploading = false,
    hasError = false,
}: UploadCardBaseProps) => {
    const hasChildren = React.Children.count(children) > 0;

    return (
        <div
            className={cn(
                "rounded-xl border-2 border-dashed p-6 backdrop-blur-sm min-h-[120px] flex items-center justify-center relative transition-colors duration-200",
                !isUploading && "cursor-pointer hover:bg-accent/20",
                isUploading
                    ? "bg-primary/20 border-primary/60"
                    : hasError
                        ? "bg-red-50 dark:bg-red-950/20 border-red-500"
                        : isDragOver
                            ? "bg-accent/40 border-accent/80 shadow-inner"
                            : "bg-card border-border/60",
                className
            )}
        >
            {!hasChildren && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Upload
                        size={48}
                        className={cn(
                            "transition-colors duration-200",
                            hasError
                                ? "text-red-500"
                                : isDragOver
                                    ? "text-primary"
                                    : "text-muted",
                            isUploading && "text-primary"
                        )}
                    />
                </div>
            )}
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
};

const truncateFilename = (filename: string, maxLength: number = 20) => {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split(".").pop();
    const nameWithoutExt = filename.replace(`.${extension}`, "");
    const truncatedName = nameWithoutExt.substring(
        0,
        maxLength - 3 - extension!.length
    );
    return `${truncatedName}...${extension}`;
};

interface AudioComponentProps {
    isAnimating: boolean;
    onAnimationComplete?: () => void;
    filename?: string;
    onRemove?: () => void;
}

const AudioComponent = ({
    isAnimating,
    onAnimationComplete,
    filename = "audio.mp3",
    onRemove,
}: AudioComponentProps) => {
    const [isRemoving, setIsRemoving] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        if (isAnimating) {
            setShouldShow(true);
        }
    }, [isAnimating]);

    if (!shouldShow && !isRemoving) return null;

    const displayName = truncateFilename(filename);

    const handleRemove = () => {
        setIsRemoving(true);
    };

    const handleRemoveComplete = () => {
        setShouldShow(false);
        setIsRemoving(false);
        onRemove?.();
    };

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    className="absolute z-20"
                    initial={{
                        right: 20,
                        bottom: 20,
                        opacity: 0,
                    }}
                    animate={
                        isRemoving
                            ? {
                                scale: 0,
                                opacity: 0,
                                filter: "blur(8px)",
                                transition: {
                                    duration: 0.4,
                                    ease: [0.23, 1, 0.32, 1],
                                },
                            }
                            : {
                                left: "50%",
                                top: "calc(50% - 15px)",
                                x: "-50%",
                                y: "-50%",
                                opacity: 1,
                                transition: {
                                    duration: 0.6,
                                    ease: [0.23, 1, 0.32, 1],
                                },
                            }
                    }
                    exit={{
                        scale: 0,
                        opacity: 0,
                        filter: "blur(8px)",
                        transition: {
                            duration: 0.4,
                            ease: [0.23, 1, 0.32, 1],
                        },
                    }}
                    style={{
                        transformOrigin: "center",
                    }}
                    onAnimationComplete={
                        isRemoving ? handleRemoveComplete : onAnimationComplete
                    }
                >
                    <motion.div
                        initial={{ scale: 1.5 }}
                        animate={
                            isRemoving
                                ? { scale: 0, transition: { duration: 0.4 } }
                                : {
                                    scale: [1.1, 1.0],
                                    transition: {
                                        duration: 0.8,
                                        ease: [0.68, -0.55, 0.265, 1.55],
                                    },
                                }
                        }
                        className="rounded-lg border border-border/30 bg-muted px-2 py-1.5 backdrop-blur-sm shadow-lg relative group"
                    >
                        <button
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 z-30"
                        >
                            <X size={12} />
                        </button>

                        <div className="w-full flex items-center justify-center">
                            <Waveform width={180} height={32} bars={40} />
                        </div>
                        <div className="">
                            <span className="text-xs text-foreground/60 font-medium text-left">
                                {displayName}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export function AudioUploadCard({
    className,
    onFileSelect,
    onFileRemove,
    selectedFile,
    disabled = false,
    error,
}: AudioUploadCardProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedFile) {
            setIsUploading(true);
            setTimeout(() => {
                setIsUploading(false);
                setIsAnimating(true);
            }, 200);
        } else {
            setIsAnimating(false);
        }
    }, [selectedFile]);

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            if (disabled) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(true);
        },
        [disabled]
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            if (disabled) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);

            const files = Array.from(e.dataTransfer.files);
            const audioFile = files.find((file) => file.type.startsWith("audio/"));

            if (audioFile) {
                onFileSelect?.(audioFile);
            }
        },
        [disabled, onFileSelect]
    );

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (disabled) return;
            const file = e.target.files?.[0];
            if (file && file.type.startsWith("audio/")) {
                onFileSelect?.(file);
            }
        },
        [disabled, onFileSelect]
    );

    const handleRemoveFile = useCallback(() => {
        setIsAnimating(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onFileRemove?.();
    }, [onFileRemove]);

    const handleBaseClick = useCallback(() => {
        if (!disabled && !selectedFile) {
            fileInputRef.current?.click();
        }
    }, [disabled, selectedFile]);

    return (
        <motion.div
            className={cn("relative w-full", className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div
                className={cn(
                    "relative overflow-hidden rounded-xl border bg-card p-6",
                    error ? "border-red-500" : "border-emerald-400"
                )}
            >
                <div className="flex flex-col justify-center space-y-6">
                    <div className="relative w-full mx-auto">
                        <div
                            className="relative"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleBaseClick}
                        >
                            <UploadCardBase
                                isDragOver={isDragOver}
                                isUploading={isUploading}
                                hasError={!!error}
                            />

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/*"
                                onChange={handleFileSelect}
                                disabled={disabled}
                                className="sr-only"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-start">
                        <h3 className="text-base font-semibold text-foreground">
                            Upload Your Audio
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Drop your audio file here or click to browse
                        </p>
                    </div>
                </div>

                <AudioComponent
                    isAnimating={isAnimating}
                    filename={selectedFile?.name}
                    onRemove={handleRemoveFile}
                />
            </div>
        </motion.div>
    );
}
