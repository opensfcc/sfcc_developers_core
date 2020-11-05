<template>
    <div id="app" :class="getTheme">
        <!-- Header -->
        <header class="d-flex align-items-center">
            <!-- Logo -->
            <a href="#" @click.prevent="reload()"><img :src="getLogo" alt="logo" class="logo">SFCC Dev Console</a>

            <!-- Theme Switcher -->
            <div class="theme-selector">
                Theme:
                <select v-model="theme"  v-tooltip="{ content: 'Change Theme', delay: { show: 750 } }">
                    <option v-for="option in themeOptions" :key="option.value" :value="option.value" :selected="option.label === theme">{{option.label}}</option>
                </select>
            </div>
        </header>

        <!-- File List Menu -->
        <template v-if="showFiles">
            <!-- Overlay -->
            <div class="overlay position-fixed" @click="showFiles = false"></div>

            <!-- Drawer -->
            <div class="files position-fixed">
                <!-- New File -->
                <button @click.prevent="promptFile()" class="create-file" v-tooltip.bottom="{ content: 'Create File', delay: { show: 750 }, class: 'invert' }">
                    <i aria-hidden="true" class="fa fa-plus-square"></i>
                    <span>Create New File</span>
                </button>

                <!-- File -->
                <div class="d-flex justify-content-between align-items-center file-list-item" v-for="file in files">
                    <!-- Delete Button -->
                    <a href="#" class="delete-file" @click.prevent="deleteFile(file)" v-tooltip.bottom="{ content: 'Delete File', delay: { show: 750 } }">
                        <i aria-hidden="true" class="fa fa-trash"></i>
                    </a>

                    <!-- Load File Button -->
                    <a href="#" class="load-file" @click.prevent="loadFile(file)" v-tooltip.bottom="{ content: 'Open File', delay: { show: 750 } }">
                        <span>{{ file.replace(/^file-/, '') }}.js</span>
                        <i aria-hidden="true" class="fa fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>
        </template>

        <!-- Split Pane -->
        <split-pane :min-percent="30" :default-percent="resizer" v-on:resize="onResize" split="vertical" class="flex-grow-1">
            <!-- Left Panel -->
            <div slot="paneL" class="d-flex flex-column flex-grow-1">
                <!-- Action Buttons -->
                <div class="actions d-flex align-items-center">
                    <!-- Menu Button -->
                    <div class="menu">
                        <a class="menu-btn" href="#" @click.prevent="showFiles = !showFiles" v-tooltip="{ content: 'Open File Menu', delay: { show: 750 } }"><i class="fa fa-bars"/></a>
                    </div>

                    <!-- Run Code Button -->
                    <button :disabled="!code || processing" class="btn" @click="runCode" v-tooltip="{ content: 'Run Code ( alt+x )', delay: { show: 750 } }">
                        <i :class="[processing ? 'fa fa-spinner spin' : 'fa fa-play']" aria-hidden="true"/>
                    </button>

                    <!-- Reset Button -->
                    <button class="btn" @click="clearCode" v-tooltip="{ content: 'Reset Editor', delay: { show: 750 } }">
                        <i class="fa fa-undo" aria-hidden="true"/>
                    </button>

                    <!-- Max Depth Selector -->
                    <label>
                        Max Depth
                        <select v-model="maxDepth" v-tooltip="{ content: 'Change Max Depth', delay: { show: 750 } }">
                            <option
                                v-for="(n, i) in 10"
                                :key="i"
                                :value="n"
                                :selected="n === 3"
                                v-text="n"
                            />
                        </select>
                    </label>

                    <!-- Current File -->
                    <div class="current-file" v-if="currentFile">
                        <i class="fa fa-code" v-tooltip="{ trigger: 'click', content: 'Current File: ' + currentFile.replace(/^file-/, '') + '.js' }"></i>
                        <span>{{ currentFile.replace(/^file-/, '') }}.js</span>
                    </div>
                </div>

                <!-- Code Editor -->
                <monaco-editor
                    id="editor"
                    class="flex-grow-1"
                    v-model="code"
                    :options="codeEditor.options"
                    :theme="theme"
                    language="javascript"
                    ref="editor"
                    @editorDidMount="editorDidMount"
                    @keydown.native="check"
                />
            </div>

            <!-- Right Panel -->
            <template slot="paneR">
                <!-- Action Buttons -->
                <div class="actions d-flex align-items-center">
                    <!-- Toggle View Button -->
                    <button class="btn"
                        @click="plainJSON = !plainJSON"
                        v-tooltip="{ content: plainJSON ? 'Switch to Tree View' : 'Switch to JSON View', delay: { show: 750 } }">
                        <i :class="[plainJSON ? 'fa fa-code' : 'fa fa-list-ul']" aria-hidden="true"/>
                    </button>

                    <!-- Clipboard Button -->
                    <button class="btn"
                        v-clipboard:copy="getJSON"
                        v-clipboard:success="clipboardSuccessHandler"
                        v-clipboard:error="clipboardErrorHandler"
                        v-tooltip="{ content: 'Copy to Clipboard', delay: { show: 750 } }">
                        <i :class="getClipboard" aria-hidden="true"/>
                    </button>

                    <!-- Clear Button -->
                    <button class="btn"
                        @click="clearResult"
                        v-tooltip="{ content: 'Clear Results', delay: { show: 750 } }">
                        <i class="fa fa-trash" aria-hidden="true"/>
                    </button>
                </div>

                <!-- Output -->
                <div class="flex-grow-1 px-3" v-if="result">
                    <pre v-if="plainJSON" v-html="getJSON"></pre>
                    <tree-view v-else :data="result" :options="{
                        maxDepth: maxDepth,
                        rootObjectKey: 'result',
                        link: true
                    }"/>
                </div>
            </template>
        </split-pane>

        <!-- New File Modal -->
        <transition name="modal">
            <div id="modal" class="modal-mask" v-if="showModal" @click="cancelFile()" @keydown.esc="cancelFile()">
                <div class="modal-wrapper">
                    <div class="modal-container" @click.stop="$event.preventDefault()">
                        <div class="modal-header">
                            <i class="fa fa-code"></i> Enter File Name
                        </div>

                        <div class="modal-body">
                            <!-- New File Input -->
                            <div class="input-wrapper">
                                <input type="text" name="new-file"
                                    maxlength="20"
                                    ref="fileName"
                                    v-model="fileName"
                                    @keypress="filterName($event)"
                                    @keydown.enter="createFile()"
                                >
                                <span class="ext">.js</span>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <slot name="footer">
                                <!-- Cancel File Button -->
                                <button class="modal-cancel-button" @click="cancelFile()">
                                    Cancel
                                </button>

                                <!-- Create File Button -->
                                <button class="modal-default-button" @click="createFile()">
                                    Create
                                </button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import SplitPane from 'vue-splitpane'
