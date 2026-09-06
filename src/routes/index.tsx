import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Camera, Upload, Sparkles, RotateCcw, Loader2, Copy, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FAQSection } from "@/components/blog/faq-section";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AI Image Analyzer – Analyze Images With AI | SnapInfo" },
      {
        name: "description",
        content:
          "Use SnapInfo as a free AI image analyzer to analyze photos, identify objects, and understand images with AI. Upload an image or take a photo and get an instant AI analysis.",
      },
      {
        property: "og:title",
        content: "AI Image Analyzer – Analyze Images With AI | SnapInfo",
      },
      {
        property: "og:description",
        content:
          "Use SnapInfo as a free AI image analyzer to analyze photos, identify objects, and understand images with AI. Upload an image or take a photo and get an instant AI analysis.",
      },
      { property: "og:url", content: "https://snap-insight-go.lovable.app/" },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9377cf31-c602-4be3-a674-81143d142fe1/id-preview-a45ace0e--7171be51-f56b-4c7c-b6ee-2ba5b2228b32.lovable.app-1778180244331.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      {
        name: "twitter:title",
        content: "AI Image Analyzer – Analyze Images With AI | SnapInfo",
      },
      {
        name: "twitter:description",
        content:
          "Use SnapInfo as a free AI image analyzer to analyze photos, identify objects, and understand images with AI. Upload an image or take a photo and get an instant AI analysis.",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9377cf31-c602-4be3-a674-81143d142fe1/id-preview-a45ace0e--7171be51-f56b-4c7c-b6ee-2ba5b2228b32.lovable.app-1778180244331.png",
      },
    ],
    links: [
      { rel: "canonical", href: "https://snap-insight-go.lovable.app/" },
    ],
  }),
});

type Result = {
  name: string;
  description: string;
  uses: string[];
};

type Status = "idle" | "loading" | "result" | "error";

