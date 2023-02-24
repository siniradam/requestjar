exports.css = `<style>
      html,body {
        background:#202124;
        color:white;
        font-family: Arial, Helvetica, sans-serif;
      }
      .log {
        white-space:pre;
        margin:4px;
        padding:4px;
        border:1px solid #ccc;
      }
</style>`;

//<pre><code class="language-plaintext">...</code></pre>

exports.js = `<script>
const key = (Math.random() + 1).toString(36).substring(7);
const usersEventSource = new EventSource("/live/" + key);

const addMessage = (message, isNotice) => {
  const logs = document.getElementById("logs");
  const log = document.createElement("div");

  const codeBlockPre = document.createElement("pre");
  const codeBlock = document.createElement("code");
  codeBlock.classList.add("language-json");

  log.classList.add("log");

  if (isNotice) {
    log.style.fontWeight = "bold";
  }

  try {
    const o = JSON.parse(message);
    if (o && typeof o === "object") {
      console.log(o);
      message = JSON.stringify(o, null, 2);
    }
  } catch (e) {}

  if (!isNotice) {
    codeBlock.innerHTML = message;
    hljs.highlightElement(codeBlock)
    codeBlockPre.appendChild(codeBlock);
    log.append(codeBlockPre);
  } else {
    log.innerHTML = message;
  }

  logs.prepend(log);
};

usersEventSource.addEventListener("open", () => {
  addMessage("Connected to the server", true);
});

usersEventSource.addEventListener("error", (error) => {
  addMessage("Something went wrong, check the console.log", true);
  console.error(error);
});

usersEventSource.addEventListener("update", (event) => {
  addMessage(event.data);
});


    </script>`;
