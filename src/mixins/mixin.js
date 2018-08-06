let mixin = {
    data() {
        return {
            codeAreaShow: false, //代码是否展示，初始值为不展示
            ballsStatus: true
        }
    },
    methods: {
        expandCode() {
            this.codeAreaShow = true;
        },
        shrinkCode() {
            this.codeAreaShow = false;
        },
        resetInputForm(formName) {
            this.$refs[formName].resetFields();
        },
        changeBallsStatus() {
            this.ballsStatus = !this.ballsStatus;
        },
    }
}

export default mixin