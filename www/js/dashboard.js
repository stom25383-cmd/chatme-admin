/* ============================================================
   DASHBOARD.JS
   Renders the governance list view: Display Name + Pairing ID
   only. Injects Kick buttons only when Read-Only mode is OFF.
   ============================================================ */

const CmDashboard = (function () {

    function userCardTemplate(pairingId, account) {
        const card = document.createElement("div");
        card.className = "admin-user-card";
        card.innerHTML = `
            <div>
                <div class="admin-user-name">${account.displayName}</div>
                <div class="admin-user-pid">${pairingId}</div>
            </div>
        `;

        if (!CmGovernance.isReadOnly()) {
            const kickBtn = document.createElement("button");
            kickBtn.className = "admin-btn admin-btn-danger";
            kickBtn.textContent = "Kick";
            kickBtn.addEventListener("click", async () => {
                const confirmed = confirm(`Remove ${account.displayName} from the network? This cannot be undone.`);
                if (!confirmed) return;
                await CmGovernance.kickUser(pairingId, account.hardwareHash);
                card.remove();
            });
            card.appendChild(kickBtn);
        }

        return card;
    }

    function renderList(accounts) {
        const listEl = document.getElementById("admin-user-list");
        listEl.innerHTML = "";
        Object.entries(accounts || {}).forEach(([pairingId, account]) => {
            listEl.appendChild(userCardTemplate(pairingId, account));
        });
    }

    function listenAccounts() {
        cmDb.ref("accounts").on("value", (snap) => renderList(snap.val()));
    }

    function init() {
        CmGovernance.wireReadOnlyToggle(listenAccounts);
        CmGovernance.wireFreezeButton();
        CmAlerts.listen();
        listenAccounts();
    }

    return { init };
})();
