export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST") {
      try {
        const { message } = await request.json();

        // 🔹 Call Workers AI
        const aiResponse = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",   // ✅ correct model slug
            {
               prompt:  `You are a JSON-only classifier. 
              Classify the following message as either "Safe" or "Suspicious". 
              Respond ONLY in valid JSON, nothing else. 
              JSON schema:
              {
                "classification": "Safe" | "Suspicious",
                "risk_score": number (0-10),
                "reason": string
              }

              Message: """${message}"""`,

            }
        );
        let result;
        try {
          result = JSON.parse(aiResponse.response.trim());
        } catch {
                  const text = aiResponse.response.trim();

            const classificationMatch = text.match(/Classification:\s*(Safe|Suspicious)/i);
            const riskMatch = text.match(/Risk Score:\s*(\d+)/i);
            const reasonMatch = text.match(/Reason:\s*(.*)/i);

            result = {
              classification: classificationMatch ? classificationMatch[1] : "Unknown",
              risk_score: riskMatch ? parseInt(riskMatch[1]) : 5,
              reason: reasonMatch ? reasonMatch[1] : text,
          };
        }

        const output = {
          ...result,
          timestamp: new Date().toISOString(),
        };

        return new Response(JSON.stringify(output), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        console.error("❌ Worker error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Phishing Detector API is running.");
  },
};
