import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, Check } from "lucide-react"; // Ícones de copiar e de verificação

interface MessageFormatterProps {
  text: string;
}

export default function MessageFormatter({ text }: MessageFormatterProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Regex para identificar blocos de código e negritos
  const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
  const boldRegex = /\*\*(.*?)\*\*/g;

  // Quebra o texto em partes, incluindo código e texto comum
  const parts = text.split(codeBlockRegex);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000); // Volta ao normal após 2 segundos
  };

  return (
    <div>
      {parts.map((part, index) => {
        if (index % 3 === 2) {
          const language = parts[index - 1] || "javascript";
          const code = part.trim();

          return (
            <div
              key={index}
              style={{
                position: "relative",
                overflowX: "auto",
                backgroundColor: "#2e2e2e", // Cor de fundo escura para combinar com o tema mini
                padding: "20px",
                borderRadius: "8px",
                margin: "10px 0",
                border: "1px solid #333", // Borda para destacar o bloco de código
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
                  color: "#fff", // Cor branca para o ícone no modo dark
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
                style={materialDark} // Tema material-dark
                showLineNumbers
              >
                {code}
              </SyntaxHighlighter>
            </div>
          );
        } else {
          const formattedText = part.split("\n").map((line, lineIndex) => {
            const lineParts = line.split(boldRegex);

            return (
              <p key={lineIndex}>
                {lineParts.map((linePart, linePartIndex) => {
                  if (linePartIndex % 2 === 1) {
                    return <strong key={linePartIndex}>{linePart}</strong>;
                  } else {
                    return linePart;
                  }
                })}
              </p>
            );
          });

          return <div key={index}>{formattedText}</div>;
        }
      })}
    </div>
  );
}