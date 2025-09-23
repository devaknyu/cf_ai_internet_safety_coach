// src/workflow.js
// lightweight orchestration utilities — used only if you want to expand
export async function runSafetyWorkflow(env, userId, message, callModelFn, saveFn) {
  const classificationPrompt = [
    { role: "system", content: "You are a security analyst specialized in phishing detection. Output JSON with fields: classification (Safe|Suspicious), risk_score (1-10), reason (brief)." },
    { role: "user", content: `Classify this message:\n\n${message}` }
  ];

  const rawClass = await callModelFn(env, classificationPrompt);
  // parse handled at caller
  const explanationPrompt = [
    { role: "system", content: "You are a helpful security coach." },
    { role: "user", content: `Message: ${message}\nModel classification: ${rawClass}` }
  ];
  const explanation = await callModelFn(env, explanationPrompt);
  const result = { classification: rawClass, explanation, timestamp: new Date().toISOString() };
  await saveFn(env, userId, result);
  return result;
}
