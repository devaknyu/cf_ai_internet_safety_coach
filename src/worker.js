export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response("", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS" }});
    }

    if (request.method === "POST") {
      const { message } = await request.json();

      // Placeholder response (replace with Workers AI call later)
      const fakeResponse = {
        classification: "Suspicious",
        reason: "Contains a suspicious link and urgent tone.",
      };

      return new Response(JSON.stringify(fakeResponse), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response("Internet Safety Coach Worker running!", { status: 200 });
  }
}