import MonacoEditor from 'vue-monaco-cdn';

export default {
    name: 'DevConsole',
    components: {
        MonacoEditor,
        SplitPane
    },
    data() {
        return {
            code: 'return session;',
            copied: false,
            copyError: false,
            currentFile: null,
            editor: null,
            fileName: null,
            maxDepth: 3,
            plainJSON: false,
            processing: false,
            resizer: 50,
            result: null,
            showModal: false,
            showFiles: false,
            files: [],
            theme: 'vs',
            themeOptions: [
                {
                    'label': 'Light',
                    'value': 'vs'
                },
                {
                    'label': 'Dark',
                    'value': 'vs-dark'
                },
                {
                    'label': 'High Contrast',
                    'value': 'hc-black'
                }
            ]
        };
    },
    mounted() {
        // Fetch Settings
        const currentFile = localStorage.getItem('currentFile');
        const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
        const maxDepth = localStorage.getItem('maxDepth');
        const plainJSON = localStorage.getItem('plainJSON');
        const resizer = localStorage.getItem('resizer');
        const theme = localStorage.getItem('theme');

        // Get Current Time
        const now = new Date().getTime();

        // Restore Results Preference
        this.plainJSON = plainJSON === 'true';

        // Check for updates no more than once a day
        if (!lastUpdateCheck || now - lastUpdateCheck > 86400000) {
            this.getLatesVersion();
        }

        // Load Files from Local Storage
        let files = localStorage.getItem('files');
        if (files) {
            files = JSON.parse(files);
            files.sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true}))
            this.files = files;
        } else {
            this.createDefaultFiles();
        }

        // Load the Last File if Loaded from Menu
        if (currentFile) {
            this.currentFile = currentFile;
            this.loadFile(currentFile);
        }

        // Update Max Depth if Changed
        if (maxDepth) {
            this.maxDepth = parseInt(maxDepth);
        }

        // Update Split Panel Resize Bar if Adjusted
        if (resizer) {
            this.resizer = resizer;
        }

        // Update Theme if Set
        if (theme) {
            this.theme = theme;
        }
    },
    computed: {
        codeEditor() {
            return {
                options: {
                    automaticLayout: true,
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    selectOnLineNumbers: true,
                    showGlyphMargin: false,
                    smoothScrolling: true,
                    theme: this.theme
                }
            };
        },
        getClipboard () {
            if (this.copied) {
                return 'fa fa-check';
            } else if (this.copyError) {
                return 'fa fa-exclamation-triangle';
            }

            return 'fa fa-clipboard';
        },
        getJSON() {
            return JSON.stringify(this.result, null, 2)
        },
        getLogo() {
            return `${window.staticPath}/img/logo.png`
        },
        getTheme() {
            return `d-flex flex-column ${this.theme}`
        }
    },
    methods: {
        cancelFile() {
            this.showModal = false;
        },
        check(e) {
            if (e.keyCode === 88 && e.altKey) {
                this.runCode();
                e.preventDefault();
            }
        },
        clearCode() {
            this.editor.setValue('');
            this.code = '';

            const lastRun = localStorage.setItem('lastRun', '');
        },
        clearResult() {
            this.result = null;
        },
        clipboardErrorHandler (err) {
            var self = this;
            self.copied = false;
            self.copyError = true;

            this.$toast.open({
                type: 'error',
                message: `<i class="fa fa-exclamation-triangle"></i>&nbsp; ${err.message}`,
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            });

            setTimeout(function(){
                self.copyError = false;
            }, 3000);
        },
        clipboardSuccessHandler () {
            var self = this;
            self.copied = true;
            self.copyError = false;

            this.$toast.open({
                type: 'success',
                message: '<i class="fa fa-check-square"></i>&nbsp; Copied to Clipboard',
                duration: 3000,
                dismissible: true,
                position: 'top-right'
            });

            setTimeout(function(){
                self.copied = false;
            }, 3000);
        },
        createDefaultFiles() {
            // Some Handy Default Files
            const defaultFiles = {
                'file-get-basket': "const BasketMgr = require('dw/order/BasketMgr');\nconst basket = BasketMgr.getCurrentBasket();\n\nreturn basket;",
                'file-get-customer': "var CustomerMgr = require('dw/customer/CustomerMgr');\nvar customer = CustomerMgr.queryProfile(\n\t'firstName = {0} AND lastName = {1}',\n\t'Jane',\n\t'Doe'\n);\n\nreturn customer;",
                'file-get-preferences': "const Site = require('dw/system/Site');\nconst preferences = Site.getCurrent().preferences;\n\nreturn preferences;",
                'file-get-site': "const Site = require('dw/system/Site');\nconst currentSite = Site.getCurrent();\n\nreturn currentSite;",
                'file-get-session': "return session;"
            };

            // Generate File List
            const files = Object.keys(defaultFiles);
            this.files = files;

            // Store File List to Local Storage
            localStorage.setItem('files', JSON.stringify(files));

            // Store each File to Local Storage
            for (var i = 0; i < files.length; i++) {
                localStorage.setItem(files[i], JSON.stringify(defaultFiles[files[i]]));
            }
        },
        createFile () {
            // Check if File Name was left blank
            if (!this.fileName) {
                this.$toast.open({
                    type: 'info',
                    message: `<i class="fa fa-bell"></i>&nbsp; Please Enter a File Name`,
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                });

                return;
            }

            // Get Current File List
            let files = localStorage.getItem('files');
            if (files) {
                files = JSON.parse(files);
            } else {
                files = [];
            }

            // Prefix filename incase it starts with a number as we are using it as a local storage key
            const newFileName = `file-${this.fileName}`

            // Check that New File does not aleady exist
            if (files.indexOf(newFileName) === -1) {
                // Add New File
                files.push(newFileName);

                // Natural Sort List
                files.sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, { numeric: true, ignorePunctuation: true }))

                // Update UI
                this.showFiles = false;
                this.showModal = false;
                this.currentFile = false;
                this.files = files;
                this.fileName = null;

                // Update Locale Storage
                localStorage.setItem('currentFile', newFileName);
                localStorage.setItem('files', JSON.stringify(files));
                localStorage.setItem(newFileName, '');

                // Load New File in Editor
                this.loadFile(newFileName, true);
            } else {
                // File Already Exists
                this.$toast.open({
                    type: 'error',
                    message: `<i class="fa fa-exclamation-triangle"></i>&nbsp; <strong>${this.fileName}</strong> already exists`,
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                });
            }
        },
        deleteFile(file) {
            const fileName = `${file.replace(/^file-/, '')}.js`;
            if(window.confirm(`Are you sure you want to delete ${fileName}? This cannot be undone.`)) {
                var files = localStorage.getItem('files');
                files = JSON.parse(files) || [];

                var index = files.indexOf(file);

                if (index > -1) {
                    files.splice(index, 1);

                    this.files = files;
                    localStorage.removeItem(file);
                    localStorage.setItem('files', JSON.stringify(files));

                    this.$toast.open({
                        type: 'success',
                        message: `<i class="fa fa-check-square"></i>&nbsp; Deleted <strong>${fileName}</strong>`,
                        duration: 3000,
                        dismissible: true,
                        position: 'top-right'
                    });
                } else {
                    this.$toast.open({
                        type: 'error',
                        message: `<i class="fa fa-exclamation-triangle"></i>&nbsp; Unable to Delete <strong>${fileName}</strong>`,
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    });
                }
            }
        },
        editorDidMount(editor) {
            this.editor = editor;

            // Editor tries to call this on Theme Change, even though it's not needed in Vue
            if (typeof this.editor.setTheme === 'undefined') {
                this.editor.setTheme = function(){};
            }

            const lastRun = localStorage.getItem('lastRun');
            const theme = localStorage.getItem('theme');

            if (lastRun && typeof lastRun === 'string') {
                this.code = JSON.parse(lastRun);
            }

            if (theme) {
                this.theme = theme;
                document.documentElement.classList = theme;
            }

            this.editor.onKeyDown(this.check);
        },
        fetchFiles() {
            var files = localStorage.getItem('files');
            this.files = JSON.parse(files) || [];
        },
        filterName (evt) {
            this.fileName = (this.fileName)
                ? this.fileName.trim().replace(/\.js$/, '').toLowerCase().replace(/[^a-zA-Z0-9_-]+/g, '-')
                : null;
        },
        async getLatesVersion () {
            var url = 'https://api.github.com/repos/redvanworkshop/website/releases/latest';
            const response = await this.axios.get(url);

            if (response && typeof response.data !== 'undefined') {
                const latestVersion = response.data.tag_name;
                const hasNewVersion = function (curVer, newVer) {
                    const curParts = curVer.replace(/^v/, '').split('.')
                    const newParts = newVer.replace(/^v/, '').split('.')
                    for (var i = 0; i < newParts.length; i++) {
                        const a = ~~newParts[i];
                        const b = ~~curParts[i];
                        if (a > b) return true
                        if (a < b) return false
                    }
                    return false
                }

                if (hasNewVersion(process.env.PACKAGE_VERSION, latestVersion)) {
                    this.$toast.open({
                        type: 'info',
                        message: `<i class="fa fa-bell"></i>&nbsp; <strong>Dev Console</strong> Update Availabe ( <strong>${latestVersion}</strong> )`,
                        duration: 5000,
                        dismissible: true,
                        position: 'top',
                        onClick: function(){
                            window.open(response.data.html_url);
                        }
                    });
                }
            }

            localStorage.setItem('lastUpdateCheck', new Date().getTime());
        },
        loadFile(file, isNew) {
            let savedFile = localStorage.getItem(file);

            if (savedFile && typeof savedFile === 'string') {
                savedFile = JSON.parse(savedFile);
            } else {
                savedFile = '';
            }

            this.code = savedFile;
            this.currentFile = file;
            this.result = '';
            this.showFiles = false;

            if (this.editor) {
                this.editor.setValue(savedFile);
            }

            localStorage.setItem('lastRun', JSON.stringify(savedFile));
            localStorage.setItem('currentFile', file);

            var message = isNew ? 'Created' : 'Loaded';

            this.$toast.open({
                type: 'success',
                message: `<i class="fa fa-check-square"></i>&nbsp; ${message} <strong>${file.replace(/^file-/, '')}.js</strong>`,
                duration: 3000,
                dismissible: true,
                position: 'top-right'
            });
        },
        onResize(val) {
            if (val) {
                localStorage.setItem('resizer', val);
            }

            if (this.editor) {
                this.editor.layout();
            }
        },
        promptFile() {
            this.showModal = true;

            setTimeout(() => {
                this.$refs.fileName.focus();
            }, 250);
        },
        reload() {
            window.location.reload(true);
        },
        async runCode() {
            if (this.code) {
                this.processing = true;
                this.clearResult();

                const data = new URLSearchParams();

                data.append('code', this.code);
                data.append('maxDepth', this.maxDepth);

                localStorage.setItem('lastRun', JSON.stringify(this.code));

                if (this.currentFile) {
                    localStorage.setItem(this.currentFile, JSON.stringify(this.code));
                }

                try {
                    const response = await this.axios.post(`${window.urlPath}/Console-Run`, data);

                    // the following 3 properties come from the default
                    // dw json response and we dont need them
                    delete response.data.locale;
                    delete response.data.action;
                    delete response.data.queryString;

                    this.result = response.data;
                } catch (err) {
                    this.$toast.open({
                        type: 'error',
                        message: `<i class="fa fa-exclamation-triangle"></i>&nbsp; ${err.message}`,
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    });
                }

                this.processing = false;
            }
        }
    },
    watch: {
        maxDepth: {
            handler() {
                localStorage.setItem('maxDepth', this.maxDepth);
            }
        },
        plainJSON: {
            handler() {
                localStorage.setItem('plainJSON', this.plainJSON);
            }
        },
        theme: {
            handler() {
                localStorage.setItem('theme', this.theme);
                document.documentElement.classList = this.theme;
            }
        }
    },
};
</script>
