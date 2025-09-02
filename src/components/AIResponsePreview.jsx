import React, { useState } from "react";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const AIResponsePreview = ({ content }) => {
  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-[15px] prose prose-slate dark:prose-invert max-w-none leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const isInline = !className;

              return !isInline ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={language}
                />
              ) : (
                <code
                  className="px-1 py-0.5 bg-gray-200 rounded text-sm font-mono text-pink-700"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p({ children }) {
              return <p className="mb-3">{children}</p>;
            },
            strong({ children }) {
              return (
                <strong className="font-extrabold text-black dark:text-white bg-yellow-300 px-1 py-0.5 rounded shadow-sm">
                  {children}
                </strong>
              );
            },
            em({ children }) {
              return <em className="italic text-gray-700">{children}</em>;
            },
            ul({ children }) {
              return (
                <ul className="list-disc pl-6 space-y-1 my-2 marker:text-yellow-500">
                  {children}
                </ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="list-decimal pl-6 space-y-1 my-2 marker:text-yellow-500">
                  {children}
                </ol>
              );
            },
            li({ children }) {
              return <li className="mb-1">{children}</li>;
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-yellow-400 pl-4 italic my-3 text-gray-700 bg-yellow-50 rounded">
                  {children}
                </blockquote>
              );
            },
            h1({ children }) {
              return <h1 className="text-2xl font-bold mt-5 mb-3">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>;
            },
            h4({ children }) {
              return (
                <h4 className="text-base font-semibold mt-3 mb-1">{children}</h4>
              );
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto my-3">
                  <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg shadow-sm">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="bg-gray-100">{children}</thead>;
            },
            tbody({ children }) {
              return (
                <tbody className="divide-y divide-gray-200">{children}</tbody>
              );
            },
            th({ children }) {
              return (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-50">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                  {children}
                </td>
              );
            },
            hr() {
              return <hr className="my-5 border-gray-300" />;
            },
            img({ src, alt }) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="my-3 max-w-full rounded-lg shadow-sm"
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden shadow-xl border border-gray-700">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center space-x-2">
          <LuCode size={16} className="text-white" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="text-white hover:text-gray-200 focus:outline-none relative group"
          aria-label="Copy code"
        >
          {copied ? (
            <LuCheck size={16} className="text-green-300" />
          ) : (
            <LuCopy size={16} />
          )}
          {copied && (
            <span className="absolute -top-8 right-0 bg-black text-white text-xs rounded-md px-2 py-1 opacity-90 group-hover:opacity-100 transition">
              Copied!
            </span>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          fontSize: 13,
          margin: 0,
          padding: "1rem",
          borderRadius: "0 0 12px 12px",
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default AIResponsePreview;
