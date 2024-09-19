"use client";

import { useState, useCallback, cache } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getGemini, query } from "@/services";

export default function History() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [history, setHistory] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file));
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const removeImage = () => {
    setImage(null);
    setFile(null);
    setGeneratedText(null);
  };

  const handleGenerateHistory = async () => {
    console.log(file);
    if (file) {
      try {
        const response = await query(file);
        setGeneratedText(response.generated_text);
      } catch (error) {
        console.error("Error generating history:", error);
      }
    }
  };

  async function generateHistory(text: string) {
    try {
      const data = await getGemini(text);
      setHistory(data.message);
    } catch (error) {
      console.log("error on gemini", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl text-zinc-300 font-bold mb-4 text-center">
          Story Generator
        </h1>

        {!image ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Arraste e solte uma imagem aqui, ou clique para selecionar
            </p>
          </div>
        ) : (
          <div className="relative">
            <Image
              src={image}
              alt="Preview"
              width={400}
              height={300}
              className="w-full h-auto rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="mt-4">
          <Button
            className="w-full bg-violet-800 text-gray-50 hover:bg-violet-300 hover:text-violet-900"
            onClick={handleGenerateHistory}
            disabled={!file}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Generate Image Description
          </Button>
        </div>
        <div className="mt-4">
          <Button
            className="w-full bg-violet-800 text-gray-50 hover:bg-violet-300 hover:text-violet-900"
            onClick={() => {
              generateHistory("dois amigos");
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Generate History
          </Button>
        </div>

        {generatedText && (
          <div className="mt-4">
            <p className="text-[14px] text-justify p-4 text-zinc-700">
              {generatedText}
            </p>
          </div>
        )}

        <div className="mt-4">
          <h1 className="font-bold text-[18px]">Historia</h1>
          <p className="text-[14px] mt-[10px] text-zinc-700">{history}</p>
        </div>
      </div>
    </div>
  );
}
