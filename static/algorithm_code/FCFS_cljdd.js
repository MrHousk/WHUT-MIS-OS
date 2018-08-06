//先来先服务算法
FCFS(clickFrequency, task_num, commit_time, task_time) {
    var i = 0,
        j = 0,
        temp = 0,
        k = 0,
        pos = 0;
    var temp_commit_time = [];
    var operator_order = [];
    var format_result = [];
    var fcfsObject = [];

    if (clickFrequency == 0) //第一次调用，初始化，不进行计算
    {
        for (i = 0; i < task_num; i++) {
            format_result.push({
                startTime: '',
                finishTime: '',
                turnOverTime: '',
                weightedTurnOverTime: '',
            });
        }
        fcfsObject.push({
            formatResult: '',
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: ''
        });
        fcfsObject.formatResult = format_result;

        return fcfsObject;
    } else {
        for (i = 0; i < task_num; i++) //初始化
        {
            format_result.push({
                startTime: '',
                finishTime: '',
                turnOverTime: '',
                weightedTurnOverTime: '',
            });
        }
        fcfsObject.push({
            formatResult: '',
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: ''
        });
        for (i = 0; i < task_num; i++) {
            temp_commit_time.push(commit_time[i]);
            operator_order.push(0);
        }

        for (i = 0; i < task_num; i++) //求得运算顺序
        {
            temp = Number.MAX_VALUE;
            for (j = 0; j < task_num; j++) {
                if (temp > temp_commit_time[j]) {
                    temp = temp_commit_time[j];
                    pos = j;
                }
            }
            temp_commit_time[pos] = Number.MAX_VALUE;
            operator_order[i] = pos;
        }
        format_result[operator_order[0]].startTime = parseFloat((commit_time[operator_order[0]]).toFixed(2));
        format_result[operator_order[0]].finishTime = parseFloat((commit_time[operator_order[0]] + task_time[operator_order[0]]).toFixed(2));
        format_result[operator_order[0]].turnOverTime = parseFloat((format_result[operator_order[0]].finishTime -
            commit_time[operator_order[0]]).toFixed(2));
        format_result[operator_order[0]].weightedTurnOverTime = parseFloat((format_result[operator_order[0]].turnOverTime /
            task_time[operator_order[0]]).toFixed(2));
        k = clickFrequency <= task_num ? clickFrequency : task_num;
        for (i = 1; i < k; i++) {
            format_result[operator_order[i]].startTime = format_result[operator_order[i - 1]].finishTime;
            if (format_result[operator_order[i]].startTime < commit_time[operator_order[i]])
                format_result[operator_order[i]].startTime = commit_time[operator_order[i]];
            format_result[operator_order[i]].startTime = parseFloat((format_result[operator_order[i]].startTime).toFixed(2));
            format_result[operator_order[i]].finishTime = parseFloat((format_result[operator_order[i]].startTime + task_time[
                operator_order[i]]).toFixed(2));
            format_result[operator_order[i]].turnOverTime = parseFloat((format_result[operator_order[i]].finishTime -
                commit_time[operator_order[i]]).toFixed(2));
            format_result[operator_order[i]].weightedTurnOverTime = parseFloat((format_result[operator_order[i]].turnOverTime /
                task_time[operator_order[i]]).toFixed(2));
        }
        fcfsObject.formatResult = format_result;
        fcfsObject.operateTashNum = operator_order[k - 1];
        if (clickFrequency == task_num) {
            fcfsObject.averageTurnOverTime = 0;
            fcfsObject.averageweightedTurnOverTime = 0;
            for (i = 0; i < task_num; i++) {
                fcfsObject.averageweightedTurnOverTime += format_result[i].weightedTurnOverTime;
                fcfsObject.averageTurnOverTime += format_result[i].turnOverTime;
            }
            fcfsObject.averageTurnOverTime = parseFloat((fcfsObject.averageTurnOverTime / task_num).toFixed(2));
            fcfsObject.averageweightedTurnOverTime = parseFloat((fcfsObject.averageweightedTurnOverTime / task_num).toFixed(
                2));
        }
    }
}