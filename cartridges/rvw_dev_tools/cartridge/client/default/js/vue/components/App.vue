<template>
    <div id="rvw_dev_tools">
        <div class="drawer" v-if="drawerOpen">
            <button class="close-drawer" @click="drawerOpen = false"></button>
        </div>
        <div class="toolbar" v-if="toolbarShown && !drawerOpen">
            <button class="open-drawer" @click="drawerOpen = true"></button>
            <button class="hide-toolbar" @click="toolbarShown = false"></button>
        </div>
        <button class="show-toolbar" v-if="!toolbarShown && !drawerOpen" @click="toolbarShown = true"></button>
    </div>
</template>

<script>
export default {
    name: 'DevTools',
    components: {},
    data() {
        return {
            drawerOpen: false,
            toolbarShown: false
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
    methods: {},
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
