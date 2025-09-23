document.getElementById("checkButton").addEventListener("click", async () => {
  const userInput = document.getElementById("userInput").value;
  const resultDiv = document.getElementById("result");

  if (!userInput.trim()) {
    resultDiv.innerHTML = "<p style='color:red'>⚠️ Please enter some text first.</p>";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8787", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();

    resultDiv.innerHTML = `
      <h3>Result:</h3>
      <p><b>Classification:</b> ${data.classification}</p>
      <p><b>Risk Score:</b> ${data.risk_score}</p>
      <p><b>Reason:</b> ${data.reason}</p>
      <small><b>Timestamp:</b> ${data.timestamp}</small>
    `;
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "<p style='color:red'>❌ Error connecting to the server.</p>";
  }
});
