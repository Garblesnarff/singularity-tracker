export const INGESTION_PROMPT = `You are parsing a daily tech synthesis post from Alex Wissner-Gross (or similar tech synthesis feeds).

Extract each distinct development/claim as a separate JSON object.

For each claim, provide:
{
  "raw_text": "exact text from post",
  "summary": "one clear sentence",
  "category": "AI|Energy|Biotech|Robotics|Economics|Space|Policy|Culture",
  "subcategory": "more specific topic",
  "claim_type": "factual|prediction|analysis|speculation",
  "sentiment": "positive|negative|neutral|mixed",
  "significance": 1-10 (1 being minor update, 10 being paradigm shift),
  "entities": {
    "companies": ["Company A"],
    "people": ["Person B"],
    "products": ["Product C"],
    "institutions": ["Institution D"]
  },
  "is_prediction": true/false,
  "prediction_timeframe": "2027" or null,
  "search_queries": ["suggested search to find source"]
}

Return a JSON array of all claims found. Strict JSON format only.`;

export const PLACEHOLDER_TEXT = `Example:
1. OpenAI releases GPT-5 preview, claiming 99% accuracy on MATH benchmark.
2. SpaceX Starship achieves orbit for the 3rd time, successfully testing fuel transfer.
3. New bipartisan bill proposed to regulate algorithmic bias in hiring processes.
`;
