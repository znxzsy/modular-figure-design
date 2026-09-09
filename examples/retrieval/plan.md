# Evidence-conditioned generation

Core claim: Retrieved passages join the query before answer generation.

Use: repository preview and a full-width paper figure; inspect at 180 mm width.
Evidence: original schematic, no real dataset or measured results.

Modules:
- query: Query; Which passage supports X?.
- retrieve: Retrieve; Select relevant passages.
- generate: Generate; Query + retrieved context.
- answer: Answer; Response with references.

Relations:
- query → retrieve: query.
- retrieve → generate: passages.
- generate → answer: answer.
- query → generate: query bypass.

Layout: left-to-right flow with reserved whitespace between modules.
Assets: exact SVG geometry, text and ports; no generated raster assets needed.
Order: record specification → draw modules → route ports → render → inspect.
Acceptance: correct direction and payloads; no line/text crossings; PNG, PDF, SVG, HTML and isolated modules available.
