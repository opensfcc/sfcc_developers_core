<template>
    <ul v-if="list && list.length > 0">
        <li v-for="msg in list" :key="msg.uid">
            <div class="file">
                <a target="_blank" data-devtool class="ide-file-link"
                    :href="msg.ide"
                    :ref="'ide-link-' + msg.uid"
                    @click.prevent="openIDE(msg.ide, 'ide-link-' + msg.uid)">
                    <strong>FILE:</strong>&nbsp; {{ msg.fileName }}<span>:{{ msg.lineNumber }}</span>
                </a>
            </div>

            <div class="message string" v-if="typeof msg.message !== 'object'">
                {{ msg.message }}
            </div>
            <div class="message tree" v-else>
                <tree-view class="outputTree"
                    :data="msg.message"
                    :options="{ rootObjectKey: 'message', link: true, maxDepth: 1 }"
                />
            </div>

            <div class="stack-trace">
                <button data-devtool @click.prevent="showTrace('trace-list-' + msg.uid)">
                    Stack Trace
                </button>

                <ul class="hidden-trace" :ref="'trace-list-' + msg.uid">
                    <li v-for="(trace, index) in msg.stack" :key="index">
                        <span>{{ (index + 1) }}.</span> {{ trace }}
                    </li>
                </ul>
            </div>

            <div class="divider-line"></div>
        </li>
    </ul>
    <span v-else class="no-results">No Messages</span>
</template>

<script>
export default {
    name: 'Messages',
    props: {
        list: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    methods: {
        openIDE(url, ref) {
            var $elm = this.$refs[ref][0];

            $elm.classList.add('loading');

            this.axios.get(url);

            setTimeout(() => {
                $elm.classList.remove('loading');
                $elm.classList.remove('success');
            }, 3000);
        },
        showTrace(ref) {
            this.$refs[ref][0].classList.toggle('hidden-trace');
        }
    }
}
</script>
