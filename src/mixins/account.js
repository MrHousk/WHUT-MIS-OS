let account = {
    methods: {
        accountExpire() {
            this.$confirm('账号登录状态失效，请重新登录', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push('/login')
            })
        },
        notLogged(tip) {
            this.$confirm(tip, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push('/login')
            })
        }
    }
}

export default account