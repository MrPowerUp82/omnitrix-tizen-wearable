// Overlay de debug visível na própria tela do relógio. No hardware físico
// (Galaxy Watch com Samsung Internet/WebView) não dá pra abrir o DevTools,
// então isso intercepta console.log/warn/error e mostra as últimas linhas
// numa faixa semi-transparente perto da base do mostrador.
// Para desligar: troque DEBUG_OVERLAY para false (ou use ?debug=0 na URL).
const DEBUG_OVERLAY = true;

(function () {
    const params = new URLSearchParams(location.search);
    const forced = params.get("debug");
    const enabled = forced === "1" ? true : forced === "0" ? false : DEBUG_OVERLAY;
    if (!enabled) return;

    const MAX_LINES = 8;
    const buffer = [];
    let overlayEl = null;

    function render() {
        if (!overlayEl) return;
        overlayEl.textContent = buffer.join("\n");
        overlayEl.scrollTop = overlayEl.scrollHeight;
    }

    function push(prefix, args) {
        const line = prefix + Array.prototype.map.call(args, function (a) {
            try { return typeof a === "object" ? JSON.stringify(a) : String(a); }
            catch (e) { return String(a); }
        }).join(" ");
        buffer.push(line);
        if (buffer.length > MAX_LINES) buffer.shift();
        render();
    }

    ["log", "warn", "error"].forEach(function (level) {
        const original = console[level] ? console[level].bind(console) : function () { };
        console[level] = function () {
            original.apply(console, arguments);
            push(level === "error" ? "[ERR] " : level === "warn" ? "[WARN] " : "", arguments);
        };
    });

    window.addEventListener("error", function (event) {
        push("[EXC] ", [event.message + " @" + event.filename + ":" + event.lineno]);
    });

    document.addEventListener("DOMContentLoaded", function () {
        overlayEl = document.createElement("div");
        overlayEl.id = "debug-overlay";
        document.body.appendChild(overlayEl);
        render();
    });
})();
