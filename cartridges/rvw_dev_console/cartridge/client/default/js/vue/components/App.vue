<template>
    <div id="app" :class="getTheme">
        <!-- Header -->
        <header class="d-flex align-items-center">
            <!-- Logo -->
            <a href="#" @click.prevent="reload()">
                <img :src="getLogo" alt="logo" class="logo">
                <span>SFCC Dev Console</span>
            </a>

            <!-- Layout Selector -->
            <div class="layout-selector">
                <!-- Left Panel Button -->
                <button class="layout-switch left" :class="{ 'active': layout === 'left' }" @click="switchLayout('left')" v-tooltip="{ content: 'Left Column Only', delay: { show: tooltipDelay } }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 46.15">
                        <path d="M23.71 27.73V15.28h-4.24v15.99h11.06v-3.54h-6.82z"/>
                        <path d="M48.59 3.14a4.65 4.65 0 00-3.4-1.42H4.81a4.65 4.65 0 00-3.4 1.42A4.62 4.62 0 000 6.53v36.54a4.66 4.66 0 001.41 3.4 4.64 4.64 0 003.4 1.41h40.38A4.81 4.81 0 0050 43.07V6.53a4.62 4.62 0 00-1.41-3.39zm-2.44 39.93a1 1 0 01-1 1H4.81a1 1 0 01-1-1V9.42h42.3z" transform="translate(0 -1.72)"/>
                    </svg>
                </button>

                <!-- Split Panel Button -->
                <button class="layout-switch split" :class="{ 'active': layout === 'split' }" @click="switchLayout('split')" v-tooltip="{ content: 'Split View', delay: { show: tooltipDelay } }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 46.15">
                        <path d="M48.59 3.14a4.65 4.65 0 00-3.4-1.42H4.81a4.65 4.65 0 00-3.4 1.42A4.62 4.62 0 000 6.53v36.54a4.66 4.66 0 001.41 3.4 4.64 4.64 0 003.4 1.41h40.38A4.81 4.81 0 0050 43.07V6.53a4.62 4.62 0 00-1.41-3.39zM23.08 44H4.81a1 1 0 01-1-1V9.42h19.27zm23.07-1a1 1 0 01-1 1H26.92V9.42h19.23z" transform="translate(0 -1.72)"/>
                        <path d="M13.09 26.15v-8.1h-2.75v10.4h7.19v-2.3h-4.44z"/>
                        <path d="M41 30.18l-2.27-4.06a3.16 3.16 0 001.69-3c0-2.59-1.92-3.36-4.16-3.36h-3.92v10.42h2.76v-3.49h1l1.79 3.49zM35.1 22h.9c1.09 0 1.66.29 1.66 1.18s-.57 1.38-1.66 1.38h-.9z" transform="translate(0 -1.72)"/>
                    </svg>
                </button>

                <!-- Right Panel Button -->
                <button class="layout-switch right" :class="{ 'active': layout === 'right' }" @click="switchLayout('right')" v-tooltip="{ content: 'Right Column Only', delay: { show: tooltipDelay } }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 46.15">
                        <path d="M48.59 3.14a4.65 4.65 0 00-3.4-1.42H4.81a4.65 4.65 0 00-3.4 1.42A4.62 4.62 0 000 6.53v36.54a4.66 4.66 0 001.41 3.4 4.64 4.64 0 003.4 1.41h40.38A4.81 4.81 0 0050 43.07V6.53a4.62 4.62 0 00-1.41-3.39zm-2.44 39.93a1 1 0 01-1 1H4.81a1 1 0 01-1-1V9.42h42.3z" transform="translate(0 -1.72)"/>
                        <path d="M31.62 33l-3.49-6.23a4.87 4.87 0 002.6-4.6c0-4-2.95-5.17-6.39-5.17h-6v16h4.23v-5.37h1.53L26.9 33zm-9-12.65H24c1.67 0 2.56.44 2.56 1.82s-.89 2.12-2.56 2.12h-1.39z" transform="translate(0 -1.72)"/>
                    </svg>
                </button>
            </div>

            <!-- Theme Selector -->
            <div class="theme-selector">
                <span>Theme:</span>
                <select v-model="theme" v-tooltip="{ content: 'Change Theme', delay: { show: tooltipDelay } }">
                    <option v-for="option in themeOptions" :key="option.value" :value="option.value" :selected="option.label === theme">{{ option.label }}</option>
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
                <button @click.prevent="promptFile()" class="create-file" v-tooltip.bottom="{ content: 'Create File', delay: { show: tooltipDelay }, class: 'invert' }">
                    <i aria-hidden="true" class="fa fa-plus-square"></i>
                    <span>Create New File</span>
                </button>

                <!-- File -->
                <div class="d-flex justify-content-between align-items-center file-list-item" :key="index" v-for="(file, index) in files">
                    <!-- Delete Button -->
                    <a href="#" class="delete-file" @click.prevent="deleteFile(file)" v-tooltip.bottom="{ content: 'Delete File', delay: { show: tooltipDelay } }">
                        <i aria-hidden="true" class="fa fa-trash"></i>
                    </a>

                    <!-- Load File Button -->
                    <a href="#" class="load-file" @click.prevent="loadFile(file)" v-tooltip.bottom="{ content: 'Open File', delay: { show: tooltipDelay } }">
                        <span>{{ file.replace(/^file-/, '') }}.js</span>
                        <i aria-hidden="true" class="fa fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>
        </template>

        <!-- Split Pane -->
        <split-pane :min-percent="30" :default-percent="resizer" @resize="onResize" split="vertical" class="flex-grow-1">
            <!-- Left Panel -->
            <div slot="paneL" class="d-flex flex-column flex-grow-1">
                <!-- Action Buttons -->
                <div class="actions d-flex align-items-center">
                    <!-- Menu Button -->
                    <div class="menu">
                        <a class="menu-btn" href="#" @click.prevent="showFiles = !showFiles" v-tooltip="{ content: 'Open File Menu', delay: { show: tooltipDelay } }"><i class="fa fa-bars"/></a>
                    </div>

                    <!-- Run Code Button -->
                    <button :disabled="!code || processing" class="btn" @click="runCode" v-tooltip="{ content: 'Run Code ( alt+x )', delay: { show: tooltipDelay } }">
                        <i :class="[processing ? 'fa fa-spinner spin' : 'fa fa-play']" aria-hidden="true"/>
                    </button>

                    <!-- Reset Button -->
                    <button class="btn" @click="clearCode" v-tooltip="{ content: 'Reset Editor', delay: { show: tooltipDelay } }">
                        <i class="fa fa-undo" aria-hidden="true"/>
                    </button>

                    <!-- Save Button -->
                    <button :disabled="!fileModified" class="btn" @click="saveFile" v-tooltip="{ content: 'Save File', delay: { show: tooltipDelay } }">
                        <i class="fa fa-floppy-o" aria-hidden="true"/>
                    </button>

                    <!-- Max Depth Selector -->
                    <label>
                        Max Depth
                        <select v-model="maxDepth" v-tooltip="{ content: 'Change Max Depth', delay: { show: tooltipDelay } }">
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
                    <div class="current-file" :class="{ 'modified': fileModified }" v-if="currentFile">
                        <button @click="clearCode" v-tooltip="{ content: 'Close File', delay: { show: tooltipDelay } }">
                            <i class="fa fa-times"></i>
                        </button>
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
                    @keydown.native="checkRun"
                    @keyup.native="checkModified"
                />
            </div>

            <!-- Right Panel -->
            <template slot="paneR">
                <!-- Action Buttons -->
                <div class="actions d-flex align-items-center">
                    <!-- Toggle View Button -->
                    <button class="btn" :disabled="!result"
                            @click="plainJSON = !plainJSON"
                            v-tooltip="{ content: plainJSON ? 'Switch to Tree View' : 'Switch to JSON View', delay: { show: tooltipDelay } }">
                        <i :class="[plainJSON ? 'fa fa-code' : 'fa fa-list-ul']" aria-hidden="true"/>
                    </button>

                    <!-- Clipboard Button -->
                    <button class="btn" :disabled="!result"
                            v-clipboard:copy="getJSON"
                            v-clipboard:success="clipboardSuccessHandler"
                            v-clipboard:error="clipboardErrorHandler"
                            v-tooltip="{ content: 'Copy to Clipboard', delay: { show: tooltipDelay } }">
                        <i :class="getClipboard" aria-hidden="true"/>
                    </button>

                    <!-- Clear Button -->
                    <button class="btn" :disabled="!result"
                            @click="clearResult"
                            v-tooltip="{ content: 'Clear Results', delay: { show: tooltipDelay } }">
                        <i class="fa fa-trash" aria-hidden="true"/>
                    </button>

                    <!-- Run Time -->
                    <div v-if="executionTime !== null" class="mx-2 font-weight-bold execution-time">
                        <span>Run Time:</span> {{ executionTime.toLocaleString() }} ms
                    </div>
                </div>

                <!-- Output -->
                <div class="flex-grow-1 px-3" v-if="result">
                    <pre v-if="plainJSON" ref="outputPlain">{{ getJSON }}</pre>
                    <tree-view v-else :data="result" class="outputTree" :options="{
                        maxDepth: maxDepth,
                        rootObjectKey: 'result',
                        link: true
                    }"/>
                </div>
            </template>
        </split-pane>

        <!-- New File Modal -->
        <modal v-if="showModal" @close="cancelFile()">
            <div slot="header">
                <i class="fa fa-code"></i> Enter File Name
            </div>
            <div slot="body">
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
            <div slot="footer">
                <!-- Cancel File Button -->
                <button class="modal-cancel-button" @click="cancelFile()">
                    Cancel
                </button>

                <!-- Create File Button -->
                <button class="modal-default-button" @click="createFile()">
                    Create
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
import SplitPane from 'vue-splitpane';
import MonacoEditor from 'vue-monaco-cdn';

