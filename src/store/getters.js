const getters = {
    isCollapse: state => state.app.isCollapse,
    account: state => state.login.account,
    realName: state => state.login.realName,
    password: state => state.login.password,
    avatar: state => state.login.avatar,
    accountIdentity: state => state.login.accountIdentity,
    selectedAlgorithm: state => state.algorithm.selectedAlgorithm,
}
export default getters