function Index() {
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      setStatus("error");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      setStatus("loading");
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke("analyze-image", {
        body: { imageBase64: dataUrl },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data as Result);
      setStatus("result");
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  return (
    <main
      className="min-h-screen px-5 py-8 flex flex-col items-center"
      style={{ background: "var(--gradient-soft)" }}
    >
      <header className="w-full max-w-md flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">SnapInfo</h1>
        </div>
        {status !== "idle" && (
          <button
            onClick={reset}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New
          </button>
        )}
      </header>

      <section className="w-full max-w-md flex-1 flex flex-col">
        {status === "idle" && (
          <IdleScreen
            onPick={() => fileRef.current?.click()}
            onCamera={() => cameraRef.current?.click()}
          />
        )}

        {status === "loading" && <LoadingScreen preview={preview} />}

        {status === "result" && result && <ResultScreen preview={preview} result={result} />}

        {status === "error" && (
          <div className="rounded-2xl bg-card border border-border p-6 text-center shadow-sm">
            <p className="text-destructive font-medium mb-1">Couldn't analyze image</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </section>

      <div className="w-full max-w-md mt-12 space-y-10">
        <section className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-3 text-foreground">Free AI Image Analyzer</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            SnapInfo is a free AI image analyzer that helps you understand any photo in seconds. Use your device camera to take a picture, or upload an image from your gallery, and let our AI photo analyzer identify objects, describe subjects, and deliver useful details you can read, copy, or share instantly.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Whether you want to analyze an image with AI, identify objects from images, or simply learn more about what you see, SnapInfo makes image analysis AI fast, easy, and accessible.
          </p>
        </section>

        <section className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-foreground">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                1
              </span>
              <span className="text-foreground/80 leading-relaxed pt-0.5">
                Take a photo with your camera or upload an image from your device.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                2
              </span>
              <span className="text-foreground/80 leading-relaxed pt-0.5">
                Let SnapInfo AI analyze it and generate a clear description.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                3
              </span>
              <span className="text-foreground/80 leading-relaxed pt-0.5">
                Read the result, then copy or share it anywhere.
              </span>
            </li>
          </ol>
        </section>
      </div>

      <div className="w-full max-w-md">
        <FAQSection
          items={[
            {
              question: "What is an AI image analyzer?",
              answer:
                "An AI image analyzer is a tool that uses artificial intelligence to examine a photo and describe what it shows. SnapInfo's AI image analyzer identifies objects, explains subjects, and provides useful details in plain language.",
            },
            {
              question: "Can SnapInfo analyze any image?",
              answer:
                "SnapInfo works best with clear photos of objects, plants, animals, products, food, and everyday scenes. Very blurry, dark, or abstract images may return less accurate results.",
            },
            {
              question: "Can I upload a photo from my device?",
              answer:
                "Yes. Tap the Upload image button and choose any photo from your gallery or file picker. SnapInfo will analyze it immediately.",
            },
            {
              question: "Is SnapInfo free to use?",
              answer:
                "Yes, SnapInfo is a free AI image analyzer. You can upload or capture images and get AI-powered descriptions at no cost.",
            },
            {
              question: "Can I take a photo directly with my camera?",
              answer:
                "Yes. Tap Take a photo to open your device camera, snap a picture, and SnapInfo will analyze it right away.",
            },
          ]}
        />
      </div>

      <footer className="mt-10 text-xs text-muted-foreground">
        Powered by AI · Snap, learn, repeat
      </footer>
    </main>
  );
}

function IdleScreen({ onPick, onCamera }: { onPick: () => void; onCamera: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="w-full aspect-square max-w-xs rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
        <Camera className="w-24 h-24 text-primary-foreground relative z-10" strokeWidth={1.2} />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Identify anything</h2>
      <p className="text-muted-foreground mb-8 text-balance">
        Snap a photo and get the name, description, and common uses in seconds.
      </p>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onCamera}
          className="w-full py-4 rounded-2xl text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <Camera className="w-5 h-5" />
          Take a photo
        </button>
        <button
          onClick={onPick}
          className="w-full py-4 rounded-2xl bg-card border border-border text-foreground font-semibold inline-flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
        >
          <Upload className="w-5 h-5" />
          Upload image
        </button>
      </div>
    </div>
  );
}

function LoadingScreen({ preview }: { preview: string | null }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="relative w-full aspect-square max-w-xs rounded-3xl mb-8 overflow-hidden"
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        {preview && (
          <img src={preview} alt="Uploaded" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-card/90 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-lg">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm font-medium text-foreground">Analyzing…</span>
          </div>
        </div>
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
          <div
            className="h-full w-1/2 animate-[scan_1.6s_ease-in-out_infinite]"
            style={{ background: "var(--gradient-primary)" }}
          />
        </div>
      </div>
      <p className="text-muted-foreground text-sm">Looking carefully at your image…</p>
      <style>{`@keyframes scan { 0% { transform: translateX(-100%);} 100% { transform: translateX(200%);} }`}</style>
    </div>
  );
}

function ResultScreen({ preview, result }: { preview: string | null; result: Result }) {
  const [notice, setNotice] = useState<string | null>(null);

  const resultText = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Name: ${result.name}`);
    lines.push("");
    lines.push("Description:");
    lines.push(result.description);
    if (result.uses?.length) {
      lines.push("");
      lines.push("Benefits & Uses:");
      result.uses.forEach((use) => lines.push(`• ${use}`));
    }
    lines.push("");
    lines.push("Analyzed with SnapInfo AI");
    return lines.join("\n");
  }, [result]);

  const showNotice = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(null), 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      showNotice("Result copied!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SnapInfo: ${result.name}`,
          text: resultText,
        });
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error(e);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(resultText);
        showNotice("Result copied — you can share it anywhere.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {preview && (
        <div
          className="w-full aspect-video rounded-2xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <img src={preview} alt={result.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
          Identified
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
          {result.name}
        </h2>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
          Description
        </p>
        <p className="text-base text-foreground/85 leading-relaxed">{result.description}</p>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
          Benefits & Uses
        </p>
        <ul className="flex flex-col gap-3">
          {result.uses.map((use, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "var(--gradient-primary)" }}
              />
              <span className="text-foreground/90 text-[15px] leading-relaxed">{use}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="py-3.5 rounded-2xl text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Copy className="w-4 h-4" />
            Copy Result
          </button>
          <button
            onClick={handleShare}
            className="py-3.5 rounded-2xl text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Share2 className="w-4 h-4" />
            Share Result
          </button>
        </div>
        {notice && (
          <p className="text-center text-sm font-medium text-primary animate-in fade-in">
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}
