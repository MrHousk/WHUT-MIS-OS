const algorithm = {
    state: {
        selectedAlgorithm: '',
    },
    mutations: {
        changeAlgorithm(state, selectedAlgorithm) {
            state.selectedAlgorithm = selectedAlgorithm;
        }
    }
}

export default algorithm