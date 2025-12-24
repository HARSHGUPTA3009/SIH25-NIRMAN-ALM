// components/markdown.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // or any other theme you prefer

interface MarkdownProps {
    content: string;
    className?: string;
}

export function Markdown({ content, className = '' }: MarkdownProps) {
    return (
        <div className={`prose prose-sm max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // Customize heading styles
                    h1: ({ node, ...props }) => (
                        <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-lg font-semibold mt-3 mb-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-base font-semibold mt-2 mb-1" {...props} />
                    ),
                    // Customize paragraph spacing
                    p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props} />
                    ),
                    // Style code blocks
                    code: ({ node, inline, className, children, ...props }: any) => {
                        if (inline) {
                            return (
                                <code
                                    className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-sm font-mono"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code
                                className={`block rounded-lg p-3 overflow-x-auto text-sm ${className}`}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    // Style lists
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
                    ),
                    // Style links
                    a: ({ node, ...props }) => (
                        <a
                            className="text-primary hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),
                    // Style blockquotes
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-primary/50 pl-4 italic my-2"
                            {...props}
                        />
                    ),
                    // Style tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-2">
                            <table className="min-w-full border-collapse" {...props} />
                        </div>
                    ),
                    th: ({ node, ...props }) => (
                        <th className="border border-border px-3 py-2 bg-muted font-semibold text-left" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="border border-border px-3 py-2" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
