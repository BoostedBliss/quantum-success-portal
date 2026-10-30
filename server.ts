import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Shared Gemini client helper
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Security Enhancement: Rate Limiting
  const oracleLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: { error: "Too many requests to the oracle, please try again after 15 minutes." },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // Optional AI Deep Psychological Synthesis Oracle endpoint
  app.post("/api/oracle/synthesize", oracleLimiter, async (req, res) => {
    try {
      const { chartSummary, userQuery, focusArea } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured in the environment.",
          offlineAvailable: true,
        });
      }

      const prompt = `You are a world-class depth psychologist and archetypal astrology scholar in the lineage of C.G. Jung, Liz Greene, and James Hillman. 
You are synthesizing a subject's Western natal chart, sacred geometry harmonic aspects, current transits, and holistic typologies (Enneagram, MBTI cognitive dynamics, and Gene Keys).

Natal & Typological Data:
${JSON.stringify(chartSummary, null, 2)}

User's Focus Area / Reflection: ${focusArea || "Holistic Psychological Integration"}
Specific Question or Inquiry: ${userQuery || "What are the primary archetypal tensions, shadow integrations, and current evolutionary crossroads for this psyche?"}

Provide an insightful, eloquent, non-fatalistic psychological synthesis organized with the following distinct sections:
1. THE PSYCHIC ARCHITECTURE & PERSONA: Core identity synthesis (Sun, Moon, Ascendant) through Jungian archetypes.
2. SACRED GEOMETRY & SHADOW TENSIONS: Hard aspects (squares, oppositions, T-squares) as unintegrated shadow complexes, and harmonic trines/sextiles as innate gifts.
3. MULTI-TYPOLOGY CONVERGENCE: How the astrological signature resonates with their Enneagram type, MBTI cognitive stack, and Gene Keys Life's Work.
4. CELESTIAL WEATHER & CURRENT TRANSITS: Meaningful psychological activations of the current planetary transits against their natal blueprint.
5. THREE ACTIONABLE REFLECTIONS FOR INDIVIDUATION: Concrete psychological practices or contemplation prompts.

Tone: Grounded, profound, empathetic, philosophically rich, and empowering. Avoid clichés or generic horoscopes.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        synthesis: response.text || "No synthesis generated.",
      });
    } catch (err: any) {
      console.error("Error generating synthesis:", err);
      return res.status(500).json({
        error: err?.message || "Failed to generate archetypal synthesis.",
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Astraea server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server error:", err);
});
