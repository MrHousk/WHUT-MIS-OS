const login = {
    state: {
        accountIdentity: '',
        account: '',
        realName: '',
        password: '',
        avatar: '',
        beforeLoginUrl: ''
    },
    mutations: {
        recordUrl(state, url) {
            state.beforeLoginUrl = url;
        },
        setAvatar(state, avatarUrl) {
            state.avatar = avatarUrl;
        },
        setName(state, realName) {
            state.realName = realName;
        },
        loginIn(state, { accountIdentity, account, password }) {
            if (accountIdentity == 'admin') {
                localStorage.adminIdentity = accountIdentity;
                localStorage.adminAccount = account;
                localStorage.adminPassword = password;
            }
            if (accountIdentity == 'student') {
                localStorage.studentIdentity = accountIdentity;
                localStorage.studentAccount = account;
                localStorage.studentPassword = password;
            }
            state.accountIdentity = accountIdentity;
            state.account = account;
            state.password = password;
        },
        loginOut(state) {
            if (state.accountIdentity == 'admin') {
                localStorage.removeItem('adminIdentity');
                localStorage.removeItem('adminAccount');
                localStorage.removeItem('adminPassword');
            }
            if (state.accountIdentity == 'student') {
                localStorage.removeItem('studentIdentity');
                localStorage.removeItem('studentAccount');
                localStorage.removeItem('studentPassword');
            }
            state.accountIdentity = '';
            state.account = '';
            state.password = '';
        }
    }
}
export default login