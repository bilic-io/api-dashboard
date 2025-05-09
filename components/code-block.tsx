"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-go"
import "prismjs/components/prism-bash"

interface CodeBlockProps {
  code: string
  language: string
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
      });
    } else {
      alert("Nothing to copy!");
    }
  };

  return <button onClick={copyToClipboard} className="px-2 py-1 bg-gray-700 text-white rounded">Copy</button>;
};

export function CodeBlock({ code, language }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const getLanguageClass = () => {
    switch (language) {
      case "javascript":
        return "language-javascript";
      case "python":
        return "language-python";
      case "go":
        return "language-go";
      case "curl":
        return "language-bash";
      default:
        return "language-javascript";
    }
  };

  return (
    <div className="relative rounded-md border border-gray-700 bg-gray-900 text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm font-medium capitalize">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto">
        <code ref={codeRef} className={getLanguageClass()}>
          {code}
        </code>
      </pre>
    </div>
  );
}
