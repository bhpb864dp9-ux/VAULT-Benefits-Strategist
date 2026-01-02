// schemas/structure.cue
//
// Minimal structural schema stub for ADH-MOSA.
// This is intentionally lightweight: it provides a single place to evolve
// hard validation rules over time without blocking work today.
//
// Recommended next step (optional):
// - Add a `cue`-based validation command in `tools/validate.sh` to assert that
//   required directories/files exist and that platform roots are aligned.

package schemas

// Expected platform roots.
platforms: ["ios", "android", "web"]


