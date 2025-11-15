import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ContentAnalyzer } from "@/components/ContentAnalyzer";

const Index = () => {
  return (
    <div className="bg-background text-foreground">
      <HeroGeometric 
        title1="Unlock the Power of" 
        title2="Your Words" 
      />
      <ContentAnalyzer />
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50">
        <p>Built with ❤️ by Vedant</p>
      </footer>
    </div>
  );
};

export default Index;
