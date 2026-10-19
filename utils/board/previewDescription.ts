const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

/** The first `maxSentences` sentences of `text`, with "…" when anything was cut. */
export function previewDescription(text: string, maxSentences = 2) {
  const trimmed = text.trim();
  const sentences = Array.from(segmenter.segment(trimmed), ({ segment }) => segment);
  if (sentences.length <= maxSentences) return trimmed;
  return `${sentences.slice(0, maxSentences).join("").trimEnd()}…`;
}
