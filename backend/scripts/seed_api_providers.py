"""
Seed script: adds the "AI API Providers" category and 12 developer API tools.
Idempotent — uses slug/id as the Firestore document ID.

Usage:
    cd backend
    python -m scripts.seed_api_providers
"""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.db.firestore_client import get_db

TODAY = "2026-09-30"

# ---------------------------------------------------------------------------
# Category
# ---------------------------------------------------------------------------

CATEGORY = {
    "slug": "ai-api-providers",
    "name": "AI API Providers",
    "description": "Developer APIs for integrating large language models, image generation, speech, and more into your own applications.",
    "icon": None,
    "active": True,
}

# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------

def ftd(credits=None, gen_limit=None, daily=None, monthly=None,
        features=None, api=None, commercial=True):
    return {
        "credits": credits,
        "generation_limit": gen_limit,
        "daily_limit": daily,
        "monthly_limit": monthly,
        "has_watermark": False,
        "watermark_details": None,
        "feature_restrictions": features,
        "api_restrictions": api,
        "commercial_use_allowed": commercial,
    }


TOOLS = [
    {
        "id": "openai-api",
        "name": "OpenAI API",
        "description": "The API behind ChatGPT. Access GPT-4o, o1, DALL-E 3, Whisper, and TTS programmatically. Pay-per-token pricing with a small free credit on signup.",
        "category_id": "ai-api-providers",
        "website_url": "https://platform.openai.com",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            credits="$5 free credit on new account signup (expires after 3 months)",
            features="Access to GPT-4o mini, GPT-4o, DALL-E 3, Whisper, TTS; pay-per-token after free credit",
            api="GPT-4o: $2.50/M input tokens, $10/M output; GPT-4o mini: $0.15/M input",
        ),
        "capabilities": ["text generation", "image generation", "speech-to-text", "text-to-speech", "embeddings", "function calling", "vision"],
        "input_types": ["text", "image", "audio"],
        "output_types": ["text", "image", "audio"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["building AI chatbots", "content generation pipelines", "voice assistants", "image generation apps", "RAG applications"],
        "limitations": ["no permanent free tier — credit expires", "costs add up at scale", "rate limits on free credit"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "gemini-api",
        "name": "Gemini API (Google AI)",
        "description": "Google's Gemini model family via API. Gemini 1.5 Flash has a generous permanent free tier — 15 requests/minute and 1 million tokens/day at no cost.",
        "category_id": "ai-api-providers",
        "website_url": "https://ai.google.dev",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            daily="1 million tokens/day on Gemini 1.5 Flash free tier",
            gen_limit="15 requests per minute on free tier",
            features="Free tier: Gemini 1.5 Flash only; Gemini 1.5 Pro and 2.0 require paid; prompts may be used to improve Google products on free tier",
            api="Gemini 1.5 Flash paid: $0.075/M input tokens (≤128k), $0.30/M output; Flash free: 0 cost within limits",
        ),
        "capabilities": ["text generation", "multimodal reasoning", "code generation", "image understanding", "long context (1M tokens)", "function calling", "embeddings"],
        "input_types": ["text", "image", "audio", "video", "document"],
        "output_types": ["text"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["high-volume text processing", "multimodal apps", "long document analysis", "cost-effective prototyping", "RAG with large documents"],
        "limitations": ["free tier: prompts used for model training", "Gemini Pro requires billing", "rate limited on free tier"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "anthropic-api",
        "name": "Anthropic Claude API",
        "description": "API access to Claude 3.5 Sonnet, Claude 3 Haiku, and Opus. Known for long context windows, safety, and strong coding/analysis performance.",
        "category_id": "ai-api-providers",
        "website_url": "https://www.anthropic.com/api",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            credits="$5 free credit on new account signup",
            features="Access to all Claude models during free credit; Claude 3 Haiku is cheapest at $0.25/M input",
            api="Claude 3.5 Sonnet: $3/M input, $15/M output; Claude 3 Haiku: $0.25/M input, $1.25/M output",
        ),
        "capabilities": ["text generation", "long document analysis", "code generation", "vision", "function calling", "200k context window"],
        "input_types": ["text", "image", "document"],
        "output_types": ["text"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["legal and contract analysis", "coding assistants", "long document Q&A", "safe AI applications", "nuanced reasoning tasks"],
        "limitations": ["free credit expires", "no image generation", "higher cost than Gemini Flash at scale"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "groq-api",
        "name": "Groq API",
        "description": "Ultra-fast inference API using custom LPU hardware. Offers Llama 3, Mixtral, and Gemma for free with generous rate limits. Best-in-class speed for real-time apps.",
        "category_id": "ai-api-providers",
        "website_url": "https://console.groq.com",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            daily="Generous daily token limits on free tier — Llama 3.3 70B: 6,000 req/day",
            monthly="Free tier: 500k tokens/day on Llama 3.3 70B",
            features="Free tier covers Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, Gemma 2 9B; no credit card required to start",
            api="Pay-as-you-go: Llama 3.3 70B $0.59/M input, $0.79/M output; 8B model $0.05/M input",
        ),
        "capabilities": ["text generation", "code generation", "fast inference", "function calling", "streaming", "vision (Llama 3.2 Vision)"],
        "input_types": ["text", "image"],
        "output_types": ["text"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["real-time chat applications", "low-latency inference", "cost-effective open-source LLM deployment", "voice assistants needing speed"],
        "limitations": ["open-source models only (no GPT-4/Claude)", "rate limits on free tier", "context window shorter than frontier models"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "mistral-api",
        "name": "Mistral AI API",
        "description": "European AI company offering strong open and proprietary models via API. Mistral Nemo and Codestral are free for testing. Strong at coding and multilingual tasks.",
        "category_id": "ai-api-providers",
        "website_url": "https://console.mistral.ai",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            features="Free tier (Experiment plan): access to all models with rate limits — no credit card required; Codestral free for coding use",
            api="Mistral Nemo: $0.15/M input; Mistral Large: $2/M input; Codestral: free for IDE plugins",
        ),
        "capabilities": ["text generation", "code generation", "multilingual", "function calling", "embeddings", "vision (Pixtral)"],
        "input_types": ["text", "image"],
        "output_types": ["text"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["European data compliance (GDPR)", "multilingual applications", "code generation (Codestral)", "cost-effective deployment", "on-premise deployment"],
        "limitations": ["free tier rate limited", "smaller ecosystem than OpenAI", "vision model still maturing"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "deepseek-api",
        "name": "DeepSeek API",
        "description": "The cheapest frontier-quality API available. DeepSeek-R1 matches o1 reasoning at ~96% lower cost. DeepSeek-V3 is highly capable at just $0.27/M input tokens.",
        "category_id": "ai-api-providers",
        "website_url": "https://platform.deepseek.com",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            credits="$5 free credit on new account signup",
            features="Access to DeepSeek-V3 and DeepSeek-R1 during free credit; cache hit pricing reduces costs further",
            api="DeepSeek-V3: $0.27/M input (cache miss), $0.07/M (cache hit); R1: $0.55/M input, $2.19/M output",
        ),
        "capabilities": ["text generation", "advanced reasoning (R1)", "code generation", "math problem solving", "function calling", "FIM (fill-in-middle)"],
        "input_types": ["text"],
        "output_types": ["text"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["cost-sensitive production apps", "complex reasoning pipelines", "math and science tasks", "code generation at scale"],
        "limitations": ["data privacy concerns for enterprise (Chinese-owned)", "no image input/output", "some content restrictions"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "together-ai",
        "name": "Together AI",
        "description": "Cloud platform for running and fine-tuning open-source AI models. Hosts Llama 3, Mistral, FLUX, and 200+ models. Competitive pricing with a free starting credit.",
        "category_id": "ai-api-providers",
        "website_url": "https://www.together.ai",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            credits="$1 free credit on signup (no credit card required)",
            features="Access to 200+ open-source models; Llama 3.3 70B at $0.88/M tokens; FLUX.1 Schnell image generation",
            api="Llama 3.3 70B: $0.88/M tokens; Llama 3.1 8B: $0.18/M; FLUX.1 Schnell: $0.003/step",
        ),
        "capabilities": ["text generation", "code generation", "image generation", "embeddings", "fine-tuning", "200+ open-source models"],
        "input_types": ["text", "image"],
        "output_types": ["text", "image"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["open-source model deployment", "model fine-tuning", "cost-effective image generation", "research and experimentation", "multi-model applications"],
        "limitations": ["$1 free credit is very small", "open-source models only", "fine-tuning requires more budget"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "huggingface-api",
        "name": "Hugging Face Inference API",
        "description": "Run thousands of open-source models via a simple API. Free tier covers many popular models. The largest open-source AI model hub with 500,000+ models.",
        "category_id": "ai-api-providers",
        "website_url": "https://huggingface.co/inference-api",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            features="Free tier: Serverless Inference API for many popular models with rate limits; no credit card required",
            api="Serverless free tier rate limited; Dedicated Endpoints from $0.032/hour (CPU) or $0.60/hour (GPU A10G)",
            monthly="Free Inference API: ~1,000 requests/day on popular models",
        ),
        "capabilities": ["text generation", "image generation", "speech-to-text", "text-to-speech", "embeddings", "image classification", "translation", "500k+ models"],
        "input_types": ["text", "image", "audio"],
        "output_types": ["text", "image", "audio"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["prototyping with open-source models", "model research", "NLP pipelines", "specialised task models (sentiment, classification)", "custom model deployment"],
        "limitations": ["free tier heavily rate limited", "model availability varies", "cold start latency on free tier", "production use needs Dedicated Endpoints (paid)"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "replicate-api",
        "name": "Replicate",
        "description": "Run open-source AI models via API with no infrastructure setup. Covers Llama, FLUX, Stable Diffusion, Whisper, and thousands of community models. Pay-per-second billing.",
        "category_id": "ai-api-providers",
        "website_url": "https://replicate.com",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            credits="Free compute time on account creation for verified users",
            features="FLUX.1 Schnell free via community model (limited); most models pay-per-second",
            api="FLUX.1 Schnell: ~$0.003/image; Llama 3.3 70B: $0.65/M tokens; Whisper: $0.0002/second of audio",
        ),
        "capabilities": ["image generation", "video generation", "text generation", "speech-to-text", "image editing", "10,000+ models", "custom model deployment"],
        "input_types": ["text", "image", "audio", "video"],
        "output_types": ["text", "image", "audio", "video"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["rapid API prototyping", "access to niche community models", "image and video generation pipelines", "no-DevOps model deployment"],
        "limitations": ["free compute is minimal", "cold start delays for rarely used models", "costs unpredictable without usage caps"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "cohere-api",
        "name": "Cohere API",
        "description": "Enterprise-focused NLP API specialising in RAG, embeddings, and text classification. Offers a free trial key for development with no credit card required.",
        "category_id": "ai-api-providers",
        "website_url": "https://cohere.com",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            features="Trial API key: free for non-commercial development and testing, rate limited to 20 calls/minute; production requires paid plan",
            api="Command R+: $2.50/M input, $10/M output; Embed v3: $0.10/M tokens; Rerank: $2/1,000 searches",
            commercial=False,
        ),
        "capabilities": ["text generation", "embeddings", "reranking", "text classification", "RAG", "multilingual", "tool use"],
        "input_types": ["text"],
        "output_types": ["text"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["enterprise search (RAG)", "document classification", "semantic search", "multilingual NLP", "reranking search results"],
        "limitations": ["free trial: non-commercial only, rate limited", "no image or audio capabilities", "less known than OpenAI for general chat"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "stability-ai-api",
        "name": "Stability AI API",
        "description": "The API behind Stable Diffusion and SDXL. Generate, edit, and upscale images programmatically. Stable Image Core starts at just $0.003 per image.",
        "category_id": "ai-api-providers",
        "website_url": "https://platform.stability.ai",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            credits="25 free credits on new account ($1 value); each Stable Image Core image costs 3 credits",
            features="Free credits give ~8 standard images; after that pay-per-image",
            api="Stable Image Core: $0.003/image; Stable Diffusion 3.5 Large: $0.065/image; Ultra: $0.08/image",
        ),
        "capabilities": ["text-to-image", "image-to-image", "inpainting", "outpainting", "upscaling", "image editing", "video generation (Stable Video)"],
        "input_types": ["text", "image"],
        "output_types": ["image", "video"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["high-volume image generation pipelines", "e-commerce product images", "creative tool integrations", "game asset generation", "marketing automation"],
        "limitations": ["25 free credits only (~8 images)", "NSFW content restrictions", "open-source models available locally for free if you have GPU"],
        "verified_date": TODAY,
        "active": True,
    },
    {
        "id": "elevenlabs-api",
        "name": "ElevenLabs API",
        "description": "The most realistic text-to-speech and voice cloning API. Build voice assistants, audiobooks, and dubbing pipelines. Free tier includes 10,000 characters/month.",
        "category_id": "ai-api-providers",
        "website_url": "https://elevenlabs.io/api",
        "pricing_type": "Freemium",
        "free_availability": True,
        "free_tier_details": ftd(
            monthly="10,000 characters per month on free tier",
            features="Free tier: 10k chars/month, access to standard voices, API available; no commercial use on free tier",
            api="Starter $5/month: 30k chars; Creator $22/month: 100k chars; API pricing by character",
            commercial=False,
        ),
        "capabilities": ["text-to-speech", "voice cloning", "speech-to-speech", "dubbing", "voice design", "streaming TTS", "30+ languages"],
        "input_types": ["text", "audio"],
        "output_types": ["audio"],
        "watermark_info": None,
        "api_available": True,
        "best_use_cases": ["voice assistant development", "audiobook generation", "podcast production tools", "video dubbing pipelines", "accessibility applications"],
        "limitations": ["10k chars/month free — very limited for production", "commercial use requires paid plan", "cloning requires audio samples"],
        "verified_date": TODAY,
        "active": True,
    },
]


# ---------------------------------------------------------------------------
# Seed function
# ---------------------------------------------------------------------------

def seed():
    db = get_db()

    # Seed category
    cat_col = db.collection("categories")
    cat_col.document(CATEGORY["slug"]).set(CATEGORY)
    print(f"  ✓ Category: {CATEGORY['name']}")

    # Seed tools
    tool_col = db.collection("tools")
    for tool in TOOLS:
        tool_col.document(tool["id"]).set(tool)
        print(f"  ✓ {tool['name']} — {tool['pricing_type']}")

    print(f"\nSeeded 1 category + {len(TOOLS)} API provider tools.")


if __name__ == "__main__":
    seed()
