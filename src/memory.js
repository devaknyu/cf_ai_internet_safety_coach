// src/memory.js
export async function getHistory(env, userId = "anon", max = 5) {
  if (!env || !env.SAFETY_MEM) return [];
  const key = `user:${userId}`;
  const raw = await env.SAFETY_MEM.get(key);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return arr.slice(0, max);
  } catch (e) {
    return [];
  }
}

export async function clearHistory(env, userId = "anon") {
  if (!env || !env.SAFETY_MEM) return;
  await env.SAFETY_MEM.delete(`user:${userId}`);
}
