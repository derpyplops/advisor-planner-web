"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  FileText, Users, TrendingUp, Package, Presentation, Star,
  Mic, MicOff, Loader2, ChevronRight, ArrowLeft
} from "lucide-react";

type Feature = "meeting" | "summary" | "scenario" | "recommendations" | "presentation" | "feedback" | null;

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<Feature>(null);

  const features = [
    {
      id: "meeting" as const,
      title: "Meeting Analysis",
      description: "Structure client meeting transcripts into actionable notes",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: "summary" as const,
      title: "Client Summary",
      description: "Generate client-friendly summaries from meeting notes",
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      id: "scenario" as const,
      title: "Scenario Planning",
      description: "Create three financial scenarios for client situations",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      id: "recommendations" as const,
      title: "Product Recommendations",
      description: "Get AI-powered product recommendations with fit analysis",
      icon: Package,
      color: "bg-cyan-500",
    },
    {
      id: "presentation" as const,
      title: "Presentation Outline",
      description: "Generate structured presentation outlines for client meetings",
      icon: Presentation,
      color: "bg-teal-500",
    },
    {
      id: "feedback" as const,
      title: "Training Feedback",
      description: "Receive performance scores and coaching tips",
      icon: Star,
      color: "bg-amber-500",
    },
  ];

  if (activeFeature) {
    return (
      <FeatureView 
        feature={activeFeature} 
        onBack={() => setActiveFeature(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-xl" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Advisor Planner</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Financial Advisory Training Platform</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Train Smarter, Advise Better
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            AI-powered tools to help financial advisors structure meetings, plan scenarios, 
            and improve their client interactions
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                      {feature.title}
                      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-4xl font-bold text-primary mb-2">6</div>
            <div className="text-slate-500 dark:text-slate-400">AI-Powered Features</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-4xl font-bold text-emerald-500 mb-2">Real-time</div>
            <div className="text-slate-500 dark:text-slate-400">Analysis & Feedback</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-4xl font-bold text-purple-500 mb-2">Audio</div>
            <div className="text-slate-500 dark:text-slate-400">Recording & Transcription</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureView({ feature, onBack }: { feature: Feature; onBack: () => void }) {
  const [input, setInput] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const featureConfig: Record<string, { title: string; placeholder: string; secondaryPlaceholder?: string; color: string }> = {
    meeting: {
      title: "Meeting Analysis",
      placeholder: "Paste your meeting transcript here, or use the microphone to record...",
      color: "bg-blue-500",
    },
    summary: {
      title: "Client Summary Generator",
      placeholder: "Paste the meeting notes or structured analysis here...",
      color: "bg-indigo-500",
    },
    scenario: {
      title: "Scenario Planning",
      placeholder: "Describe the client profile (age, income, goals, risk tolerance, current assets, etc.)...",
      color: "bg-purple-500",
    },
    recommendations: {
      title: "Product Recommendations",
      placeholder: "Describe the client's needs and situation...",
      secondaryPlaceholder: "List available products/services (one per line)...",
      color: "bg-cyan-500",
    },
    presentation: {
      title: "Presentation Outline",
      placeholder: "Enter the presentation topic...",
      secondaryPlaceholder: "Describe the client context and goals...",
      color: "bg-teal-500",
    },
    feedback: {
      title: "Training Feedback",
      placeholder: "Paste the advisor-client interaction transcript here...",
      color: "bg-amber-500",
    },
  };

  const config = featureConfig[feature!];

  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature,
          input,
          secondaryInput: secondaryInput || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      // Format result for display
      if (typeof data.result === "object") {
        setResult(JSON.stringify(data.result, null, 2));
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };



  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingTime(0);
      
      const interval = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
      
      // Store interval ID for cleanup
      (window as any).recordingInterval = interval;
      (window as any).mediaStream = stream;
    } catch (error) {
      alert("Could not access microphone. Please grant permission and try again.");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval((window as any).recordingInterval);
    
    const stream = (window as any).mediaStream;
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    
    // Simulate transcription
    setInput(prev => prev + "\n[Transcribed audio: Client discussed retirement goals and risk tolerance. Mentioned concern about market volatility and desire to fund children's education.]");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderResult = () => {
    if (!result) return null;
    
    try {
      const parsed = JSON.parse(result);
      return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Analysis Results</h3>
          <pre className="whitespace-pre-wrap text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-xl overflow-auto max-h-[500px] text-slate-700 dark:text-slate-300">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </div>
      );
    } catch {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Generated Summary</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{result}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className={`${config.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4`}>
            {feature === "meeting" && <FileText size={32} />}
            {feature === "summary" && <Users size={32} />}
            {feature === "scenario" && <TrendingUp size={32} />}
            {feature === "recommendations" && <Package size={32} />}
            {feature === "presentation" && <Presentation size={32} />}
            {feature === "feedback" && <Star size={32} />}
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{config.title}</h1>
        </div>

        {!result ? (
          <div className="space-y-6">
            {/* Audio Recording for Meeting Analysis */}
            {feature === "meeting" && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Record Meeting Audio</h3>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-3 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors"
                  >
                    <Mic size={20} />
                    Start Recording
                  </button>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                    >
                      <MicOff size={20} />
                      Stop Recording
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Main Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {feature === "meeting" ? "Meeting Transcript" : "Input"}
              </label>
              <textarea
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder={config.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isRecording}
              />
            </div>

            {/* Secondary Input (for features that need two inputs) */}
            {config.secondaryPlaceholder && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Additional Information
                </label>
                <textarea
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder={config.secondaryPlaceholder}
                  value={secondaryInput}
                  onChange={(e) => setSecondaryInput(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !input.trim() || isRecording}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {renderResult()}
            
            <button
              onClick={() => {
                setResult(null);
                setInput("");
                setSecondaryInput("");
              }}
              className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
