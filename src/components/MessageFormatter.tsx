import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, Check } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface MessageFormatterProps {
  text: string;
}

export default function MessageFormatter({ text }: MessageFormatterProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
  const boldRegex = /\*\*(.*?)\*\*/g;

  const parts = text.split(codeBlockRegex);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div>
      {parts.map((part, index) => {
        if (index % 3 === 2) {
          const language = parts[index - 1] || "javascript";
          const code = part.trim();

          return (
            <ScrollArea className="w-[650px]" key={`scroll-area-${index}`}>
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "100%",
                  backgroundColor: "#2e2e2e",
                  padding: "20px",
                  borderRadius: "8px",
                  margin: "10px 0",
                  border: "1px solid #333",
                  overflowX: "auto",
                  whiteSpace: "pre",
                }}
              >
                <button
                  onClick={() => handleCopy(code, index)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                  title="Copiar código"
                >
                  {copiedIndex === index ? (
                    <Check size={16} />
                  ) : (
                    <Clipboard size={16} />
                  )}
                </button>

                <SyntaxHighlighter
                  language={language}
                  style={materialDark}
                  showLineNumbers
                  customStyle={{ margin: 0 }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          );
        } else {
          const formattedText = part.split("\n").map((line, lineIndex) => {
            const lineParts = line.split(boldRegex);

            return (
              <p
                className="dark:text-slate-200"
                key={`line-${index}-${lineIndex}`}
              >
                {lineParts.map((linePart, linePartIndex) => {
                  if (linePartIndex % 2 === 1) {
                    return (
                      <strong
                        key={`linePart-${index}-${lineIndex}-${linePartIndex}`}
                      >
                        {linePart}
                      </strong>
                    );
                  } else {
                    return linePart;
                  }
                })}
              </p>
            );
          });

          return (
            <div className="dark:text-slate-200" key={`text-${index}`}>
              {formattedText}
            </div>
          );
        }
      })}
    </div>
  );
}
