"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric({
  title1 = "Unlock the Power of",
  title2 = "Your Words",
}: {
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    }),
  };

  const scrollToAnalyzer = () => {
    const analyzerSection = document.getElementById('analyzer');
    if (analyzerSection) {
      analyzerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Spotlight Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-[hsl(330_70%_60%/0.05)] blur-3xl z-[1]" />

      <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-primary/[0.15]" className="left-[-10%] md:left-[-5%] top-[15%] z-[2]" />
      <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-[hsl(330_70%_60%)]/[0.15]" className="right-[-5%] md:right-[0%] top-[70%] z-[2]" />
      <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-[hsl(280_70%_60%)]/[0.15]" className="left-[5%] bottom-[5%] z-[2]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
            {title1}
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-text">
            {title2}
          </span>
        </motion.h1>

        <motion.p
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-light mb-8"
        >
          AI-powered insights to boost engagement, improve tone, and enhance readability.
        </motion.p>

        <motion.button
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          onClick={scrollToAnalyzer}
          className="px-8 py-3 rounded-full bg-gradient-primary text-foreground font-medium hover:shadow-glow transition-all duration-300"
        >
          Try it Now
        </motion.button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/40 pointer-events-none z-[3]" />
    </div>
  );
}

export { HeroGeometric };
