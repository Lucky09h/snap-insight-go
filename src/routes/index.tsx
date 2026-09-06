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

      <section id="analyzer" className="w-full max-w-md flex-1 flex flex-col">
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
          <h2 className="text-2xl font-bold mb-4 text-foreground">AI Image Analyzer – Analyze Images With AI</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            AI image analysis has become a practical way to understand photos without manual searching. An AI image analyzer looks at a picture, recognizes patterns, and turns them into a readable description. With SnapInfo, you can use this technology directly from your phone or computer: take a photo with your camera, upload an image from your gallery, and receive an instant breakdown of what the picture shows.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            At its core, AI image analysis is trained on large collections of labeled photos. A neural network learns relationships between shapes, colors, textures, and the words people use to describe them. When you analyze an image with AI, the model compares the patterns in your photo to what it has learned and predicts the most likely labels. The result is a plain-language summary that usually includes a name, a short description, and useful context.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            What can you learn from an AI picture analysis? In many cases, the tool can name the main subject, describe visible details, suggest possible uses, and flag related concepts. For example, a photo of a houseplant may return the species name, care hints, and a note that it prefers indirect light. A picture of a packaged snack might identify the product, list visible ingredients, and suggest common occasions when people eat it. Results vary depending on image quality, lighting, and how common the subject is in the model's training data.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            SnapInfo is designed to make this process fast and accessible. You do not need to install an app or create an account. Open the website, choose Take a photo to capture something in front of you, or tap Upload image to select a file from your device. The AI photo analyzer processes the image and returns a structured result you can read, copy, or share.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            People use AI image analyzers for many everyday tasks. Shoppers snap products in stores to compare prices online. Travelers photograph landmarks or street signs to learn names and translations. Students and hobbyists use image analysis AI to identify plants, animals, art, and historical objects. Homeowners photograph tools, parts, or appliances when they need replacements. The technology is also helpful for accessibility, providing descriptions of images for people with visual impairments.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Unlike a reverse image search, which finds visually similar pictures already on the web, an AI image analyzer understands the content of your specific photo and creates a fresh description. That means you can ask, in effect, “What is this?” and get an answer even if your exact image has never been uploaded before. This makes AI photo analysis especially useful for one-of-a-kind moments: a bird in your garden, a dish at a restaurant, or a gadget you have never seen.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Because the output is generated by AI, it is not guaranteed to be perfect every time. Unusual angles, heavy blur, low light, or rarely photographed subjects can reduce accuracy. We recommend using clear, well-lit photos for the best experience. Even when the result is approximate, it often gives you enough information to decide your next step—whether that is looking up a product, learning about a plant, or simply satisfying your curiosity.
          </p>
        </section>

        <section className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-foreground">What Can AI Image Analysis Detect?</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Objects</h3>
              <p className="text-foreground/80 leading-relaxed">
                From electronics and furniture to vehicles and clothing, AI object recognition can name the item and note key features.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Plants</h3>
              <p className="text-foreground/80 leading-relaxed">
                A leaf, flower, or whole plant can often be matched to a species, with care tips or habitat notes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Animals</h3>
              <p className="text-foreground/80 leading-relaxed">
                Pets, wildlife, and insects can be identified by shape, markings, and posture.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Food</h3>
              <p className="text-foreground/80 leading-relaxed">
                Dishes, ingredients, and packaged goods may be recognized, with serving ideas or nutritional context when visible.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Everyday items</h3>
              <p className="text-foreground/80 leading-relaxed">
                Tools, appliances, toys, and household objects are common subjects that image analyzer AI handles well.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Visible text and details</h3>
              <p className="text-foreground/80 leading-relaxed">
                Signs, labels, menus, and documents can be read when the text is clear, giving you translations or summaries.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Places and scenes</h3>
              <p className="text-foreground/80 leading-relaxed">
                Landmarks, interiors, landscapes, and city streets can be described, helping you remember or research locations.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-foreground">How to Analyze a Picture With AI</h2>
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
                Let SnapInfo analyze the image and generate a clear description.
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

        <section className="rounded-2xl bg-card border border-border p-6 shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-3 text-foreground">Try SnapInfo AI Image Analyzer Free</h2>
          <p className="text-foreground/80 leading-relaxed mb-5">
            Ready to analyze a picture with AI? Use SnapInfo as a free AI image analyzer and get useful insights in seconds.
          </p>
          <a
            href="#analyzer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Sparkles className="w-5 h-5" />
            Analyze an image now
          </a>
        </section>

        <FAQSection
          items={[
            {
              question: "What is an AI image analyzer?",
              answer:
                "An AI image analyzer is a tool that uses artificial intelligence to examine a photo and describe what it shows. SnapInfo's AI image analyzer identifies objects, explains subjects, and provides useful details in plain language.",
            },
            {
              question: "How can I analyze a picture with AI?",
              answer:
                "Open SnapInfo, tap Take a photo to use your camera or Upload image to choose a file. The AI photo analyzer processes the picture and returns a readable result you can copy or share.",
            },
            {
              question: "Can I upload a photo to SnapInfo?",
              answer:
                "Yes. Tap the Upload image button and choose any photo from your gallery or file picker. SnapInfo will analyze it immediately.",
            },
            {
              question: "Can SnapInfo identify objects in images?",
              answer:
                "Yes. SnapInfo can recognize many objects, plants, animals, food items, everyday products, visible text, and places, then describe them in a clear summary.",
            },
            {
              question: "Is SnapInfo free?",
              answer:
                "Yes, SnapInfo is a free AI image analyzer. You can upload or capture images and get AI-powered descriptions at no cost.",
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
