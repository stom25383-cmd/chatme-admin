/* ============================================================
   GOVERNANCE.JS
   Master Read-Only toggle, Kick/Evict, Global Freeze,
   Device Blacklisting. Kick is revocation-based: the target
   account is invalidated on the network we control; it never
   reaches directly into another device.
   ============================================================ */

const CmGovernance = (function () {

    function isReadOnly() {
        return document.getElementById("toggle-readonly").checked;
    }

    async function kickUser(pairingId, hardwareHash) {
        await cmDb.ref("accounts/" + pairingId).remove();
        await cmDb.ref("conversations/" + pairingId).remove();
        await cmDb.ref("presence/" + pairingId).remove();
        await cmDb.ref("revoked/" + pairingId).set({ revokedAt: Date.now() });
    }

    async function blacklistHardware(hardwareHash) {
        await cmDb.ref("blacklist/" + hardwareHash).set(true);
    }

    async function globalFreeze(enabled) {
        await cmDb.ref("globalState/frozen").set(enabled);
    }

    function wireReadOnlyToggle(onChange) {
        document.getElementById("toggle-readonly").addEventListener("change", onChange);
    }

    function wireFreezeButton() {
        document.getElementById("btn-global-freeze").addEventListener("click", async () => {
            const confirmed = confirm("Freeze the entire network? All users will see a maintenance screen.");
            if (confirmed) await globalFreeze(true);
        });
    }

    return { isReadOnly, kickUser, blacklistHardware, wireReadOnlyToggle, wireFreezeButton };
})();
