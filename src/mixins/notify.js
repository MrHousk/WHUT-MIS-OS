let notify = {
    data() {
        return {
            promptMessage: ''
        }
    },
    methods: {
        notify(message, type, duration = 4500, offset = 50, showClose = true) {
            let title = '';
            if (type == 'info' || type == 'warning') {
                title = '提示';
            }
            if (type == 'error') {
                title = '错误';
            }
            if (type == 'success') {
                title = '成功';
            }
            return this.$notify({
                title: title,
                message: message,
                type: type,
                offset: offset,
                duration: duration,
                showClose: showClose
            })
        },
        closeNotify() {
            if (this.promptMessage) {
                this.promptMessage.close();
            }
        }
    }
}
export default notify