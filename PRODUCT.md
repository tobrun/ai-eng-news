# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Working AI engineers who build with LLMs. They scan the site for a few minutes at a time to decide which posts are worth reading in full.

## Product Purpose

Forward Pass is a news outlet for AI engineering. It publishes short summaries of blog posts and sends the reader straight to the original post. It succeeds when a reader can judge in seconds whether a post deserves their time, and then reaches it in one click.

## Positioning

Human-curated, AI-assisted. A person chooses every post. Summaries may be drafted with AI, but a person edits them. The site summarises and points onward; it never replaces or republishes the original.

## Operating Context

- Reading happens in short sessions on desktop and phone.
- Stories are grouped by topic: Agents, Evals, Retrieval, Inference, Training, Security, Foundations.
- Each story records source, author, topic, estimated read time, and the date the summary was posted here (not the original publish date).

## Capabilities and Constraints

- Next.js (App Router, TypeScript), statically generated, deployed on Vercel (`npx vercel --prod`).
- Content is currently mock data in `src/data/articles.ts`. A real content source is undecided.
- Clicking a story goes directly to the original post. There is no article page on this site.
- No metrics, ads, or third-party tracking scripts for now. Metrics collection is deferred, not rejected.
- Stories have an editorial prominence: lead, feature, or brief.

## Brand Commitments

- The layout follows a strict grid. The user made this binding.
- "Forward Pass" is the working name. It is not confirmed as final.

## Evidence on Hand

- No readers, subscriber counts, testimonials, or press exist. Do not invent any.
- Summaries in the mock data are placeholders. The linked posts are real.

## Product Principles

1. The original author gets the click. Every surface leads to the source.
2. Judge in seconds: a story's source, topic, length, and gist must be readable at a glance.
3. Curation is the product. Prominence reflects an editorial choice, not engagement.
4. Clean by default: no third-party scripts until a metrics decision is made.
