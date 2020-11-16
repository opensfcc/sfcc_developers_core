/**
 * Red Van Workshop
 * (c) 2020 RedVanWorkshop.com
 * License: https://github.com/redvanworkshop/rvw_dev_tools/blob/master/README
 */
var RVW_DevTools = (function() {
    /**
     * DOM Elements
     */
    var $elm = {};

    /**
     * Handle Prevent Default for Different Conditions
     * @param {Object} evt
     */
    function preventDefault(evt) {
        evt = evt || window.event;
        if (evt.preventDefault) {
            evt.preventDefault();
        }

        evt.returnValue = false;
    }

    /**
     * Bind Events to DOM Elements
     */
    function bindEvents() {
        $elm.drawer = document.querySelector('#rvw-devtools');
        $elm.drawerButton = document.querySelector('#rvw-devtools button.toggle');

        // Handle Drawer Button Clicks
        $elm.drawerButton.addEventListener('click', function(evt) {
            RVW_DevTools.config.drawerOpen = !RVW_DevTools.config.drawerOpen;
            $elm.drawer.classList = (RVW_DevTools.config.drawerOpen) ? 'open' : 'closed';
            preventDefault(evt);
        });

        // Prevent Drawer Scroll Event Passthrough
        $elm.drawer.addEventListener('mousewheel', function(evt) {
            //preventDefault(evt);
        });

        // Prevent Drawer Scroll Event Passthrough on Firefox
        $elm.drawer.addEventListener('DOMMouseScroll', function(evt) {
            //preventDefault(evt);
        });

        // Prevent Drawer Scroll Event Passthrough on Touch Devices
        $elm.drawer.addEventListener('touchmove', function(evt) {
            //preventDefault(evt);
        });
    }

    /**
     * Return Dev Tools Object
     */
    return {
        /**
         * Config Settings
         */
        config: {
            activeTab: 'console',
            drawerOpen: false
        },

        /**
         * Initialize App
         */
        init: function() {
            bindEvents();
        },

        /**
         * Switch Dev Tools Tab
         * @param {String} tab
         */
        switchTab: function(tab) {
            RVW_DevTools.config.activeTab = tab;
        }
    }
})();

/**
 * Initialize Dev Tools on Page Load
 */
window.addEventListener('load', function() {
    RVW_DevTools.init();
});
