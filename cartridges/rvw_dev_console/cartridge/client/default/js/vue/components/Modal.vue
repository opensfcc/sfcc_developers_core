<template>
    <!-- New File Modal -->
    <transition name="modal">
        <div id="modal" class="modal-mask" @click="$emit('close')" @keydown.esc="$emit('close')">
            <div class="modal-wrapper">
                <div class="modal-container" @click.stop="$event.preventDefault()">
                    <div class="modal-header">
                        <slot name="header"></slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body"></slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Modal',
    data () {
        return {
            showModal: false
        };
    }
};
</script>
