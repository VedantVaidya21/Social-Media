import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "./FileUpload";

interface AnalysisResult {
  improvedCaption: string;
  hashtags: string[];
  readabilityScore: number;
  toneAnalysis: string;
  engagementTips: string[];
}

export function ContentAnalyzer() {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const { toast } = useToast();

  const handleTextExtracted = (text: string) => {
    setContent(text);
    setActiveTab("text");
    toast({
      title: "Ready to analyze",
      description: "The extracted text has been loaded. Click Analyze to continue.",
    });
  };

  const analyzeContent = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please enter some social media content first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="analyzer" className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-text">
              Analyze Your Content
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Paste your social media post and let AI enhance it
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="upload" className="gap-2">
                <FileText className="h-4 w-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Type/Paste Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <FileUpload onTextExtracted={handleTextExtracted} />
            </TabsContent>

            <TabsContent value="text">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <Textarea
                  placeholder="Paste your social media content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary/50 resize-none"
                />
                <Button
                  onClick={analyzeContent}
                  disabled={isAnalyzing}
                  className="mt-4 w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Content
                    </>
                  )}
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 space-y-6"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Improved Caption
              </h3>
              <p className="text-foreground/90 leading-relaxed">
                {result.improvedCaption}
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-semibold mb-4">Suggested Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-semibold mb-4">Readability Score</h3>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-primary">
                    {result.readabilityScore}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 10</div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-xl font-semibold mb-4">Tone Analysis</h3>
              <p className="text-foreground/90">{result.toneAnalysis}</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-xl font-semibold mb-4">Engagement Tips</h3>
              <ul className="space-y-2">
                {result.engagementTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/90">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
