/* ============================================================
   PIN-LOCK.JS
   First launch: create a custom PIN (min 4 digits/chars).
   Every subsequent launch: numpad entry gate before dashboard.
   Stored as a SHA-256 hash locally, never in plaintext.
   ============================================================ */

const CmPinLock = (function () {

    let enteredPin = "";
    let isCreationMode = false;
    let creationFirstPin = null;

    async function sha256(text) {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }

    function hasPinConfigured() {
        return !!localStorage.getItem("cm_admin_pin_hash");
    }

    function renderDots() {
        const dotsEl = document.getElementById("pin-dots");
        dotsEl.innerHTML = "";
        const len = Math.max(enteredPin.length, 4);
        for (let i = 0; i < len; i++) {
            const dot = document.createElement("div");
            dot.className = "pin-dot" + (i < enteredPin.length ? " filled" : "");
            dotsEl.appendChild(dot);
        }
    }

    function renderNumpad() {
        const pad = document.getElementById("pin-numpad");
        pad.innerHTML = "";
        const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
        keys.forEach(k => {
            const btn = document.createElement("button");
            btn.className = "pin-key";
            btn.textContent = k;
            if (k === "") { btn.style.visibility = "hidden"; }
            btn.addEventListener("click", () => handleKey(k));
            pad.appendChild(btn);
        });
    }

    async function handleKey(key) {
        if (key === "") return;
        if (key === "⌫") {
            enteredPin = enteredPin.slice(0, -1);
            renderDots();
            return;
        }
        enteredPin += key;
        renderDots();

        if (enteredPin.length >= 4) {
            await maybeSubmit();
        }
    }

    async function maybeSubmit() {
        if (isCreationMode) {
            if (!creationFirstPin) {
                creationFirstPin = enteredPin;
                enteredPin = "";
                document.getElementById("pin-title").textContent = "Confirm Your PIN";
                renderDots();
            } else {
                if (enteredPin === creationFirstPin) {
                    const hash = await sha256(enteredPin);
                    localStorage.setItem("cm_admin_pin_hash", hash);
                    unlockDashboard();
                } else {
                    showError("PINs did not match. Try again.");
                    resetCreation();
                }
            }
        } else {
            const hash = await sha256(enteredPin);
            if (hash === localStorage.getItem("cm_admin_pin_hash")) {
                unlockDashboard();
            } else {
                showError("Incorrect PIN");
                enteredPin = "";
                renderDots();
            }
        }
    }

    function showError(msg) {
        const errEl = document.getElementById("pin-error");
        errEl.textContent = msg;
        errEl.classList.remove("hidden");
        setTimeout(() => errEl.classList.add("hidden"), 2000);
    }

    function resetCreation() {
        creationFirstPin = null;
        enteredPin = "";
        document.getElementById("pin-title").textContent = "Create Your Security PIN";
        renderDots();
    }

    function unlockDashboard() {
        document.getElementById("screen-pin").classList.remove("active");
        document.getElementById("screen-dashboard").classList.add("active");
        CmDashboard.init();
    }

    function init() {
        isCreationMode = !hasPinConfigured();
        document.getElementById("pin-title").textContent =
            isCreationMode ? "Create Your Security PIN" : "Enter Security PIN";
        renderDots();
        renderNumpad();
    }

    return { init };
})();

document.addEventListener("deviceready", () => CmPinLock.init(), false);
