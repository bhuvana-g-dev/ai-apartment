"""
Seed batch 4 — adds widely used AI apps missing from the catalogue,
spread across every room.

Free-tier limits change frequently. Where exact numbers are not stable,
the record describes the limit type and points users to the vendor's site
rather than inventing a figure.

Idempotent — uses tool ID as Firestore document ID.
Every record is validated against ToolRecord before anything is written.

Usage:
    cd backend
    python -m scripts.seed_tools_batch4            # validate + write
    python -m scripts.seed_tools_batch4 --dry-run  # validate only
"""

import os, sys, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

TODAY = datetime.date.today().isoformat()
CHECK = "Exact limits change often — check the vendor site for current numbers."


def ftd(credits=None, gen_limit=None, daily=None, monthly=None, watermark=False,
        watermark_details=None, features=None, api=None, commercial=True):
    return {
        "credits": credits, "generation_limit": gen_limit,
        "daily_limit": daily, "monthly_limit": monthly,
        "has_watermark": watermark, "watermark_details": watermark_details,
        "feature_restrictions": features, "api_restrictions": api,
        "commercial_use_allowed": commercial,
    }


def tool(**kw):
    """Fill shared defaults so each record stays short."""
    kw.setdefault("watermark_info", None)
    kw.setdefault("verified_date", TODAY)
    kw.setdefault("active", True)
    if not kw["free_availability"]:
        kw["free_tier_details"] = None   # rule: null when no free tier
    return kw


