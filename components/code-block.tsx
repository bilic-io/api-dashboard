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

export function CodeBlock({ code, language }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language])

  const getLanguageClass = () => {
    switch (language) {
      case "javascript":
        return "language-javascript"
      case "python":
        return "language-python"
      case "go":
        return "language-go"
      case "curl":
        return "language-bash"
      default:
        return "language-javascript"
    }
  }

  return (
    <div className="relative rounded-md bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <pre className="p-4 overflow-x-auto">
        <code ref={codeRef} className={getLanguageClass()}>
          {code}
        </code>
      </pre>
    </div>
  )
}
