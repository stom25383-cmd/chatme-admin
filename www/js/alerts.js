/* ============================================================
   ALERTS.JS
   Listens to /adminAlerts for "New Account Created" events and
   fires a device notification. Runs silently in the background.
   ============================================================ */

const CmAlerts = (function () {

    function showLocalAlert(title, message) {
        if (window.cordova && navigator.notification) {
            navigator.notification.alert(message, null, title, "OK");
        } else {
            console.log(`[ChatMe Control] ${title}: ${message}`);
        }
    }

    function listen() {
        cmDb.ref("adminAlerts").orderByChild("ts").startAt(Date.now()).on("child_added", (snap) => {
            const alert = snap.val();
            if (alert.type === "new_account") {
                showLocalAlert("New Account Created", alert.accountName);
            }
        });
    }

    return { listen };
})();
