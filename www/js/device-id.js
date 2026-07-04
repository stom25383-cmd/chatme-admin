/* ============================================================
   DEVICE-ID.JS (Admin APK)
   Reserved in case the Control APK itself should be locked to
   a specific admin device in a future hardening pass.
   ============================================================ */

const CmDeviceId = (function () {
    async function sha256(text) {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    async function getHardwareHash() {
        const rawUuid = (window.device && window.device.uuid) ? window.device.uuid : "no-device-plugin";
        return await sha256("chatme-admin-salt::" + rawUuid);
    }
    return { getHardwareHash };
})();
