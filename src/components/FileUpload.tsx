import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, File, X, Loader2, Copy, Check } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
}

export function FileUpload({ onTextExtracted }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setUploadProgress(0);
    setIsExtracting(true);
    setExtractedText("");

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-text`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error("Text extraction failed");
      }

      const data = await response.json();
      setExtractedText(data.text);
      toast({
        title: "Text extracted successfully",
        description: "You can now review and analyze the extracted content.",
      });
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: "Extraction failed",
        description: "Failed to extract text from the file. Please try again.",
        variant: "destructive",
      });
      setFile(null);
      setUploadProgress(0);
    } finally {
      setIsExtracting(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled: isExtracting,
  });

  const removeFile = () => {
    setFile(null);
    setExtractedText("");
    setUploadProgress(0);
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied successfully.",
    });
  };

  const analyzeText = () => {
    onTextExtracted(extractedText);
  };

  return (
    <div className="space-y-6">
      {!file && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            {...getRootProps()}
            className={`p-12 border-2 border-dashed transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Upload your content
                </h3>
                <p className="text-muted-foreground">
                  Drag and drop a PDF or image here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports: PDF, PNG, JPG, JPEG, WEBP
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              {!isExtracting && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isExtracting && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Extracting text...</span>
                  <span className="text-primary font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </Card>

          {extractedText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Extracted Text</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyText}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-background/50 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
                  <p className="text-foreground/90 whitespace-pre-wrap">
                    {extractedText}
                  </p>
                </div>
                <Button
                  onClick={analyzeText}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Analyze This Text
                </Button>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}

      {isExtracting && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing your file...</span>
        </div>
      )}
    </div>
  );
}
