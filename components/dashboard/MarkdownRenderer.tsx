"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  content: string;
};

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-3">
      {/* Language label + copy */}
      <div className="flex items-center justify-between bg-white/5 px-4 py-1.5 text-xs text-white/30 border-b border-white/5">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-white/30 hover:text-white/60 transition-colors"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "rgba(0,0,0,0.4)",
          fontSize: "0.8rem",
          borderRadius: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="markdown-body text-[#E9E3DF]/90 text-sm leading-relaxed">
      <ReactMarkdown
        components={{
          // Code blocks & inline code
          code({ className, children, ...props }) {
            const isInline =
              !className && typeof children === "string" && !children.includes("\n");
            if (isInline) {
              return (
                <code
                  className="bg-[#465C88]/10 text-[#FF7A30] px-1.5 py-0.5 rounded text-xs font-mono border border-[#465C88]/10"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock className={className}>
                {String(children)}
              </CodeBlock>
            );
          },
          // Strip wrapping <pre> since CodeBlock handles it
          pre({ children }) {
            return <>{children}</>;
          },
          // Headings
          h1({ children }) {
            return (
              <h1 className="text-lg font-bold text-[#E9E3DF] mt-4 mb-2 tracking-tight">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-base font-bold text-[#E9E3DF] mt-3 mb-1.5 tracking-tight">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-sm font-bold text-[#E9E3DF] mt-2 mb-1 tracking-tight">
                {children}
              </h3>
            );
          },
          // Paragraphs
          p({ children }) {
            return <p className="mb-2 last:mb-0 text-[#E9E3DF]/80">{children}</p>;
          },
          // Lists
          ul({ children }) {
            return (
              <ul className="list-disc list-inside mb-2 space-y-1 marker:text-[#465C88]">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside mb-2 space-y-1 marker:text-[#465C88]">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="text-[#E9E3DF]/70">{children}</li>;
          },
          // Bold & italic
          strong({ children }) {
            return (
              <strong className="font-bold text-[#E9E3DF]">{children}</strong>
            );
          },
          em({ children }) {
            return <em className="italic text-[#E9E3DF]/60">{children}</em>;
          },
          // Links
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF7A30] hover:text-[#FF7A30]/80 underline underline-offset-4 transition-all duration-300"
              >
                {children}
              </a>
            );
          },
          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-[#FF7A30]/40 pl-4 py-1 my-3 text-[#E9E3DF]/50 italic bg-[#FF7A30]/5 rounded-r-lg">
                {children}
              </blockquote>
            );
          },
          // Horizontal rule
          hr() {
            return <hr className="border-[#465C88]/10 my-4" />;
          },
          // Tables
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-xl border border-[#465C88]/20 bg-black/20">
                <table className="w-full text-xs">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-[#465C88]/10 text-[#465C88] font-bold uppercase tracking-widest">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="px-4 py-3 text-left border-b border-[#465C88]/20">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2.5 text-[#E9E3DF]/70 border-b border-[#465C88]/10">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
