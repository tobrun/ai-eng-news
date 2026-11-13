# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Working AI engineers who build with LLMs. They scan the site for a few minutes at a time to decide which posts are worth reading in full.

## Product Purpose

AI Engine is a news outlet for AI engineering. It publishes short summaries of blog posts and sends the reader straight to the original post. It succeeds when a reader can judge in seconds whether a post deserves their time, and then reaches it in one click.

## Positioning

Human-curated, AI-assisted. A person chooses every post. Summaries may be drafted with AI, but a person edits them. The site summarises and points onward; it never replaces or republishes the original.

## Operating Context

- Reading happens in short sessions on desktop and phone.
- Each story records source, author, estimated read time, and the date the summary was posted here (not the original publish date).

## Capabilities and Constraints

- Next.js (App Router, TypeScript), deployed on Vercel (`npx vercel --prod`). Pages are statically generated; the Trending list and the click, sign-up and confirm routes are the only server-rendered parts.
- Content is `src/data/articles.ts`, written by the blog-watcher publisher. Each story may carry one of seven topics (Agents, Evals, Retrieval, Inference, Training, Security, Foundations).
- Clicking a story goes directly to the original post. There is no article page on this site.
- Metrics are allowed and named: an own click counter (a story link click posted to the site's own route, counts in Upstash Redis, no cookies and no visitor IDs) and Vercel Web Analytics (cookieless page views and referrers). No ads and no other third-party scripts.
- Stories have an editorial prominence: lead, feature, or brief. Every story, briefs included, may show its share image.

## Brand Commitments

- The layout follows the AI Engine mockup: gapped, rounded image cards with a right rail. It replaces the earlier strict grid.
- "AI Engine" is the name, with an A logo mark and a purple accent. No name or trademark search has been done.

## Evidence on Hand

- No readers, subscriber counts, testimonials, or press exist. Do not invent any.
- The linked posts are real; a person edits every summary.

## Product Principles

1. The original author gets the click. Every surface leads to the source.
2. Judge in seconds: a story's source, length, and gist must be readable at a glance.
3. Curation is the product. Prominence reflects an editorial choice, not engagement. The one exception is the Trending list, which ranks stories by counted clicks.
4. Clean by default: no cookies and no third-party scripts beyond Vercel Web Analytics.
