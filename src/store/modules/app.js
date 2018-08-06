const app = {
    state: {
        isCollapse: false, //左侧导航栏默认展开
    },
    mutations: {
        changeNavStatus(state, status = !state.isCollapse) {
            state.isCollapse = status;
        }
    }
}
export default app