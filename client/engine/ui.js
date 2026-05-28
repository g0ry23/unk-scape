/**
 * UNK-SCAPE UI Dynamic Interface Panel Controller
 * Architecture Namespace: window.UnkScape.UI
 * Implementation Path: client/engine/ui.js
 */
((U) => {
    U.UI = {

        currentTab: 'skills',

        /**
         * Hooks the UI engine initialization to clear state and prime the initial view tab
         */
        init() {
            this.refreshActiveTab();
            console.log("[UNK-SCAPE DIRECTOR] Modular UI Event Listener Array wired into DOM.");
        },

        /**
         * Switches the active HUD tab visibility layout state
         * @param {string} tabId - Target destination key ('skills', 'quests', 'ge')
         */
        switchTab(tabId) {
            this.currentTab = tabId;
            this.refreshActiveTab();
        },

        /**
         * Manually parses state variables and updates the HTML markup block contents
         */
        refreshActiveTab() {
            const container = document.getElementById('tab-content-viewport');
            if (!container) return;

            let html = '';

            switch (this.currentTab) {

                case 'skills':
                    html = `
                        <h3 style="color:#f1c40f; margin-top:0; font-size:14px; letter-spacing:1px;">SURVIVAL ATTRIBUTES</h3>
                        <hr style="border: 0; border-top: 1px solid #47385a; margin-bottom:12px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; text-align:left;">
                            <div style="background:#1a1526; padding:8px; border:1px solid #47385a; border-radius:3px;">
                                <span style="font-size:16px;">&#x1FA93;</span> <strong>Woodcut</strong><br>
                                <span style="color:#2ecc71; font-size:12px; margin-left:24px;">Lv. 01</span>
                            </div>
                            <div style="background:#1a1526; padding:8px; border:1px solid #47385a; border-radius:3px;">
                                <span style="font-size:16px;">&#x26CF;&#xFE0F;</span> <strong>Mining</strong><br>
                                <span style="color:#2ecc71; font-size:12px; margin-left:24px;">Lv. 01</span>
                            </div>
                            <div style="background:#1a1526; padding:8px; border:1px solid #47385a; border-radius:3px;">
                                <span style="font-size:16px;">&#x2694;&#xFE0F;</span> <strong>Attack</strong><br>
                                <span style="color:#e74c3c; font-size:12px; margin-left:24px;">Lv. 01</span>
                            </div>
                            <div style="background:#1a1526; padding:8px; border:1px solid #47385a; border-radius:3px;">
                                <span style="font-size:16px;">&#x1F6E1;&#xFE0F;</span> <strong>Defense</strong><br>
                                <span style="color:#3498db; font-size:12px; margin-left:24px;">Lv. 01</span>
                            </div>
                        </div>
                    `;
                    break;

                case 'quests':
                    html = `
                        <h3 style="color:#f1c40f; margin-top:0; font-size:14px; letter-spacing:1px;">ACTIVE QUEST LOGS</h3>
                        <hr style="border: 0; border-top: 1px solid #47385a; margin-bottom:12px;">
                        <div style="background:#1a1526; padding:10px; border-left:3px solid #f1c40f; margin-bottom:8px; border-radius:0 3px 3px 0;">
                            <strong style="color:#fff; font-size:12px;">The Whispering Grove</strong><br>
                            <span style="color:#94a3b8; font-size:11px;">Harvest 0/20 Corrupted Logs in the deep magical forest.</span>
                        </div>
                        <div style="background:#1a1526; padding:10px; border-left:3px solid #94a3b8; border-radius:0 3px 3px 0;">
                            <strong style="color:#94a3b8; font-size:12px;">Seek the Elder</strong><br>
                            <span style="color:#64748b; font-size:11px;">Locate the Ironbound checkpoint camp.</span>
                        </div>
                    `;
                    break;

                case 'ge':
                    html = `
                        <h3 style="color:#f1c40f; margin-top:0; font-size:14px; letter-spacing:1px;">GRAND EXCHANGE</h3>
                        <hr style="border: 0; border-top: 1px solid #47385a; margin-bottom:12px;">
                        <div style="font-size:11px; color:#94a3b8; margin-bottom:10px;">Global Merchant Registry Market Ledger:</div>
                        <div style="background:#120e1a; padding:8px; border:1px solid #332742; border-radius:4px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                            <div style="flex:1;">&#x1FA75; <strong>Bronze Axe</strong><br><span style="color:#eab308; font-size:11px;">Price: 150 GP</span></div>
                            <button style="background:#27ae60; border:none; color:#fff; font-family:inherit; font-size:10px; padding:4px 8px; border-radius:2px; cursor:pointer;">BUY</button>
                        </div>
                        <div style="background:#120e1a; padding:8px; border:1px solid #332742; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
                            <div style="flex:1;">&#x26CF;&#xFE0F; <strong>Iron Ore x50</strong><br><span style="color:#eab308; font-size:11px;">Price: 400 GP</span></div>
                            <button style="background:#27ae60; border:none; color:#fff; font-family:inherit; font-size:10px; padding:4px 8px; border-radius:2px; cursor:pointer;">BUY</button>
                        </div>
                    `;
                    break;
            }

            container.innerHTML = html;
        }
    };

})(window.UnkScape = window.UnkScape || {});