import Modal from './Modal';

export default {
    name: 'DevConsole',
    components: {
        Modal,
        MonacoEditor,
        SplitPane
    },
    data() {
        return {
            code: 'return session;',
            codeInit: 'return session;',
            copied: false,
            copyError: false,
            currentFile: null,
            editor: null,
            fileName: null,
            fileModified: false,
            executionTime: null,
            layout: 'split',
            maxDepth: 3,
            plainJSON: false,
            processing: false,
            resizer: 50,
            result: null,
            showModal: false,
            showFiles: false,
            tooltipDelay: 300,
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
        const layout = localStorage.getItem('layout');
        const maxDepth = localStorage.getItem('maxDepth');
        const plainJSON = localStorage.getItem('plainJSON');
        const resizer = localStorage.getItem('resizer');
        const theme = localStorage.getItem('theme');

        // Get Current Time
        const now = new Date().getTime();

        // Restore Results Preference
        this.plainJSON = plainJSON === 'true';

        // Check for updates no more than once a week
        if (!lastUpdateCheck || now - lastUpdateCheck > 604800000) {
            this.getLatesVersion();
        }

        // Load Files from Local Storage
        let files = localStorage.getItem('files');
        if (files) {
            files = JSON.parse(files);
            files.sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true}));
            this.files = files;
        } else {
            this.createDefaultFiles();
        }

        // Load the Last File if Loaded from Menu
        if (currentFile) {
            this.currentFile = currentFile;
            this.loadFile(currentFile);
        }

        // Update Layout if Changed
        if (layout) {
            this.layout = layout;
            this.switchLayout(layout);
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
                    minimap: {enabled: false},
                    scrollBeyondLastLine: false,
                    selectOnLineNumbers: true,
                    showGlyphMargin: false,
                    smoothScrolling: true,
                    lineDecorationsWidth: 20,
                    padding: {
                        top: 10,
                        bottom: 10
                    },
                    theme: this.theme
                }
            };
        },
        getClipboard() {
            if (this.copied) {
                return 'fa fa-check';
            } else if (this.copyError) {
                return 'fa fa-exclamation-triangle';
            }

            return 'fa fa-clipboard';
        },
        getJSON() {
            return JSON.stringify(this.result, null, 2);
        },
        getLogo() {
            return `${window.staticPath}/img/logo.png`;
        },
        getTheme() {
            return `d-flex flex-column ${this.theme} layout-${this.layout} ${this.currentFile ? 'has-tabs' : 'no-tabs'}`;
        }
    },
    methods: {
        cancelFile() {
            this.showModal = false;
        },
        checkModified() {
            this.fileModified = (JSON.stringify(this.codeInit) !== JSON.stringify(this.code));
        },
        checkRun(e) {
            if (e.keyCode === 88 && e.altKey) {
                this.runCode();
                e.preventDefault();
            }
        },
        clearCode() {
            if (!this.fileModified || (this.fileModified && window.confirm('You have unsaved changes to this file. Continue?'))) {
                this.editor.setValue('');
                this.code = '';
                this.codeInit = '';
                this.currentFile = null;
                this.fileModified = false;
                this.result = null;

                localStorage.removeItem('lastRun');
                localStorage.removeItem('currentFile');
            }
        },
        clearResult() {
            this.executionTime = null;
            this.result = null;
        },
        clipboardErrorHandler(err) {
            this.copied = false;
            this.copyError = true;
            this.showMessage('error', err.message);

            setTimeout(() => {
                this.copyError = false;
            }, 3000);
        },
        clipboardSuccessHandler() {
            this.copied = true;
            this.copyError = false;
            this.showMessage('success', 'Copied to Clipboard');

            setTimeout(() => {
                this.copied = false;
            }, 3000);
        },
        createDefaultFiles() {
            // Some Handy Default Files
            const defaultFiles = {
                'file-get-basket': "const BasketMgr = require('dw/order/BasketMgr');\nconst basket = BasketMgr.getCurrentBasket();\n\nreturn basket;",
                'file-get-customer': "const CustomerMgr = require('dw/customer/CustomerMgr');\nconst customer = CustomerMgr.queryProfile(\n\t'firstName = {0} AND lastName = {1}',\n\t'Jane',\n\t'Doe'\n);\n\nreturn customer;",
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
            for (let i = 0; i < files.length; i++) {
                localStorage.setItem(files[i], JSON.stringify(defaultFiles[files[i]]));
            }
        },
        createFile() {
            // Check if File Name was left blank
            if (!this.fileName) {
                this.showMessage('info', 'Please Enter a File Name');

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
            const newFileName = `file-${this.fileName}`;

            // Check that New File does not aleady exist
            if (files.indexOf(newFileName) === -1) {
                // Add New File
                files.push(newFileName);

                // Natural Sort List
                files.sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true}));

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
                this.showMessage('error', `<strong>${this.fileName}</strong> already exists`);
            }
        },
        deleteFile(file) {
            const fileName = `${file.replace(/^file-/, '')}.js`;
            if (window.confirm(`Are you sure you want to delete ${fileName}? This cannot be undone.`)) {
                let files = localStorage.getItem('files');
                files = JSON.parse(files) || [];

                const index = files.indexOf(file);

                if (index > -1) {
                    files.splice(index, 1);

                    this.files = files;
                    localStorage.removeItem(file);
                    localStorage.setItem('files', JSON.stringify(files));

                    this.showMessage('success', `Deleted <strong>${fileName}</strong>`);
                } else {
                    this.showMessage('error', `Unable to Delete <strong>${fileName}</strong>`);
                }
            }
        },
        editorDidMount(editor) {
            this.editor = editor;

            // Editor tries to call this on Theme Change, even though it's not needed in Vue
            if (typeof this.editor.setTheme === 'undefined') {
                this.editor.setTheme = () => {
                };
            }

            // Enable Key Bindings
            this.editor.condition = {
                canSave: editor.createContextKey('canSave', false),
                canClear: editor.createContextKey('canClear', false),
                canRun: editor.createContextKey('canRun', true),
            };

            // Add Save Command to Editor
            editor.addAction({
                id: 'dev-console-save',
                label: 'Save',
                keybindings: [
                    monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S)
                ],
                precondition: 'canSave',
                keybindingContext: 'canSave',
                contextMenuGroupId: 'dev_console',
                contextMenuOrder: 1,
                run: () => {
                    this.saveFile();
                    return null;
                }
            });

            // Add Run Code Command to Editor
            editor.addAction({
                id: 'dev-console-run',
                label: 'Run Code',
                keybindings: [
                    monaco.KeyMod.chord(monaco.KeyMod.Alt | monaco.KeyCode.KEY_X)
                ],
                precondition: 'canRun',
                keybindingContext: 'canRun',
                contextMenuGroupId: 'dev_console',
                contextMenuOrder: 2,
                run: () => {
                    this.runCode();
                    return null;
                }
            });

            // Add Clear Results Command to Editor
            editor.addAction({
                id: 'dev-console-clear',
                label: 'Clear Results',
                keybindings: [
                    monaco.KeyMod.chord(monaco.KeyMod.Alt | monaco.KeyCode.KEY_R)
                ],
                precondition: 'canClear',
                keybindingContext: 'canClear',
                contextMenuGroupId: 'dev_console',
                contextMenuOrder: 3,
                run: () => {
                    this.clearResult();
                    return null;
                }
            });

            const lastRun = localStorage.getItem('lastRun');
            const theme = localStorage.getItem('theme');

            if (lastRun && typeof lastRun === 'string') {
                this.code = JSON.parse(lastRun);
                this.codeInit = this.code;
                this.fileModified = false;
            }

            if (theme) {
                this.theme = theme;
                document.documentElement.classList = theme;
            }
        },
        fetchFiles() {
            const files = localStorage.getItem('files');
            this.files = JSON.parse(files) || [];
        },
        filterName() {
            this.fileName = (this.fileName)
                ? this.fileName.trim().replace(/\.js$/, '').toLowerCase().replace(/[^a-zA-Z0-9_-]+/g, '-')
                : null;
        },
        async getLatesVersion() {
            const url = 'https://api.github.com/repos/redvanworkshop/rvw_developers_core/releases/latest';
            const response = await this.axios.get(url);

            if (response && typeof response.data !== 'undefined') {
                const latestVersion = response.data.tag_name;
                const hasNewVersion = (curVer, newVer) => {
                    const curParts = curVer.replace(/^v/, '').split('.');
                    const newParts = newVer.replace(/^v/, '').split('.');

                    for (let i = 0; i < newParts.length; i++) {
                        const a = ~~newParts[i];
                        const b = ~~curParts[i];

                        if (a > b) {
                            return true;
                        }
                        if (a < b) {
                            return false;
                        }
                    }

                    return false;
                };

                if (hasNewVersion(process.env.PACKAGE_VERSION, latestVersion)) {
                    this.showMessage('info', `<strong>RVW Developers Core</strong> Update Availabe ( <strong>${latestVersion}</strong> )`, () => {
                        window.open(response.data.html_url);
                    });
                }
            }

            localStorage.setItem('lastUpdateCheck', new Date().getTime());
        },
        loadFile(file, isNew) {
            let rawSavedFile;
            let savedFile;

            if (isNew && this.fileModified) {
                this.codeInit = this.code;
                this.currentFile = file;
                this.fileModified = false;
                this.showFiles = false;

                localStorage.setItem(this.currentFile, JSON.stringify(this.code));
            } else {
                rawSavedFile = localStorage.getItem(file);
                savedFile;

                if (rawSavedFile && typeof rawSavedFile === 'string') {
                    savedFile = JSON.parse(rawSavedFile);
                } else {
                    savedFile = '';
                }

                this.code = savedFile;
                this.codeInit = savedFile;
                this.currentFile = file;
                this.fileModified = false;
                this.result = '';
                this.showFiles = false;

                if (this.editor) {
                    this.editor.setValue(savedFile);
                }
            }

            localStorage.setItem('lastRun', JSON.stringify(this.code));
            localStorage.setItem('currentFile', file);
        },
        onResize(val) {
            if (val) {
                localStorage.setItem('resizer', val);

                if (val !== 0 || val !== 100) {
                    this.layout = 'split';
                    localStorage.setItem('layout', 'split');
                }
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

                try {
                    const {data: response} = await this.axios.post(`${window.urlPath}`, data).catch((error) => {
                        if (error.response) {
                            this.showMessage('error', `<strong>Error ${error.response.status}:</strong> ${error.response.data.message}`);
                        } else {
                            this.showMessage('error', 'Failed to Execute Code');
                        }
                    });

                    if (response) {
                        this.result = response.result;
                        this.executionTime = response.executionTime || 1;

                        // Switch back to split view if in code view and running code
                        if (this.layout === 'left') {
                            this.switchLayout('split');
                        }
                    }
                } catch (err) {
                    this.showMessage('error', `${err.message}`);
                }

                this.processing = false;
            }
        },
        saveFile() {
            if (this.currentFile) {
                this.codeInit = this.code;
                this.fileModified = false;

                localStorage.setItem(this.currentFile, JSON.stringify(this.code));
            } else {
                this.promptFile();
            }
        },
        showMessage(type, message, callback) {
            let icon = '';

            if (type === 'error' || type === 'warning') {
                icon = '<i class="fa fa-exclamation-triangle"></i>&nbsp; ';
            } else if (type === 'success') {
                icon = '<i class="fa fa-check-square"></i>&nbsp; ';
            } else if (type === 'info') {
                icon = '<i class="fa fa-bell"></i>&nbsp; ';
            }

            this.$toast.open({
                type: type,
                message: `${icon}${message}`,
                duration: (typeof callback === 'function') ? 10000 : 5000,
                dismissible: true,
                position: 'top',
                onClick: (typeof callback === 'function') ? callback : null
            });
        },
        switchLayout(layout) {
            this.layout = layout;

            if (layout === 'left') {
                this.resizer = 100;
            } else if (layout === 'right') {
                this.resizer = 0;
            } else if (layout === 'split') {
                this.resizer = 50;
            }

            localStorage.setItem('resizer', this.resizer);
            localStorage.setItem('layout', layout);
        }
    },
    watch: {
        code: {
            handler() {
                if (this.editor) {
                    this.editor.condition.canRun.set(this.code && this.code !== '');
                }
            }
        },
        fileModified: {
            handler() {
                const icon = (this.fileModified) ? 'modified' : 'favicon';

                // Update Browser Icon to show Unsaved State
                const favicon = document.getElementById('favicon');
                favicon.href = `${window.staticPath}/img/${icon}.ico`;

                if (this.editor) {
                    this.editor.condition.canSave.set(this.fileModified);
                }
            }
        },
        maxDepth: {
            handler() {
                localStorage.setItem('maxDepth', this.maxDepth);
            }
        },
        plainJSON: {
            handler() {
                localStorage.setItem('plainJSON', this.plainJSON);

                // Reset Scroll Top ( Give some time for DOM to update before resetting scroll position )
                setTimeout(() => {
                    const $outputTree = document.querySelector('.outputTree');

                    if (this.plainJSON && this.$refs.outputPlain) {
                        this.$refs.outputPlain.parentNode.scrollTop = 0;
                    } else if (!this.plainJSON && $outputTree) {
                        // Tree Vue Component does not work with $refs, so DOM query needed
                        $outputTree.parentNode.scrollTop = 0;
                    }
                }, 10);
            }
        },
        result: {
            handler() {
                if (this.editor) {
                    this.editor.condition.canClear.set(this.result);
                }
            }
        },
        theme: {
            handler() {
                localStorage.setItem('theme', this.theme);
                document.documentElement.classList = this.theme;
            }
        }
    }
};
</script>
