const chat = document.getElementById("chat");
const userInputEl = document.getElementById("userInput");
const checkButton = document.getElementById("checkButton");

checkButton.addEventListener("click", async () => {
  const userInput = userInputEl.value.trim();
  if (!userInput) return;

  // User bubble
  chat.innerHTML += `<div class="bubble user">${userInput}</div>`;
  userInputEl.value = "";
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("http://127.0.0.1:8787", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await res.json();

    // AI bubble with color coding
    const bubbleColor = data.classification === "Suspicious" ? "#fee2e2" : "#d1fae5";
    chat.innerHTML += `
      <div class="bubble ai" style="background-color:${bubbleColor}">
        <b>${data.classification}</b> (Risk: ${data.risk_score}/10)<br/>
        ${data.reason}<br/>
        <small style="color:#6b7280">${new Date(data.timestamp).toLocaleString()}</small>
      </div>
    `;

    chat.scrollTop = chat.scrollHeight;
  } catch (err) {
    console.error(err);
    chat.innerHTML += `<div class="bubble ai" style="background-color:#fef3c7">Error connecting to Worker</div>`;
  }
});
