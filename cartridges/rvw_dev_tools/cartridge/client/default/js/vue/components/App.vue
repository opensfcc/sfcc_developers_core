<template>
    <div id="rvw_dev_tools">
        <!-- Drawer -->
        <div class="drawer" v-if="drawerOpen">
            <button class="close-drawer" @click.prevent="closeDrawer()"></button>
        </div>

        <!-- Toolbar -->
        <div class="toolbar" v-if="toolbarShown && !drawerOpen">
            <div class="toolbar-button-wrapper">
                <!-- Messages Popover -->
                <transition name="fade">
                    <div class="popover messages" id="popoverMessages" ref="popoverMessages" role="tooltip" v-show="popoverMessages">
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

                <!-- Messages Button -->
                <button class="toolbar-button messages" id="popoverButtonMessages" ref="popoverButtonMessages" aria-describedby="popoverMessages" @click="popoverMessages = !popoverMessages">
                    {{ messageCount }}
                    <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 360 360" xml:space="preserve">
                        <g>
                            <path d="M344.259 126.683h-48.518V77.834L212.719 0H15.741v360h280v-50.59h48.518V126.683zm-30 152.727h-210V156.683h210V279.41z"/>
                            <path d="M170.892 234.942h-31.857V183.11h-12.143v62.48h44z"/>
                            <path d="M178.943 236.218c2.669 2.963 5.866 5.339 9.593 7.128 3.725 1.79 7.876 2.684 12.451 2.684 4.4 0 8.477-.865 12.232-2.596 3.754-1.73 6.98-4.048 9.68-6.952 2.698-2.904 4.811-6.248 6.336-10.032 1.525-3.784 2.288-7.758 2.288-11.924 0-3.93-.734-7.802-2.199-11.616-1.468-3.813-3.521-7.216-6.16-10.208-2.641-2.992-5.823-5.412-9.548-7.26-3.727-1.848-7.848-2.772-12.364-2.772-4.4 0-8.479.866-12.232 2.596-3.755 1.732-6.996 4.064-9.724 6.996-2.729 2.935-4.87 6.307-6.424 10.12-1.556 3.814-2.332 7.803-2.332 11.968 0 3.991.733 7.892 2.2 11.704 1.465 3.814 3.533 7.202 6.203 10.164zm5.105-29.48c.792-2.493 1.949-4.722 3.476-6.688 1.525-1.965 3.433-3.549 5.721-4.752 2.288-1.202 4.898-1.804 7.832-1.804 2.815 0 5.352.572 7.611 1.716 2.258 1.144 4.165 2.684 5.721 4.62 1.554 1.936 2.757 4.166 3.607 6.688.85 2.523 1.276 5.134 1.276 7.831 0 2.583-.397 5.119-1.189 7.612-.792 2.494-1.966 4.738-3.52 6.732-1.556 1.995-3.463 3.594-5.721 4.796-2.259 1.203-4.854 1.804-7.787 1.804-2.876 0-5.442-.586-7.7-1.76-2.26-1.173-4.166-2.728-5.72-4.664-1.556-1.936-2.743-4.165-3.564-6.688-.822-2.521-1.232-5.133-1.232-7.832 0-2.58.397-5.117 1.189-7.611z"/><path id="XMLID_236_" d="M245.823 236.79c2.669 2.875 5.809 5.134 9.416 6.776 3.608 1.643 7.465 2.464 11.572 2.464 6.629 0 12.436-2.493 17.424-7.48v7.04h10.032v-32.12h-22.616v8.888h12.584v4.4c-4.87 5.691-10.326 8.536-16.368 8.536-2.64 0-5.09-.542-7.348-1.628-2.259-1.085-4.21-2.566-5.852-4.444-1.644-1.877-2.935-4.092-3.872-6.644-.939-2.552-1.408-5.293-1.408-8.228 0-2.816.425-5.485 1.276-8.008.85-2.521 2.053-4.752 3.607-6.688 1.554-1.936 3.432-3.461 5.632-4.576 2.2-1.114 4.62-1.672 7.261-1.672 3.344 0 6.438.822 9.283 2.464 2.845 1.644 5.061 4.02 6.645 7.128l9.064-6.688c-2.111-4.165-5.266-7.48-9.46-9.944-4.195-2.464-9.226-3.696-15.092-3.696-4.342 0-8.36.836-12.056 2.508-3.696 1.672-6.908 3.931-9.637 6.776-2.728 2.847-4.87 6.16-6.424 9.944-1.555 3.784-2.332 7.818-2.332 12.1 0 4.518.777 8.727 2.332 12.628 1.555 3.902 3.667 7.29 6.337 10.164z"/>
                        </g>
                    </svg>
                </button>
            </div>

            <!-- Close Toolbar -->
            <button class="hide-toolbar" @click="toolbarShown = false">
                <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 512 512" xml:space="preserve">
                    <path d="M512 59.076L452.922 0 256 196.922 59.076 0 0 59.076 196.922 256 0 452.922 59.076 512 256 315.076 452.922 512 512 452.922 315.076 256z"/>
                </svg>
            </button>
        </div>

        <!-- Show Toolbar -->
        <button class="show-toolbar" v-if="!toolbarShown && !drawerOpen" @click="toolbarShown = true"></button>
    </div>
</template>

<script>
export default {
    name: 'DevTools',
    components: {},
    data() {
        return {
            messageCount: 0,
            drawerOpen: false,
            toolbarShown: false,
            popoverMessages: false,
            section: null,
            subsection: null
        };
    },
    mounted() {
        const drawerOpen = localStorage.getItem('RVW_DrawerOpen');
        const toolbarShown = localStorage.getItem('RVW_ToolbarShown');

        if (drawerOpen) {
            this.drawerOpenb = JSON.parse(drawerOpen);
        }

        if (toolbarShown) {
            this.toolbarShown = JSON.parse(toolbarShown);
        }
    },
    computed: {},
    methods: {
        closeDrawer() {
            this.drawerOpen = false;
            this.section = null;
            this.subsection = null;
        },
        openDrawer(section, subsection) {
            this.drawerOpen = true;
            this.section = section;
            this.subsection = subsection;
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
