# Teacher-guided learning

Core claim: A fixed teacher supplies soft targets; only the student is updated.

Use: repository preview and a full-width paper figure; inspect at 180 mm width.
Evidence: original schematic, no real dataset or measured results.

Modules:
- input: Shared input; Same sample x.
- teacher: Frozen teacher; Soft target distribution.
- student: Trainable student; Predicted distribution.
- loss: Distillation loss; D_KL ( p_T || p_S ).

Relations:
- input → teacher: sample x.
- input → student: sample x.
- teacher → loss: soft targets.
- student → loss: predictions.
- loss → student: student update.

Layout: branched teacher/student paths with an exterior student-update return.
Assets: exact SVG geometry, text and ports; no generated raster assets needed.
Order: record specification → draw modules → route ports → render → inspect.
Acceptance: correct direction and payloads; no line/text crossings; PNG, PDF, SVG, HTML and isolated modules available.
