import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createWorker } from "https://cdn.jsdelivr.net/npm/tesseract.js@5/+esm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Processing file:", file.name, "Type:", file.type);

    let extractedText = "";

    // Handle PDF files
    if (file.type === "application/pdf") {
      // For PDFs, we'll use a simple text extraction approach
      // In production, you might want to use a more robust PDF parsing library
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const textDecoder = new TextDecoder();
      
      // Simple text extraction from PDF (works for text-based PDFs)
      const pdfText = textDecoder.decode(uint8Array);
      
      // Extract text between stream markers
      const textMatches = pdfText.match(/\(([^)]+)\)/g);
      if (textMatches) {
        extractedText = textMatches
          .map((match: string) => match.slice(1, -1))
          .join(" ")
          .replace(/\\[nrt]/g, " ")
          .trim();
      }

      if (!extractedText) {
        extractedText = "Could not extract text from PDF. The PDF might be image-based or protected.";
      }
    }
    // Handle image files with OCR
    else if (file.type.startsWith("image/")) {
      console.log("Starting OCR processing...");
      
      const arrayBuffer = await file.arrayBuffer();
      const imageData = new Uint8Array(arrayBuffer);
      
      // Create Tesseract worker
      const worker = await createWorker("eng");
      
      try {
        // Perform OCR
        const { data } = await worker.recognize(imageData);
        extractedText = data.text.trim();
        console.log("OCR completed, extracted", extractedText.length, "characters");
      } finally {
        await worker.terminate();
      }

      if (!extractedText) {
        extractedText = "No text could be extracted from the image.";
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported file type" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Text extraction completed");

    return new Response(
      JSON.stringify({ text: extractedText }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in extract-text function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Text extraction failed" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
