<template>
    <div id="rvw_dev_tools">
        <!-- Drawer -->
        <div class="drawer" v-if="drawerOpen">
            <button class="close-drawer" @click.prevent="closeDrawer()"></button>
        </div>

        <!-- Toolbar -->
        <div class="toolbar" v-if="toolbarShown && !drawerOpen" @click.self="resetToolbar()">
            <!-- Basket -->
            <div class="toolbar-button-wrapper">
                <!-- Basket Popover -->
                <transition name="fade">
                    <div class="popover basket" id="popoverBasket" ref="popoverBasket" role="tooltip" v-if="popovers.basket">
                        <div class="table">
                            <a href="#debug" @click.prevent="openDrawer('debugger', 'debug')">
                                <span class="label">Debug</span>
                                <span class="count debug">0</span>
                            </a>
                            <a href="#error" @click.prevent="openDrawer('debugger', 'error')">
                                <span class="label">Error</span>
                                <span class="count error">0</span>
                            </a>
                            <a href="#fatal" @click.prevent="openDrawer('debugger', 'fatal')">
                                <span class="label">Fatal</span>
                                <span class="count fatal">0</span>
                            </a>
                            <a href="#info" @click.prevent="openDrawer('debugger', 'info')">
                                <span class="label">Info</span>
                                <span class="count info">0</span>
                            </a>
                            <a href="#log" @click.prevent="openDrawer('debugger', 'log')">
                                <span class="label">Log</span>
                                <span class="count log">0</span>
                            </a>
                            <a href="#warn" @click.prevent="openDrawer('debugger', 'warn')">
                                <span class="label">Warn</span>
                                <span class="count warn">0</span>
                            </a>
                        </div>
                    </div>
                </transition>

                <!-- Basket Button -->
                <button class="toolbar-button basket" id="popoverButtonBasket" ref="popoverButtonBasket" aria-describedby="popoverBasket"
                    @click.prevent="togglePopover('basket')"
                    v-tooltip="{ content: 'Basket', classes: popovers.basket ? 'disabled' : 'enabled', delay: { show: tooltipDelay } }"
                    :class="{ 'active': popovers.basket, 'no-count': basketCount === 0 }"
                >
                    <span v-if="basketCount > 0">{{ basketCount }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.12 47.06">
                        <g fill="none" stroke="#FFFFFF" stroke-miterlimit="10">
                            <ellipse cx="19.41" cy="41.45" rx="3.68" ry="3.78" stroke-width="3.65"/>
                            <ellipse cx="35.07" cy="41.45" rx="3.68" ry="3.78" stroke-width="3.65"/>
                            <path d="M10 8h35.41c.52 0 .82.07.67.55L40.68 26c-.15.47-.55 1.05-.91 1.05H15.63c-.36 0-.76-.72-.91-1.21L9.32 8.73C9.17 8.25 9.47 8 10 8z" stroke-width="4"/>
                            <path stroke-linecap="round" stroke-width="3.65" d="M9.28 7.86L7.44 3.23M15.73 26.78c-.34 0-.73.39-.88.88L12 35.3"/>
                            <path stroke-linecap="round" stroke-width="4" d="M2 2h5M12 36h29"/>
                        </g>
                    </svg>
                </button>
            </div>

            <!-- Geolocation -->
            <div class="toolbar-button-wrapper">
                <!-- Geolocation Popover -->
                <transition name="fade">
                    <div class="popover geolocation" id="popoverGeolocation" ref="popoverGeolocation" role="tooltip" v-if="popovers.geolocation">
                        <div class="table">
                            <a href="#debug" @click.prevent="openDrawer('debugger', 'debug')">
                                <span class="label">Debug</span>
                                <span class="count debug">0</span>
                            </a>
                            <a href="#error" @click.prevent="openDrawer('debugger', 'error')">
                                <span class="label">Error</span>
                                <span class="count error">0</span>
                            </a>
                            <a href="#fatal" @click.prevent="openDrawer('debugger', 'fatal')">
                                <span class="label">Fatal</span>
                                <span class="count fatal">0</span>
                            </a>
                            <a href="#info" @click.prevent="openDrawer('debugger', 'info')">
                                <span class="label">Info</span>
                                <span class="count info">0</span>
                            </a>
                            <a href="#log" @click.prevent="openDrawer('debugger', 'log')">
                                <span class="label">Log</span>
                                <span class="count log">0</span>
                            </a>
                            <a href="#warn" @click.prevent="openDrawer('debugger', 'warn')">
                                <span class="label">Warn</span>
                                <span class="count warn">0</span>
                            </a>
                        </div>
                    </div>
                </transition>

                <!-- Geolocation Button -->
                <button class="toolbar-button geolocation no-count" id="popoverButtonGeolocation" ref="popoverButtonGeolocation" aria-describedby="popoverGeolocation"
                    @click.prevent="togglePopover('geolocation')"
                    v-tooltip="{ content: 'Geolocation', classes: popovers.geolocation ? 'disabled' : 'enabled', delay: { show: tooltipDelay } }"
                    :class="{ 'active': popovers.geolocation }"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46">
                        <g fill="none" stroke="#FFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                            <path d="M18 2a15.82 15.82 0 0116 15.63A15.34 15.34 0 0130.83 27"/>
                            <circle cx="18" cy="17.63" r="5"/>
                            <path d="M18 44l12.83-17.03M18 2A15.82 15.82 0 002 17.63 15.34 15.34 0 005.17 27M18 44L5.17 26.97"/>
                        </g>
                    </svg>
                </button>
            </div>

            <!-- Messages -->
            <div class="toolbar-button-wrapper">
                <!-- Messages Popover -->
                <transition name="fade">
                    <div class="popover messages" id="popoverMessages" ref="popoverMessages" role="tooltip" v-if="popovers.messages">
                        <div class="table">
                            <button
                                @click.prevent="openDrawer('debugger', 'debug')"
                                :class="{ 'empty': messageCount.debug === 0 }"
                                v-tooltip.right="{ content: messageCount.debug > 0 ? 'View Debug Messages' : 'No Debug Messages', delay: { show: tooltipDelay } }"
                            >
                                <span class="label">Debug</span>
                                <span class="count debug">{{ messageCount.debug }}</span>
                            </button>
                            <button
                                @click.prevent="openDrawer('debugger', 'error')"
                                :class="{ 'empty': messageCount.error === 0 }"
                                v-tooltip.right="{ content: messageCount.error > 0 ? 'View Error Messages' : 'No Error Messages', delay: { show: tooltipDelay } }"
                            >
                                <span class="label">Error</span>
                                <span class="count error">{{ messageCount.error }}</span>
                            </button>
                            <button
                                @click.prevent="openDrawer('debugger', 'fatal')"
                                :class="{ 'empty': messageCount.fatal === 0 }"
                                v-tooltip.right="{ content: messageCount.fatal > 0 ? 'View Fatal Messages' : 'No Fatal Messages', delay: { show: tooltipDelay } }"
                            >
                                <span class="label">Fatal</span>
                                <span class="count fatal">{{ messageCount.fatal }}</span>
                            </button>
                            <button
                                @click.prevent="openDrawer('debugger', 'info')"
                                :class="{ 'empty': messageCount.info === 0 }"
                                v-tooltip.right="{ content: messageCount.info > 0 ? 'View Info Messages' : 'No Info Messages', delay: { show: tooltipDelay } }"
                            >
                                <span class="label">Info</span>
                                <span class="count info">{{ messageCount.info }}</span>
                            </button>
                            <button
                                @click.prevent="openDrawer('debugger', 'log')"
                                :class="{ 'empty': messageCount.log === 0 }"
                                v-tooltip.right="{ content: messageCount.log > 0 ? 'View Log Messages' : 'No Log Messages', delay: { show: tooltipDelay } }"
                            >
                                <span class="label">Log</span>
                                <span class="count log">{{ messageCount.log }}</span>
                            </button>
                            <button
                                @click.prevent="openDrawer('debugger', 'warn')"
                                :class="{ 'empty': messageCount.warn === 0 }"
                                v-tooltip.right="{ content: messageCount.warn > 0 ? 'View Warn Messages' : 'No Warn Messages', delay: { show: tooltipDelay } }"
                            >
                                <span class="label">Warn</span>
                                <span class="count warn">{{ messageCount.warn }}</span>
                            </button>
                        </div>
                    </div>
                </transition>

                <!-- Messages Button -->
                <button class="toolbar-button messages" id="popoverButtonMessages" ref="popoverButtonMessages" aria-describedby="popoverMessages"
                    @click.prevent="togglePopover('messages')"
                    v-tooltip="{ content: 'Messages', classes: popovers.messages ? 'disabled' : 'enabled', delay: { show: tooltipDelay } }"
                    :class="[{ 'active': popovers.messages, 'no-count': messageCount.total === 0 }, messageClass]"
                >
                    <span v-if="messageCount.total > 0">{{ messageCount.total }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 42.83">
                        <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                            <path d="M15 32.08H3c-.55 0-1-.81-1-1.37V2.34c0-.56.45-.26 1-.26h40c.55 0 1-.3 1 .26v28.37c0 .56-.45 1.37-1 1.37H29M22 40.83l6.63-8.11M22 40.83l-6.62-8.11"/>
                        </g>
                    </svg>
                </button>
            </div>

            <!-- Preferences -->
            <div class="toolbar-button-wrapper">
                <!-- Preferences Popover -->
                <transition name="fade">
                    <div class="popover preferences" id="popoverPreferences" ref="popoverPreferences" role="tooltip" v-if="popovers.preferences">
                        <div class="table">
                            <a href="#debug" @click.prevent="openDrawer('debugger', 'debug')">
                                <span class="label">Debug</span>
                                <span class="count debug">0</span>
                            </a>
                            <a href="#error" @click.prevent="openDrawer('debugger', 'error')">
                                <span class="label">Error</span>
                                <span class="count error">0</span>
                            </a>
                            <a href="#fatal" @click.prevent="openDrawer('debugger', 'fatal')">
                                <span class="label">Fatal</span>
                                <span class="count fatal">0</span>
                            </a>
                            <a href="#info" @click.prevent="openDrawer('debugger', 'info')">
                                <span class="label">Info</span>
                                <span class="count info">0</span>
                            </a>
                            <a href="#log" @click.prevent="openDrawer('debugger', 'log')">
                                <span class="label">Log</span>
                                <span class="count log">0</span>
                            </a>
                            <a href="#warn" @click.prevent="openDrawer('debugger', 'warn')">
                                <span class="label">Warn</span>
                                <span class="count warn">0</span>
                            </a>
                        </div>
                    </div>
                </transition>

                <!-- Preferences Button -->
                <button class="toolbar-button preferences no-count" id="popoverButtonPreferences" ref="popoverButtonPreferences" aria-describedby="popoverPreferences"
                    @click.prevent="togglePopover('preferences')"
                    v-tooltip="{ content: 'Preferences', classes: popovers.preferences ? 'disabled' : 'enabled', delay: { show: tooltipDelay } }"
                    :class="{ 'active': popovers.preferences }"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 44">
                        <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                            <path d="M2 6h8M10 2h12v8H10zM22 6h22M44 22h-8M36 26H24v-8h12zM24 22H2M2 38h8M10 34h12v8H10zM22 38h22"/>
                        </g>
                    </svg>
                </button>
            </div>

            <!-- Session -->
            <div class="toolbar-button-wrapper">
                <!-- Session Popover -->
                <transition name="fade">
                    <div class="popover session" id="popoverSession" ref="popoverSession" role="tooltip" v-if="popovers.session">
                        <div class="table">
                            <a href="#debug" @click.prevent="openDrawer('debugger', 'debug')">
                                <span class="label">Debug</span>
                                <span class="count debug">0</span>
                            </a>
                            <a href="#error" @click.prevent="openDrawer('debugger', 'error')">
                                <span class="label">Error</span>
                                <span class="count error">0</span>
                            </a>
                            <a href="#fatal" @click.prevent="openDrawer('debugger', 'fatal')">
                                <span class="label">Fatal</span>
                                <span class="count fatal">0</span>
                            </a>
                            <a href="#info" @click.prevent="openDrawer('debugger', 'info')">
                                <span class="label">Info</span>
                                <span class="count info">0</span>
                            </a>
                            <a href="#log" @click.prevent="openDrawer('debugger', 'log')">
                                <span class="label">Log</span>
                                <span class="count log">0</span>
                            </a>
                            <a href="#warn" @click.prevent="openDrawer('debugger', 'warn')">
                                <span class="label">Warn</span>
                                <span class="count warn">0</span>
                            </a>
                        </div>
                    </div>
                </transition>

                <!-- Session Button -->
                <button class="toolbar-button session no-count" id="popoverButtonSession" ref="popoverButtonSession" aria-describedby="popoverSession"
                    @click.prevent="togglePopover('session')"
                    v-tooltip="{ content: 'Session', classes: popovers.session ? 'disabled' : 'enabled', delay: { show: tooltipDelay } }"
                    :class="{ 'active': popovers.session }"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.92 41.92">
                        <g fill="none" stroke="#FFFFFF" stroke-linecap="round">
                            <circle cx="20.96" cy="20.96" r="19" stroke-miterlimit="10" stroke-width="3.92"/>
                            <path stroke-linejoin="round" stroke-width="4" d="M19.96 12.46v9.22l5.34 3.72"/>
                        </g>
                    </svg>
                </button>
            </div>

            <!-- Site -->
            <div class="toolbar-button-wrapper">
                <!-- Site Popover -->
                <transition name="fade">
                    <div class="popover site" id="popoverSite" ref="popoverSite" role="tooltip" v-if="popovers.site">
                        <div class="table">
                            <a href="#debug" @click.prevent="openDrawer('debugger', 'debug')">
                                <span class="label">Debug</span>
                                <span class="count debug">0</span>
                            </a>
                            <a href="#error" @click.prevent="openDrawer('debugger', 'error')">
                                <span class="label">Error</span>
                                <span class="count error">0</span>
                            </a>
                            <a href="#fatal" @click.prevent="openDrawer('debugger', 'fatal')">
                                <span class="label">Fatal</span>
                                <span class="count fatal">0</span>
                            </a>
                            <a href="#info" @click.prevent="openDrawer('debugger', 'info')">
                                <span class="label">Info</span>
                                <span class="count info">0</span>
                            </a>
                            <a href="#log" @click.prevent="openDrawer('debugger', 'log')">
                                <span class="label">Log</span>
                                <span class="count log">0</span>
                            </a>
                            <a href="#warn" @click.prevent="openDrawer('debugger', 'warn')">
                                <span class="label">Warn</span>
                                <span class="count warn">0</span>
                            </a>
                        </div>
                    </div>
                </transition>

                <!-- Site Button -->
                <button class="toolbar-button site no-count" id="popoverButtonSite" ref="popoverButtonSite" aria-describedby="popoverSite"
                    @click.prevent="togglePopover('site')"
                    v-tooltip="{ content: 'Site', classes: popovers.site ? 'disabled' : 'enabled', delay: { show: tooltipDelay } }"
                    :class="{ 'active': popovers.site }"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 46">
                        <g fill="none" stroke="#FFFFFF" stroke-linejoin="round" stroke-width="4">
                            <path d="M13 44H2.88a.78.78 0 01-.88-.74V18M38 19v24.26a.78.78 0 01-.88.74H26"/>
                            <path stroke-linecap="round" d="M38 18.89L20 2 2 18.43"/>
                            <path d="M14 46V31h12v15"/>
                        </g>
                    </svg>
                </button>
            </div>

            <!-- User -->
            <div class="toolbar-button-wrapper">
                <!-- User Popover -->
                <transition name="fade">
                    <div class="popover user" id="popoverUser" ref="popoverUser" role="tooltip" v-if="popovers.user">
                        <div class="table">
                            <a href="#debug" @click.prevent="openDrawer('debugger', 'debug')">
                                <span class="label">Debug</span>
                                <span class="count debug">0</span>
                            </a>
                            <a href="#error" @click.prevent="openDrawer('debugger', 'error')">
                                <span class="label">Error</span>
                                <span class="count error">0</span>
                            </a>
                            <a href="#fatal" @click.prevent="openDrawer('debugger', 'fatal')">
                                <span class="label">Fatal</span>
                                <span class="count fatal">0</span>
                            </a>
                            <a href="#info" @click.prevent="openDrawer('debugger', 'info')">
                                <span class="label">Info</span>
                                <span class="count info">0</span>
                            </a>
                            <a href="#log" @click.prevent="openDrawer('debugger', 'log')">
                                <span class="label">Log</span>
                                <span class="count log">0</span>
                            </a>
                            <a href="#warn" @click.prevent="openDrawer('debugger', 'warn')">
                                <span class="label">Warn</span>
                                <span class="count warn">0</span>
                            </a>
                        </div>
                    </div>
                </transition>

                <!-- User Button -->
                <button class="toolbar-button user no-count" id="popoverButtonUser" ref="popoverButtonUser" aria-describedby="popoverUser"
                    @click.prevent="togglePopover('user')"
                    v-tooltip="{ content: 'User', classes: popovers.user ? 'disabled' : 'enabled', delay: { show: tooltipDelay } }"
                    :class="{ 'active': popovers.user }"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 46.99">
                        <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4">
                            <circle cx="22" cy="13" r="11"/>
                            <path d="M42 36.74v6.07c0 .58-.2 2.18-.78 2.18H3.28C2.71 45 2 43.39 2 42.81v-6.57c0-6.63 9-12 20-12s20 5.37 20 12z"/>
                        </g>
                    </svg>
                </button>
            </div>

            <!-- Close Toolbar -->
            <button class="hide-toolbar" @click="closeToolbar()" v-tooltip="{ content: 'Hide Toolbar', delay: { show: tooltipDelay } }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.84 33.67">
                    <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4">
                        <path d="M2 2l29.84 29.67M31.84 2L2 31.67"/>
                    </g>
                </svg>
            </button>
        </div>

        <!-- Show Toolbar -->
        <button class="show-toolbar"
            v-if="!toolbarShown && !drawerOpen"
            @click="openToolbar()"
            v-tooltip="{ content: 'Show Toolbar', delay: { show: tooltipDelay } }"
        ></button>
    </div>
</template>

<script>
export default {
    name: 'DevTools',
    components: {},
    data() {
        return {
            basketCount: 0,
            debugData: null,
            drawerOpen: false,
            lastDebugTimeStamp: 0,
            messageCount: {
                debug: 0,
                error: 0,
                fatal: 0,
                info: 0,
                log: 0,
                warn: 0,
                total: 0
            },
            popovers: {
                basket: false,
                geolocation: false,
                messages: false,
                preferences: false,
                session: false,
                site: false,
                user: false
            },
            section: null,
            subsection: null,
            toolbarShown: false,
            tooltipDelay: 300
        };
    },
    mounted() {
        const drawerOpen = localStorage.getItem('RVW_DrawerOpen');
        const toolbarShown = localStorage.getItem('RVW_ToolbarShown');

        if (drawerOpen) {
            this.drawerOpen = JSON.parse(drawerOpen);
        }

        if (toolbarShown) {
            this.toolbarShown = JSON.parse(toolbarShown);
        }

        if (this.drawerOpen || this.toolbarShown) {
            this.fetchData();
        }
    },
    computed: {
        messageClass() {
            if (this.messageCount.fatal > 0) {
                return 'fatal';
            } else if (this.messageCount.error > 0) {
                return 'error';
            } else if (this.messageCount.warn > 0) {
                return 'warn';
            } else if (this.messageCount.info > 0) {
                return 'info';
            } else if (this.messageCount.debug > 0) {
                return 'debug';
            } else if (this.messageCount.log > 0) {
                return 'log';
            }

            return '';
        },
    },
    methods: {
        closeDrawer() {
            this.drawerOpen = false;
            this.section = null;
            this.subsection = null;
        },
        closeToolbar() {
            this.resetToolbar();
            this.toolbarShown = false;
        },
        async fetchData() {
            const response = await this.axios.get(`${window.RVW_DevToolsURL}?timestamp=${this.lastDebugTimeStamp}`);

            if (response && typeof response.data !== 'undefined') {
                this.debugData = response.data;

                if (typeof response.data.messages !== 'undefined') {
                    const msg = response.data.messages;

                    console.log(msg);

                    this.messageCount.debug = msg.debug.length;
                    this.messageCount.error = msg.error.length;
                    this.messageCount.fatal = msg.fatal.length;
                    this.messageCount.info = msg.info.length;
                    this.messageCount.log = msg.log.length;
                    this.messageCount.warn = msg.warn.length;
                    this.messageCount.total = (msg.debug.length + msg.error.length + msg.fatal.length + msg.info.length + msg.log.length + msg.warn.length);
                }
            }
        },
        openDrawer(section, subsection) {
            this.resetToolbar();
            this.section = section;
            this.subsection = subsection;
            this.drawerOpen = true;
        },
        openToolbar() {
            this.toolbarShown = true;
        },
        resetToolbar(ignore) {
            Object.keys(this.popovers).forEach((id) => {
                if (!ignore || ignore !== id) {
                    this.popovers[id] = false;
                }
            });
        },
        togglePopover(id) {
            this.resetToolbar(id);
            this.popovers[id] = !this.popovers[id];
        }
    },
    watch: {
        drawerOpen: {
            handler() {
                localStorage.setItem('RVW_DrawerOpen', this.drawerOpen);
            }
        },
        toolbarShown: {
            handler() {
                localStorage.setItem('RVW_ToolbarShown', this.toolbarShown);
            }
        }
    }
};
</script>