TOOLS = [

    # ── CHAT AI ────────────────────────────────────────────────────
    tool(id="pi-ai", name="Pi", category_id="chat-ai",
         description="Conversational assistant from Inflection AI designed for supportive, friendly dialogue. Focused on talking things through rather than productivity tasks.",
         website_url="https://pi.ai", pricing_type="Completely Free", free_availability=True,
         free_tier_details=ftd(features="Free to use on web and mobile; no paid consumer tier", api="No public consumer API", commercial=None),
         capabilities=["conversation", "emotional support", "brainstorming", "voice chat"],
         input_types=["text", "audio"], output_types=["text", "audio"], api_available=False,
         best_use_cases=["casual conversation", "thinking through problems", "practising conversations"],
         limitations=["not built for coding or document work", "fewer integrations than major assistants"]),

    tool(id="poe", name="Poe", category_id="chat-ai",
         description="Chat platform from Quora that gives access to many AI models (GPT, Claude, Gemini, Llama and more) plus community-built bots in one interface.",
         website_url="https://poe.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(daily="Daily allowance of compute points on the free plan", features="Premium models cost more points; subscription raises the allowance. " + CHECK),
         capabilities=["multi-model chat", "custom bots", "image generation", "file upload"],
         input_types=["text", "image", "document"], output_types=["text", "image"], api_available=True,
         best_use_cases=["trying several models side by side", "building simple custom bots"],
         limitations=["free points run out quickly on premium models", "features depend on the underlying model"]),

    tool(id="huggingchat", name="HuggingChat", category_id="chat-ai",
         description="Free, open-source chat interface from Hugging Face for chatting with leading open-weight models such as Llama, Qwen and Mistral.",
         website_url="https://huggingface.co/chat", pricing_type="Completely Free", free_availability=True,
         free_tier_details=ftd(features="Free with a Hugging Face account; available models rotate over time", api="Use the Hugging Face Inference API separately"),
         capabilities=["open-model chat", "web search", "custom assistants", "model switching"],
         input_types=["text", "image"], output_types=["text"], api_available=False,
         best_use_cases=["trying open-source models", "privacy-conscious chat", "comparing open models"],
         limitations=["model line-up changes", "can be slower at peak times"]),

    tool(id="character-ai", name="Character.AI", category_id="chat-ai",
         description="Chat with AI characters created by the community or design your own. Focused on role-play, storytelling and entertainment.",
         website_url="https://character.ai", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(features="Core chat is free; c.ai+ subscription adds faster responses and extra features", commercial=None),
         capabilities=["character chat", "role-play", "character creation", "voice chat"],
         input_types=["text", "audio"], output_types=["text", "audio"], api_available=False,
         best_use_cases=["interactive storytelling", "creative role-play", "language practice"],
         limitations=["entertainment-focused, not for factual work", "content filters limit some topics"]),

    tool(id="qwen-chat", name="Qwen Chat", category_id="chat-ai",
         description="Alibaba's chat assistant powered by the Qwen model family. Strong multilingual support, coding help, and image and document understanding.",
         website_url="https://chat.qwen.ai", pricing_type="Completely Free", free_availability=True,
         free_tier_details=ftd(features="Chat app is free; API usage is billed through Alibaba Cloud"),
         capabilities=["chat", "coding", "image understanding", "document analysis", "web search"],
         input_types=["text", "image", "document"], output_types=["text", "image"], api_available=True,
         best_use_cases=["multilingual chat", "coding help", "Chinese and English tasks"],
         limitations=["data handled under Alibaba Cloud policies", "fewer third-party integrations"]),

    tool(id="kimi", name="Kimi", category_id="chat-ai",
         description="AI assistant from Moonshot AI known for long-context reading — useful for summarising long documents and many web pages at once.",
         website_url="https://www.kimi.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(features="Core chat free; paid tiers raise usage limits. " + CHECK),
         capabilities=["long-context chat", "document reading", "web search", "coding"],
         input_types=["text", "document", "image"], output_types=["text"], api_available=True,
         best_use_cases=["summarising long reports", "reading many sources together"],
         limitations=["interface strongest in Chinese and English", "limits tighter on heavy use"]),

    # ── WRITING AI ─────────────────────────────────────────────────
    tool(id="writesonic", name="Writesonic", category_id="writing-ai",
         description="AI writing and SEO content platform for blog posts, ad copy and marketing pages, with built-in SEO tools.",
         website_url="https://writesonic.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(monthly="Limited free generations per month", features="SEO tooling and higher volumes need a paid plan. " + CHECK),
         capabilities=["blog writing", "ad copy", "SEO optimisation", "rewriting"],
         input_types=["text", "url"], output_types=["text"], api_available=True,
         best_use_cases=["SEO blog drafts", "marketing copy", "content teams"],
         limitations=["output needs fact-checking", "best features on paid plans"]),

    tool(id="prowritingaid", name="ProWritingAid", category_id="writing-ai",
         description="Grammar checker and style editor with in-depth reports on pacing, readability and repetition. Popular with fiction and long-form writers.",
         website_url="https://prowritingaid.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(features="Free plan has a word limit per check and limited AI rephrasing. " + CHECK),
         capabilities=["grammar checking", "style analysis", "readability reports", "rephrasing"],
         input_types=["text", "document"], output_types=["text"], api_available=True,
         best_use_cases=["editing novels and long-form", "style consistency", "academic writing"],
         limitations=["free plan caps words per check", "reports can feel overwhelming at first"]),

    # ── RESEARCH AI ────────────────────────────────────────────────
    tool(id="you-com", name="You.com", category_id="research-ai",
         description="AI search and research assistant that answers questions with cited web sources and offers multiple model choices.",
         website_url="https://you.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(features="Basic search and answers free; advanced research modes and premium models on paid plans"),
         capabilities=["AI search", "cited answers", "research mode", "model choice"],
         input_types=["text", "document"], output_types=["text"], api_available=True,
         best_use_cases=["quick cited research", "comparing sources"],
         limitations=["advanced modes limited on free", "always verify cited sources"]),

    tool(id="scholarcy", name="Scholarcy", category_id="research-ai",
         description="Summarises research papers into flashcard-style summaries with key findings, methods and references pulled out.",
         website_url="https://www.scholarcy.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(features="Limited summaries on free; full library and exports on paid plans. " + CHECK),
         capabilities=["paper summarisation", "reference extraction", "flashcards", "key finding extraction"],
         input_types=["document", "url"], output_types=["text"], api_available=False,
         best_use_cases=["literature reviews", "skimming many papers", "student study notes"],
         limitations=["summaries can miss nuance", "works best on structured papers"]),

    # ── IMAGE GENERATION ───────────────────────────────────────────
    tool(id="krea-ai", name="Krea AI", category_id="image-generation",
         description="Real-time AI image generation and enhancement studio with live canvas, upscaling and access to several image and video models.",
         website_url="https://www.krea.ai", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(daily="Limited free generations per day", features="Higher resolution, faster queues and commercial licence on paid plans. " + CHECK, commercial=None),
         capabilities=["real-time generation", "image upscaling", "image editing", "style transfer"],
         input_types=["text", "image"], output_types=["image", "video"], api_available=True,
         best_use_cases=["fast concept iteration", "upscaling images", "live sketch-to-image"],
         limitations=["free daily limit is small", "commercial terms depend on plan"]),

    tool(id="bing-image-creator", name="Bing Image Creator", category_id="image-generation",
         description="Microsoft's free text-to-image tool powered by OpenAI image models, available on the web and inside Bing and Copilot.",
         website_url="https://www.bing.com/images/create", pricing_type="Completely Free", free_availability=True,
         free_tier_details=ftd(features="Free with a Microsoft account; boosts speed up generation", watermark_details="Images carry content-credential metadata identifying them as AI-generated", commercial=None),
         capabilities=["text-to-image", "multiple variations"],
         input_types=["text"], output_types=["image"], api_available=False,
         watermark_info="Content credentials metadata is attached to generated images.",
         best_use_cases=["free image generation", "quick illustrations", "social posts"],
         limitations=["slower once boosts run out", "check Microsoft's terms before commercial use"]),

    tool(id="playground-ai", name="Playground", category_id="image-generation",
         description="AI design tool for creating graphics like social posts, logos and posters from prompts, with an editable canvas.",
         website_url="https://playground.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(daily="Limited free images per day", features="Commercial use and higher limits on paid plans. " + CHECK, commercial=None),
         capabilities=["text-to-image", "graphic design", "image editing", "templates"],
         input_types=["text", "image"], output_types=["image"], api_available=False,
         best_use_cases=["social graphics", "posters", "quick design mockups"],
         limitations=["free images may be public", "commercial terms depend on plan"]),

    # ── VIDEO GENERATION ───────────────────────────────────────────
    tool(id="synthesia", name="Synthesia", category_id="video-generation",
         description="AI video platform that turns scripts into presenter-led videos using AI avatars and voices in many languages. Widely used for training content.",
         website_url="https://www.synthesia.io", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(monthly="A few minutes of video per month on the free plan", watermark=True, watermark_details="Free plan videos include a Synthesia watermark", features="Custom avatars and API on paid plans. " + CHECK, commercial=False),
         capabilities=["AI avatars", "text-to-video", "multilingual voiceover", "templates"],
         input_types=["text", "document"], output_types=["video"], api_available=True,
         watermark_info="Free plan exports include a watermark.",
         best_use_cases=["training videos", "internal comms", "localised explainers"],
         limitations=["avatar videos can feel stiff", "free minutes are very limited"]),

    tool(id="google-veo", name="Google Veo", category_id="video-generation",
         description="Google DeepMind's video generation model, available through Google Flow, the Gemini app and the Gemini API. Generates short clips with native audio.",
         website_url="https://deepmind.google/models/veo/", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(daily="Google Flow gives every account free daily credits that can be spent on Veo clips",
                               watermark=True, watermark_details="Outputs carry Google's SynthID invisible watermark",
                               features="Veo in the Gemini app needs a paid Google AI plan. " + CHECK,
                               api="Gemini API is billed per second of generated video, from about $0.05/second on the Lite tier",
                               commercial=None),
         capabilities=["text-to-video", "image-to-video", "native audio", "camera control"],
         input_types=["text", "image"], output_types=["video"], api_available=True,
         watermark_info="Outputs include Google's SynthID invisible watermark; consumer apps may also add a visible mark.",
         best_use_cases=["cinematic short clips", "ad concepts", "storyboarding"],
         limitations=["free use is limited to Flow's daily credits", "Gemini app access needs a paid plan", "short clip lengths"]),

    tool(id="capcut", name="CapCut", category_id="video-generation",
         description="Video editor from ByteDance with AI features like auto-captions, background removal, script-to-video and effects. Desktop, web and mobile.",
         website_url="https://www.capcut.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(watermark=None, watermark_details="Some templates and Pro effects add restrictions or watermarks", features="Many AI tools and cloud storage require Pro. " + CHECK, commercial=None),
         capabilities=["video editing", "auto captions", "background removal", "script-to-video", "templates"],
         input_types=["video", "image", "text", "audio"], output_types=["video"], api_available=False,
         best_use_cases=["short-form social video", "quick captions", "template edits"],
         limitations=["best AI features behind Pro", "availability varies by country"]),

    # ── VOICE & AUDIO ──────────────────────────────────────────────
    tool(id="speechify", name="Speechify", category_id="voice-audio",
         description="Text-to-speech reader that reads documents, web pages and books aloud in natural voices. Popular for accessibility and studying.",
         website_url="https://speechify.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(features="Free plan has standard voices and normal speeds; premium voices and faster speeds are paid"),
         capabilities=["text-to-speech", "document reading", "voice selection", "speed control"],
         input_types=["text", "document", "url", "image"], output_types=["audio"], api_available=True,
         best_use_cases=["listening to articles", "accessibility and dyslexia support", "studying on the go"],
         limitations=["best voices are paid", "subscription is relatively expensive"]),

    tool(id="krisp", name="Krisp", category_id="voice-audio",
         description="AI noise cancellation for calls that removes background noise and echo, plus meeting transcription and notes.",
         website_url="https://krisp.ai", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(daily="Limited noise-cancellation minutes per day on free", features="Unlimited minutes and advanced meeting notes on paid plans. " + CHECK),
         capabilities=["noise cancellation", "echo removal", "meeting transcription", "meeting notes"],
         input_types=["audio"], output_types=["audio", "text"], api_available=True,
         best_use_cases=["clean audio on calls", "remote work", "meeting notes"],
         limitations=["free minutes are capped", "runs locally so uses CPU"]),

    # ── MUSIC GENERATION ───────────────────────────────────────────
    tool(id="stable-audio", name="Stable Audio", category_id="music-generation",
         description="Stability AI's music and sound-effect generator. Creates instrumental tracks and audio clips from text prompts.",
         website_url="https://stableaudio.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(monthly="Limited free generations per month", features="Commercial licence and longer tracks on paid plans. " + CHECK, commercial=False),
         capabilities=["text-to-music", "sound effects", "audio-to-audio"],
         input_types=["text", "audio"], output_types=["audio"], api_available=True,
         best_use_cases=["background music", "sound design", "production sketches"],
         limitations=["instrumentals stronger than vocals", "free use is non-commercial"]),

    # ── CODING AI ──────────────────────────────────────────────────
    tool(id="kiro", name="Kiro", category_id="coding-ai",
         description="Agentic AI IDE from AWS built around spec-driven development: requirements, design and tasks, plus hooks, steering files and MCP support. Used to build AI Apartment.",
         website_url="https://kiro.dev", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(monthly="Monthly credit allowance on the free tier", features="Higher credit allowances on paid tiers. " + CHECK),
         capabilities=["agentic coding", "spec-driven development", "agent hooks", "steering files", "MCP integration"],
         input_types=["text", "code", "image"], output_types=["code", "text"], api_available=False,
         best_use_cases=["building features from specs", "multi-file changes", "automating repo workflows"],
         limitations=["credit-based usage", "desktop IDE (VS Code-based)"]),

    tool(id="windsurf", name="Windsurf", category_id="coding-ai",
         description="AI-native code editor with an agent called Cascade that plans and makes multi-file edits, plus fast autocomplete.",
         website_url="https://windsurf.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(monthly="Limited monthly prompt credits on free", features="Premium models and more credits on paid plans. " + CHECK),
         capabilities=["agentic coding", "autocomplete", "multi-file edits", "terminal commands"],
         input_types=["text", "code"], output_types=["code", "text"], api_available=False,
         best_use_cases=["refactors across files", "fast prototyping", "learning a new codebase"],
         limitations=["credits run out on heavy use", "agent edits need review"]),

    tool(id="claude-code", name="Claude Code", category_id="coding-ai",
         description="Anthropic's agentic coding tool that runs in the terminal and IDEs. Reads the codebase, edits files, runs commands and handles git workflows.",
         website_url="https://www.anthropic.com/claude-code", pricing_type="Paid Only", free_availability=False,
         capabilities=["agentic coding", "codebase understanding", "terminal commands", "git workflows"],
         input_types=["text", "code"], output_types=["code", "text"], api_available=True,
         best_use_cases=["large refactors", "terminal-first developers", "automating repo tasks"],
         limitations=["not included in the free Claude plan; starts with Claude Pro at $20/month, or pay-per-token via the API",
                      "shares the same usage limits as Claude chat", "usage can get costly on big tasks"]),

    tool(id="amazon-q-developer", name="Amazon Q Developer", category_id="coding-ai",
         description="AWS's AI coding assistant for IDEs and the CLI. Code suggestions, chat, security scans and help with AWS services.",
         website_url="https://aws.amazon.com/q/developer/", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(monthly="Free tier with monthly limits on agent and chat usage", features="Pro tier raises limits and adds admin controls. " + CHECK),
         capabilities=["code completion", "code chat", "security scanning", "code transformation", "AWS guidance"],
         input_types=["text", "code"], output_types=["code", "text"], api_available=False,
         best_use_cases=["AWS-heavy projects", "Java and .NET upgrades", "security reviews"],
         limitations=["strongest inside the AWS ecosystem", "monthly caps on free tier"]),

    tool(id="phind", name="Phind", category_id="coding-ai",
         description="AI search engine for developers that answers technical questions with code examples and cited documentation.",
         website_url="https://www.phind.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(daily="Limited daily uses of the strongest models on free"),
         capabilities=["developer search", "code generation", "cited answers", "debugging help"],
         input_types=["text", "code"], output_types=["text", "code"], api_available=False,
         best_use_cases=["looking up APIs", "debugging errors", "quick code examples"],
         limitations=["not an editor integration", "best models limited on free"]),

    # ── DESIGN AI ──────────────────────────────────────────────────
    tool(id="photoroom", name="Photoroom", category_id="design-ai",
         description="AI photo editor for product images: background removal, AI backgrounds, shadows and batch editing for e-commerce.",
         website_url="https://www.photoroom.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(watermark=True, watermark_details="Free exports include a Photoroom watermark", features="Batch editing and HD exports on Pro"),
         capabilities=["background removal", "AI backgrounds", "batch editing", "product photos"],
         input_types=["image"], output_types=["image"], api_available=True,
         watermark_info="Free plan exports carry a watermark.",
         best_use_cases=["e-commerce product shots", "marketplace listings", "social commerce"],
         limitations=["watermark on free", "batch features are paid"]),

    tool(id="remove-bg", name="remove.bg", category_id="design-ai",
         description="One-click AI background removal for photos of people, products, animals and cars.",
         website_url="https://www.remove.bg", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(features="Free downloads are preview resolution; full-resolution downloads use paid credits"),
         capabilities=["background removal", "background replacement", "batch processing"],
         input_types=["image"], output_types=["image"], api_available=True,
         best_use_cases=["profile photos", "product cutouts", "quick design assets"],
         limitations=["free output is low resolution", "single-purpose tool"]),

    # ── PRODUCTIVITY AI ────────────────────────────────────────────
    tool(id="clickup-brain", name="ClickUp Brain", category_id="productivity-ai",
         description="AI assistant inside ClickUp that writes docs, summarises tasks and threads, and answers questions across a workspace.",
         website_url="https://clickup.com/ai", pricing_type="Free Trial", free_availability=True,
         free_tier_details=ftd(gen_limit="Limited one-time trial uses per workspace",
                               features="After the trial, Brain is an add-on (from $9/user/month) on paid ClickUp plans; Free Forever workspaces must upgrade. " + CHECK),
         capabilities=["task summaries", "doc writing", "workspace Q&A", "standup updates"],
         input_types=["text"], output_types=["text"], api_available=False,
         best_use_cases=["project status summaries", "teams already on ClickUp"],
         limitations=["only useful inside ClickUp", "paid add-on after trial"]),

    # ── DOCUMENT AI ────────────────────────────────────────────────
    tool(id="llamaparse", name="LlamaParse", category_id="document-ai",
         description="Document parsing service from LlamaIndex that converts complex PDFs, tables and slides into clean text and markdown for RAG pipelines.",
         website_url="https://www.llamaindex.ai/llamaparse", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(credits="Free credit allowance for parsing pages", features="Higher volumes and premium parsing modes are billed. " + CHECK),
         capabilities=["PDF parsing", "table extraction", "markdown output", "multimodal parsing"],
         input_types=["document"], output_types=["text"], api_available=True,
         best_use_cases=["RAG ingestion", "extracting tables from PDFs", "developer document pipelines"],
         limitations=["developer-focused, no consumer UI", "complex layouts may need premium mode"]),

    # ── TRANSLATION AI ─────────────────────────────────────────────
    tool(id="microsoft-translator", name="Microsoft Translator", category_id="translation-ai",
         description="Microsoft's translation service for text, speech, images and conversations, with apps and an Azure API.",
         website_url="https://translator.microsoft.com", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(monthly="Apps are free; the Azure API has a free monthly character allowance", features="Higher API volumes are billed. " + CHECK),
         capabilities=["text translation", "speech translation", "image translation", "live conversation"],
         input_types=["text", "audio", "image", "document"], output_types=["text", "audio"], api_available=True,
         best_use_cases=["travel conversations", "app localisation via API", "Office integration"],
         limitations=["quality varies by language pair", "API needs an Azure account"]),

    # ── AI AGENTS ──────────────────────────────────────────────────
    tool(id="manus", name="Manus", category_id="ai-agents",
         description="General-purpose AI agent that plans and carries out multi-step tasks like research, data analysis and building simple websites in a cloud workspace.",
         website_url="https://manus.im", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(daily="Small daily credit allowance on free", features="Paid plans add more credits and parallel tasks. " + CHECK),
         capabilities=["autonomous task execution", "web research", "data analysis", "file creation"],
         input_types=["text", "document"], output_types=["text", "document", "code"], api_available=False,
         best_use_cases=["multi-step research reports", "data analysis tasks", "drafting deliverables"],
         limitations=["credits deplete on long tasks", "results need checking"]),

    tool(id="devin", name="Devin", category_id="ai-agents",
         description="Autonomous software engineering agent from Cognition that takes tickets, writes code in its own environment and opens pull requests.",
         website_url="https://devin.ai", pricing_type="Freemium", free_availability=True,
         free_tier_details=ftd(features="Free plan has a light agent quota and limited models; Pro is $20/month and Max $200/month with larger quotas. " + CHECK),
         capabilities=["autonomous coding", "pull request creation", "bug fixing", "codebase migration"],
         input_types=["text", "code"], output_types=["code", "text"], api_available=True,
         best_use_cases=["clearing backlog tickets", "migrations", "parallel engineering tasks"],
         limitations=["free quota is small", "heavy usage costs extra beyond plan quota", "complex tasks still need engineer review"]),
]


def validate():
    """Validate every record against the API schema and the category list."""
    from app.models.tool import ToolRecord
    from scripts.seed_categories import CATEGORIES  # noqa: E402

    valid_cats = {c["id"] if "id" in c else c["slug"] for c in CATEGORIES}
    ids = [t["id"] for t in TOOLS]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        raise SystemExit(f"Duplicate IDs in batch: {dupes}")

    for t in TOOLS:
        if t["category_id"] not in valid_cats:
            raise SystemExit(f"{t['id']}: unknown category {t['category_id']}")
        ToolRecord(**t)  # raises on schema violation
    print(f"Validated {len(TOOLS)} tools against ToolRecord.")


def seed():
    from app.db.firestore_client import get_db
    db = get_db()
    col = db.collection("tools")
    for t in TOOLS:
        col.document(t["id"]).set(t)
        # ASCII only: Windows consoles/redirects default to cp1252
        print(f"  [ok] {t['name']} ({t['category_id']}) - {t['pricing_type']}")
    print(f"\nSeeded {len(TOOLS)} tools.")


if __name__ == "__main__":
    validate()
    if "--dry-run" not in sys.argv:
        seed()
