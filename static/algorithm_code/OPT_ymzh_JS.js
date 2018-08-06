/**
 * 最佳置换算法
 * 
 * @param {number} number 物理块数
 * @param {array} pageList 页面列表
 * @returns {array} 返回置换表
 */
function OPT(number, pageList) {
    let inUse = []
    let replaceTable = []

    // 缺页中断时寻找被替换的页面
    function findIndex(array, start) {
        let compare = inUse.slice() //复制一份inUse数组
        for (let i = start; compare.length > 1 && i < array.length; i++) {
            let index = compare.indexOf(array[i])
            if (index >= 0) {
                compare.splice(index, 1)
            }
        }
        return inUse.indexOf(compare[0])
    }

    pageList.forEach((item, index, array) => {
        if (inUse.indexOf(item) >= 0) {
            replaceTable.push({})
        } else if (inUse.length < number) {
            inUse.push(item)
            replaceTable.push({
                inUse: inUse.slice()
            })
        } else {
            let replaceIndex = findIndex(array, index + 1)
            inUse.splice(replaceIndex, 1, item)
            replaceTable.push({
                inUse: inUse.slice(),
                replaceIndex
            })
        }
    })

    return replaceTable
}

console.log(OPT(3, [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1]))