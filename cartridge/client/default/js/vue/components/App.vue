<template>
    <div id="app" :class="getTheme">
        <header class="d-flex align-items-center">
            <a href="javascript:void(0);"><img :src="getLogo" alt="logo" class="logo">SFCC Dev Console</a>

            <div class="theme-selector">
                Theme:
                <select v-model="theme">
                    <option v-for="option in themeOptions" :key="option" :value="option">{{option}}</option>
                </select>
            </div>
        </header>

        <template v-if="showStubs">
            <div class="overlay position-fixed" @click="showStubs = false"></div>
            <div class="stubs position-fixed">
                <a v-for="stub in stubs" href="#" @click="loadStub(stub)" class="d-flex justify-content-between align-items-center">
                    <span>{{ stub.title }}</span>
                    <i aria-hidden="true" class="fa fa-crosshairs"></i>
                </a>
            </div>
        </template>

        <split-pane :min-percent="30" :default-percent="50" v-on:resize="onResize" split="vertical" class="flex-grow-1">
            <div slot="paneL" class="d-flex flex-column flex-grow-1">
                <div class="actions d-flex align-items-center">
                    <div class="settings">
                        <a class="settings-btn" href="#" @click.prevent="showStubs = !showStubs"><i class="fa fa-cog"/></a>
                        <span class="note"><b>Alt + X</b> to run</span>
                    </div>

                    <button :disabled="!code || processing" class="btn" @click="runCode">
                        <i :class="[processing ? 'fa fa-spinner spin' : 'fa fa-play']" aria-hidden="true"/>
                        Run
                    </button>

                    <button class="btn" @click="clearCode">
                        <i class="fa fa-refresh" aria-hidden="true"/>
                        Reset
                    </button>

                    <label>
                        Show Functions
                        <input v-model="showFunctions" type="checkbox">
                    </label>

                    <label>
                        Max Depth
                        <select v-model="maxDepth">
                            <option
                                v-for="(n, i) in 10"
                                :key="i"
                                :value="n"
                                :selected="n === 3"
                                v-text="n"
                            />
                        </select>
                    </label>
                </div>

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

            <template slot="paneR">
                <div class="actions d-flex align-items-center">
                    <button class="btn" @click="clearResult">
                        <i class="fa fa-eraser" aria-hidden="true"/>
                        Clear
                    </button>

                    <label>
                        Raw JSON
                        <input v-model="plainJSON" type="checkbox">
                    </label>
                </div>

                <div class="flex-grow-1 px-3" v-if="result">
                    <pre v-if="plainJSON">{{ JSON.stringify(result, null, 2) }}</pre>
                    <tree-view v-else :data="result" :options="{maxDepth: 1, rootObjectKey: 'result'}"/>
                </div>
            </template>
        </split-pane>
    </div>
</template>

<script>
import SplitPane from 'vue-splitpane'
import MonacoEditor from 'vue-monaco-cdn';

export default {
    name: 'App',
    components: {
        MonacoEditor,
        SplitPane
    },
    data() {
        return {
            editor: null,
            code: 'return session;',
            showFunctions: false,
            processing: false,
            result: null,
            plainJSON: false,
            maxDepth: 3,
            stubs: [],
            showStubs: false,
            theme: 'vs',
            themeOptions: ['vs', 'vs-dark', 'hc-black']
        };
    },
    mounted() {
        const showFunctions = localStorage.getItem('showFunctions');
        const maxDepth = localStorage.getItem('maxDepth');
        const plainJSON = localStorage.getItem('plainJSON');
        const theme = localStorage.getItem('theme');

        this.plainJSON = plainJSON === 'true';
        this.showFunctions = showFunctions === 'true';

        if (maxDepth) {
            this.maxDepth = parseInt(maxDepth);
        }

        if (theme) {
            this.theme = theme;
        }

        this.fetchStubs();
    },
    computed: {
        codeEditor() {
            return {
                options: {
                    theme: this.theme,
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                    scrollBeyondLastLine: true,
                    smoothScrolling: true,
                    fontLigatures: true,
                    minimap: {
                        enabled: false
                    }
                }
            };
        },
        getTheme() {
            return `d-flex flex-column ${this.theme}`
        },
        getLogo() {
            return `${window.staticPath}/img/logo.png`
        }
    },
    methods: {
        editorDidMount(editor) {
            this.editor = editor;

            // fix bug with setTheme
            if (typeof this.editor.setTheme === 'undefined') {
                this.editor.setTheme = function(){};
            }

            const lastRun = localStorage.getItem('lastRun');
            const theme = localStorage.getItem('theme');

            if (lastRun) {
                this.code = lastRun;
            }

            if (theme) {
                this.theme = theme;
            }

            this.editor.onKeyDown(this.check);
        },

        clearCode() {
            this.editor.setValue('');
        },

        clearResult() {
            this.result = null;
        },

        check(e) {
            if (e.keyCode === 88 && e.altKey) {
                this.runCode();
            }
        },

        async runCode() {
            if (this.code) {
                this.processing = true;
                this.clearResult();
                const data = new URLSearchParams();
                data.append('code', this.code);
                data.append('showFunctions', this.showFunctions);
                data.append('maxDepth', this.maxDepth);

                localStorage.setItem('lastRun', this.code);
                localStorage.setItem('showFunctions', this.showFunctions);
                localStorage.setItem('maxDepth', this.maxDepth);
                localStorage.setItem('plainJSON', this.plainJSON);
                localStorage.setItem('theme', this.theme);

                try {
                    const response = await this.axios.post(`${window.urlPath}/Console-Run`, data);

                    // the following 3 properties come from the default
                    // dw json response and we dont need them
                    delete response.data.locale;
                    delete response.data.action;
                    delete response.data.queryString;
                    this.result = response.data;
                } catch (e) {
                    console.log(e);
                }

                this.processing = false;
            }
        },

        loadStub(stub) {
            this.editor.setValue(stub.stub);
            this.showStubs = false;
        },

        async fetchStubs() {
            try {
                const response = await this.axios.get(`${window.staticPath}/stubs/list.txt`);
                const stubs = response.data.split('\n').filter((s) => s);

                for (const stub of stubs) {
                    const response = await this.axios.get(`${window.staticPath}stubs/${stub}`);

                    this.stubs.push({title: stub, stub: response.data});
                }
            } catch (e) {
                console.log(error)
            }
        },

        onResize() {
            this.editor.layout();
        }
    },
    watch: {
        theme: {
            immediate: true,
            handler() {
                localStorage.setItem('theme', this.theme);
            }
        }
    },
};
</script>
