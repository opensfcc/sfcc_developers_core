<template>
    <div id="rvw_dev_tools">
        <!-- Drawer -->
        <transition name="fade">
            <div class="devtool-drawer" v-if="drawerOpen">
                <button class="devtool-close-drawer" @click.prevent="closeDrawer()" data-devtool>
                    <svg role="img"><use href="#devtool-close"/></svg>
                </button>

                <div class="devtool-menu">
                    <ul>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('basket', '')" :class="{ 'active': section === 'basket' }">
                                <svg role="img"><use href="#devtool-basket"/></svg>
                                <span>Basket</span>
                                <span class="count" v-if="basketCount > 0">{{ basketCount }}</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('geolocation', '')" :class="{ 'active': section === 'geolocation' }">
                                <svg role="img"><use href="#devtool-geolocation"/></svg>
                                <span>Geolocation</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('messages', '')" :class="{ 'active': section === 'messages' }">
                                <svg role="img"><use href="#devtool-messages"/></svg>
                                <span>Messages</span>
                                <span class="count" :class="messageClass" v-if="messageCount.total > 0">{{ messageCount.total }}</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('preferences', '')" :class="{ 'active': section === 'preferences' }">
                                <svg role="img"><use href="#devtool-preferences"/></svg>
                                <span>Preferences</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('session', '')" :class="{ 'active': section === 'session' }">
                                <svg role="img"><use href="#devtool-session"/></svg>
                                <span>Session</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('site', '')" :class="{ 'active': section === 'site' }">
                                <svg role="img"><use href="#devtool-site"/></svg>
                                <span>Site</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('user', '')" :class="{ 'active': section === 'user' }">
                                <svg role="img"><use href="#devtool-user"/></svg>
                                <span>User</span>
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Basket Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-basket" v-if="section === 'basket'">
                        Basket
                    </div>
                </transition>

                <!-- Geolocation Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-geolocation" v-if="section === 'geolocation'">
                        Geolocation
                    </div>
                </transition>

                <!-- Messages Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-messages" v-if="section === 'messages'">
                        Messages
                    </div>
                </transition>

                <!-- Preferences Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-preferences" v-if="section === 'preferences'">
                        Preferences
                    </div>
                </transition>

                <!-- Session Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-session" v-if="section === 'session'">
                        Session
                    </div>
                </transition>

                <!-- Site Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-site" v-if="section === 'site'">
                        Site
                    </div>
                </transition>

                <!-- User Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-user" v-if="section === 'user'">
                        User
                    </div>
                </transition>
            </div>
        </transition>

        <!-- Toolbar -->
        <transition name="fade">
            <div class="devtool-toolbar" v-if="toolbarShown && !drawerOpen" @click.self="resetToolbar()">
                <!-- Basket -->
                <div class="toolbar-button-wrapper">
                    <!-- Basket Popover -->
                    <transition name="fade">
                        <div class="devtool-popover basket" id="popoverBasket" ref="popoverBasket" role="tooltip" v-if="popovers.basket">
                            <div class="table"></div>
                        </div>
                    </transition>

                    <!-- Basket Button -->
                    <button class="toolbar-button basket" id="popoverButtonBasket" ref="popoverButtonBasket" aria-describedby="popoverBasket" data-devtool
                        @click.prevent="togglePopover('basket')"
                        v-tooltip="{ content: 'Basket', classes: popovers.basket ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.basket, 'no-count': basketCount === 0 }"
                    >
                        <span v-if="basketCount > 0">{{ basketCount }}</span>
                        <svg role="img"><use href="#devtool-basket"/></svg>
                    </button>
                </div>

                <!-- Geolocation -->
                <div class="toolbar-button-wrapper">
                    <!-- Geolocation Popover -->
                    <transition name="fade">
                        <div class="devtool-popover geolocation" id="popoverGeolocation" ref="popoverGeolocation" role="tooltip" v-if="popovers.geolocation">
                            <div class="table"></div>
                        </div>
                    </transition>

                    <!-- Geolocation Button -->
                    <button class="toolbar-button geolocation no-count" id="popoverButtonGeolocation" ref="popoverButtonGeolocation" aria-describedby="popoverGeolocation" data-devtool
                        @click.prevent="togglePopover('geolocation')"
                        v-tooltip="{ content: 'Geolocation', classes: popovers.geolocation ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.geolocation }"
                    >
                        <svg role="img"><use href="#devtool-geolocation"/></svg>
                    </button>
                </div>

                <!-- Messages -->
                <div class="toolbar-button-wrapper">
                    <!-- Messages Popover -->
                    <transition name="fade">
                        <div class="devtool-popover messages" id="popoverMessages" ref="popoverMessages" role="tooltip" v-if="popovers.messages">
                            <div class="table">
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'debug')"
                                    :class="{ 'empty': messageCount.debug === 0 }"
                                    v-tooltip.right="{ content: messageCount.debug > 0 ? 'View Debug Messages' : 'No Debug Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Debug</span>
                                    <span class="count notice-debug">{{ messageCount.debug }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'error')"
                                    :class="{ 'empty': messageCount.error === 0 }"
                                    v-tooltip.right="{ content: messageCount.error > 0 ? 'View Error Messages' : 'No Error Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Error</span>
                                    <span class="count notice-error">{{ messageCount.error }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'fatal')"
                                    :class="{ 'empty': messageCount.fatal === 0 }"
                                    v-tooltip.right="{ content: messageCount.fatal > 0 ? 'View Fatal Messages' : 'No Fatal Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Fatal</span>
                                    <span class="count notice-fatal">{{ messageCount.fatal }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'info')"
                                    :class="{ 'empty': messageCount.info === 0 }"
                                    v-tooltip.right="{ content: messageCount.info > 0 ? 'View Info Messages' : 'No Info Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Info</span>
                                    <span class="count notice-info">{{ messageCount.info }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'log')"
                                    :class="{ 'empty': messageCount.log === 0 }"
                                    v-tooltip.right="{ content: messageCount.log > 0 ? 'View Log Messages' : 'No Log Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Log</span>
                                    <span class="count notice-log">{{ messageCount.log }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'warn')"
                                    :class="{ 'empty': messageCount.warn === 0 }"
                                    v-tooltip.right="{ content: messageCount.warn > 0 ? 'View Warn Messages' : 'No Warn Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Warn</span>
                                    <span class="count notice-warn">{{ messageCount.warn }}</span>
                                </button>
                            </div>
                        </div>
                    </transition>

                    <!-- Messages Button -->
                    <button class="toolbar-button messages" id="popoverButtonMessages" ref="popoverButtonMessages" aria-describedby="popoverMessages" data-devtool
                        @click.prevent="togglePopover('messages')"
                        v-tooltip="{ content: 'Messages', classes: popovers.messages ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="[{ 'active': popovers.messages, 'no-count': messageCount.total === 0 }, messageClass]"
                    >
                        <span v-if="messageCount.total > 0">{{ messageCount.total }}</span>
                        <svg role="img"><use href="#devtool-messages"/></svg>
                    </button>
                </div>

                <!-- Preferences -->
                <div class="toolbar-button-wrapper">
                    <!-- Preferences Popover -->
                    <transition name="fade">
                        <div class="devtool-popover preferences" id="popoverPreferences" ref="popoverPreferences" role="tooltip" v-if="popovers.preferences">
                            <div class="table"></div>
                        </div>
                    </transition>

                    <!-- Preferences Button -->
                    <button class="toolbar-button preferences no-count" id="popoverButtonPreferences" ref="popoverButtonPreferences" aria-describedby="popoverPreferences" data-devtool
                        @click.prevent="togglePopover('preferences')"
                        v-tooltip="{ content: 'Preferences', classes: popovers.preferences ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.preferences }"
                    >
                        <svg role="img"><use href="#devtool-preferences"/></svg>
                    </button>
                </div>

                <!-- Session -->
                <div class="toolbar-button-wrapper">
                    <!-- Session Popover -->
                    <transition name="fade">
                        <div class="devtool-popover session" id="popoverSession" ref="popoverSession" role="tooltip" v-if="popovers.session">
                            <div class="table"></div>
                        </div>
                    </transition>

                    <!-- Session Button -->
                    <button class="toolbar-button session no-count" id="popoverButtonSession" ref="popoverButtonSession" aria-describedby="popoverSession" data-devtool
                        @click.prevent="togglePopover('session')"
                        v-tooltip="{ content: 'Session', classes: popovers.session ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.session }"
                    >
                        <svg role="img"><use href="#devtool-session"/></svg>
                    </button>
                </div>

                <!-- Site -->
                <div class="toolbar-button-wrapper">
                    <!-- Site Popover -->
                    <transition name="fade">
                        <div class="devtool-popover site" id="popoverSite" ref="popoverSite" role="tooltip" v-if="popovers.site">
                            <div class="table"></div>
                        </div>
                    </transition>

                    <!-- Site Button -->
                    <button class="toolbar-button site no-count" id="popoverButtonSite" ref="popoverButtonSite" aria-describedby="popoverSite" data-devtool
                        @click.prevent="togglePopover('site')"
                        v-tooltip="{ content: 'Site', classes: popovers.site ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.site }"
                    >
                        <svg role="img"><use href="#devtool-site"/></svg>
                    </button>
                </div>

                <!-- User -->
                <div class="toolbar-button-wrapper">
                    <!-- User Popover -->
                    <transition name="fade">
                        <div class="devtool-popover user" id="popoverUser" ref="popoverUser" role="tooltip" v-if="popovers.user">
                            <div class="table"></div>
                        </div>
                    </transition>

                    <!-- User Button -->
                    <button class="toolbar-button user no-count" id="popoverButtonUser" ref="popoverButtonUser" aria-describedby="popoverUser" data-devtool
                        @click.prevent="togglePopover('user')"
                        v-tooltip="{ content: 'User', classes: popovers.user ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.user }"
                    >
                        <svg role="img"><use href="#devtool-user"/></svg>
                    </button>
                </div>

                <!-- Close Toolbar -->
                <button class="hide-toolbar" @click="closeToolbar()" v-tooltip="{ content: 'Hide Toolbar', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }" data-devtool>
                    <svg role="img"><use href="#devtool-close"/></svg>
                </button>
            </div>
        </transition>

        <!-- Show Toolbar -->
        <transition name="fade">
            <button class="devtool-show-toolbar" data-devtool
                v-if="!toolbarShown && !drawerOpen"
                @click="openToolbar()"
                v-tooltip="{ content: 'Show Toolbar', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
            ></button>
        </transition>

        <!-- SVG Sprites -->
        <svg xmlns="http://www.w3.org/2000/svg">
            <symbol id="devtool-basket" viewBox="0 0 48.12 47.06">
                <g fill="none" stroke="#FFFFFF" stroke-miterlimit="10">
                    <ellipse cx="19.41" cy="41.45" rx="3.68" ry="3.78" stroke-width="3.65"/>
                    <ellipse cx="35.07" cy="41.45" rx="3.68" ry="3.78" stroke-width="3.65"/>
                    <path d="M10 8h35.41c.52 0 .82.07.67.55L40.68 26c-.15.47-.55 1.05-.91 1.05H15.63c-.36 0-.76-.72-.91-1.21L9.32 8.73C9.17 8.25 9.47 8 10 8z" stroke-width="4"/>
                    <path stroke-linecap="round" stroke-width="3.65" d="M9.28 7.86L7.44 3.23M15.73 26.78c-.34 0-.73.39-.88.88L12 35.3"/>
                    <path stroke-linecap="round" stroke-width="4" d="M2 2h5M12 36h29"/>
                </g>
            </symbol>
            <symbol id="devtool-close" viewBox="0 0 33.84 33.67">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4">
                    <path d="M2 2l29.84 29.67M31.84 2L2 31.67"/>
                </g>
            </symbol>
            <symbol id="devtool-geolocation" viewBox="0 0 36 46">
                <g fill="none" stroke="#FFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                    <path d="M18 2a15.82 15.82 0 0116 15.63A15.34 15.34 0 0130.83 27"/>
                    <circle cx="18" cy="17.63" r="5"/>
                    <path d="M18 44l12.83-17.03M18 2A15.82 15.82 0 002 17.63 15.34 15.34 0 005.17 27M18 44L5.17 26.97"/>
                </g>
            </symbol>
            <symbol id="devtool-messages" viewBox="0 0 46 42.83">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                    <path d="M15 32.08H3c-.55 0-1-.81-1-1.37V2.34c0-.56.45-.26 1-.26h40c.55 0 1-.3 1 .26v28.37c0 .56-.45 1.37-1 1.37H29M22 40.83l6.63-8.11M22 40.83l-6.62-8.11"/>
                </g>
            </symbol>
            <symbol id="devtool-preferences" viewBox="0 0 46 44">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                    <path d="M2 6h8M10 2h12v8H10zM22 6h22M44 22h-8M36 26H24v-8h12zM24 22H2M2 38h8M10 34h12v8H10zM22 38h22"/>
                </g>
            </symbol>
            <symbol id="devtool-session" viewBox="0 0 41.92 41.92">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round">
                    <circle cx="20.96" cy="20.96" r="19" stroke-miterlimit="10" stroke-width="3.92"/>
                    <path stroke-linejoin="round" stroke-width="4" d="M19.96 12.46v9.22l5.34 3.72"/>
                </g>
            </symbol>
            <symbol id="devtool-site" viewBox="0 0 40 46">
                <g fill="none" stroke="#FFFFFF" stroke-linejoin="round" stroke-width="4">
                    <path d="M13 44H2.88a.78.78 0 01-.88-.74V18M38 19v24.26a.78.78 0 01-.88.74H26"/>
                    <path stroke-linecap="round" d="M38 18.89L20 2 2 18.43"/>
                    <path d="M14 46V31h12v15"/>
                </g>
            </symbol>
            <symbol id="devtool-user" viewBox="0 0 44 46.99">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4">
                    <circle cx="22" cy="13" r="11"/>
                    <path d="M42 36.74v6.07c0 .58-.2 2.18-.78 2.18H3.28C2.71 45 2 43.39 2 42.81v-6.57c0-6.63 9-12 20-12s20 5.37 20 12z"/>
                </g>
            </symbol>
        </svg>
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
            debugTimout: null,
            drawerOpen: false,
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
            tooltipDelay: 300,
            listeningForClicks: false
        };
    },
    mounted() {
        const drawerOpen = localStorage.getItem('RVW_DrawerOpen');
        const toolbarShown = localStorage.getItem('RVW_ToolbarShown');
        const section = localStorage.getItem('RVW_DrawerSection');
        const subsection = localStorage.getItem('RVW_DrawerSubsection');

        if (drawerOpen) {
            this.drawerOpen = JSON.parse(drawerOpen);
        }

        if (toolbarShown) {
            this.toolbarShown = JSON.parse(toolbarShown);
        }

        if (section) {
            this.section = section;
        }

        if (subsection) {
            this.subsection = subsection;
        }

        if (this.drawerOpen || this.toolbarShown) {
            this.fetchData();
            this.eventListener();
        }
    },
    computed: {
        messageClass() {
            if (this.messageCount.fatal > 0) {
                return 'notice-fatal';
            } else if (this.messageCount.error > 0) {
                return 'notice-error';
            } else if (this.messageCount.warn > 0) {
                return 'notice-warn';
            } else if (this.messageCount.info > 0) {
                return 'notice-info';
            } else if (this.messageCount.debug > 0) {
                return 'notice-debug';
            } else if (this.messageCount.log > 0) {
                return 'notice-log';
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
        eventHandler(evt) {
            // Only pay attention to elements that are likely to trigger AJAX calls
            const canTriggerAjax = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];

            if (canTriggerAjax.indexOf(evt.target.tagName) > -1 && (!evt.target.hasAttribute || (evt.target.hasAttribute && !evt.target.hasAttribute('data-devtool')))) {
                clearTimeout(this.debugTimout);
                this.debugTimout = setTimeout(this.fetchData, 1000);
            }
        },
        eventListener() {
            if (!this.drawerOpen && !this.toolbarShown && this.listeningForClicks) {
                clearTimeout(this.debugTimout);
                document.removeEventListener('click', this.eventHandler, { passive: true });
                document.removeEventListener('change', this.eventHandler, { passive: true });
                this.listeningForClicks = false;
            } else if (!this.listeningForClicks) {
                document.addEventListener('click', this.eventHandler, { passive: true });
                document.addEventListener('change', this.eventHandler, { passive: true });
                this.listeningForClicks = true;
            }
        },
        async fetchData() {
            const response = await this.axios.get(window.RVW_DevToolsURL);

            if (response && typeof response.data !== 'undefined') {
                this.debugData = response.data;

                if (typeof response.data.messages !== 'undefined') {
                    const msg = response.data.messages;

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
                this.eventListener();
            }
        },
        section: {
            handler() {
                localStorage.setItem('RVW_DrawerSection', this.section);
            }
        },
        subsection: {
            handler() {
                localStorage.setItem('RVW_DrawerSubsection', this.subsection);
            }
        },
        toolbarShown: {
            handler() {
                localStorage.setItem('RVW_ToolbarShown', this.toolbarShown);
                this.eventListener();
            }
        }
    }
};
</script>
