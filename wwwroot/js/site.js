document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("message-form");
    const input = document.getElementById("message-input");
    const button = document.getElementById("send-btn");
    const status = document.getElementById("status");
    const list = document.getElementById("message-list");

    function setStatus(text, isError = false) {
        status.textContent = text;
        status.classList.toggle("error", isError);
    }

    function createItem(msg) {
        const li = document.createElement("li");
        li.textContent = msg.text; // textContent prevents HTML injection

        const time = document.createElement("span");
        time.className = "time";
        time.textContent = `#${msg.id} · ${new Date(msg.createdAt + "Z").toLocaleString()}`;
        li.appendChild(time);
        return li;
    }

    function removeEmptyPlaceholder() {
        const empty = list.querySelector(".empty");
        if (empty) empty.remove();
    }

    // HTTP GET: load messages already saved in the database
    async function loadMessages() {
        try {
            const response = await fetch("/messages", { method: "GET" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const messages = await response.json();
            if (messages.length > 0) {
                list.innerHTML = "";
                messages.forEach(m => list.appendChild(createItem(m)));
            }
        } catch (err) {
            setStatus(`Could not load messages: ${err.message}`, true);
        }
    }

    // HTTP POST: send a new message to the server as JSON
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        button.disabled = true;
        setStatus("Sending...");

        try {
            const response = await fetch("/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input.value })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

            removeEmptyPlaceholder();
            list.prepend(createItem(data));
            input.value = "";
            setStatus(`Saved! (HTTP ${response.status} Created)`);
        } catch (err) {
            setStatus(`Request failed: ${err.message}`, true);
        } finally {
            button.disabled = false;
            input.focus();
        }
    });

    loadMessages();
});
