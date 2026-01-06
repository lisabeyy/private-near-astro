"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="astro-reading">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-3xl font-bold mt-8 mb-4 text-white first:mt-0 border-b border-white/10 pb-3"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-2xl font-semibold mt-6 mb-3 text-white border-b border-white/10 pb-2"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-white" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-medium mt-4 mb-2 text-white/90" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-white/80 leading-relaxed mb-4 text-base" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-white/80 ml-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-white/80 ml-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-white/90" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-white/20 pl-4 my-4 italic text-white/70"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="bg-white/10 text-white/90 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              />
            ) : (
              <code
                className="block bg-white/5 text-white/90 p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono"
                {...props}
              />
            ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-white/10" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

