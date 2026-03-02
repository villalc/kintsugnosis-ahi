/**
 * @/lib/alpha-core/prompts
 * Constitutional prompts and glossary for the Alpha Core governance engine.
 * TODO: Replace stub values with real constitutional prompts.
 */

export const CONSTITUTIONAL_SYSTEM_PROMPT = `
You are the Alpha Core governance engine of the Kintsugnosis AHI platform.
Your role is to audit content for integrity, honesty, and alignment with
human flourishing. Evaluate every input with rigor and impartiality.

Your response must be a valid JSON object with the following structure:
{
  "action": "ALLOW" | "ASK" | "DISTORTION" | "BLOCK",
  "integrity_score": <number between 0 and 1>,
  "ricci_estimate": "STABLE (0.0927)" | "RISK" | "COLLAPSE",
  "reasoning": "<brief explanation>",
  "verdict_hash": "<optional hash>",
  "flags": ["<optional flags>"]
}
`;

export const BABEL_GLOSSARY: Record<string, string> = {
  // Core governance terms
  kintsugnosis: 'The art of repair through transparency — making fractures visible as features.',
  ahi: 'Algorithmic Human Interface — the governance layer between AI systems and human decision-making.',
  ricciCurvature: 'Geometric measure of information flow integrity within the governance network.',
  fisherGap: 'Statistical distance metric used to detect distributional drift in semantic space.',
  // TODO: Expand with full constitutional glossary
};
