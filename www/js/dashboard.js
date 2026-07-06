/* ============================================================
   DASHBOARD.JS
   Renders the governance list view: Display Name + Pairing ID
   only. Injects Kick + Blacklist Device buttons only when
   Read-Only mode is OFF.
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
            const actionsWrap = document.createElement("div");
            actionsWrap.style.display = "flex";
            actionsWrap.style.gap = "8px";

            const kickBtn = document.createElement("button");
            kickBtn.className = "admin-btn admin-btn-danger";
            kickBtn.textContent = "Kick";
            kickBtn.addEventListener("click", async () => {
                const confirmed = confirm(`Remove ${account.displayName} from the network? This cannot be undone.`);
                if (!confirmed) return;
                await CmGovernance.kickUser(pairingId, account.hardwareHash);
                card.remove();
            });

            const blacklistBtn = document.createElement("button");
            blacklistBtn.className = "admin-btn";
            blacklistBtn.textContent = "Blacklist Device";
            blacklistBtn.addEventListener("click", async () => {
                if (!account.hardwareHash) {
                    alert("No hardware signature on record for this account.");
                    return;
                }
                const confirmed = confirm(`Permanently block ${account.displayName}'s device from ever creating a new account? This cannot be undone.`);
                if (!confirmed) return;
                await CmGovernance.blacklistHardware(account.hardwareHash);
                alert("Device blacklisted.");
            });

            actionsWrap.appendChild(blacklistBtn);
            actionsWrap.appendChild(kickBtn);
            card.appendChild(actionsWrap);
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
