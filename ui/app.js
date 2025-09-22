async function sendMessage() {
  const input = document.getElementById("input").value;
  const res = await fetch("https://your-worker-url.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input })
  });

  const data = await res.json();
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p><b>You:</b> ${input}</p>`;
  chat.innerHTML += `<p><b>AI:</b> ${data.classification} - ${data.reason}</p>`;
}
