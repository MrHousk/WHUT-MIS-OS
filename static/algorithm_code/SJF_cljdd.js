SJF(clickFrequency, task_num, commit_time, task_time) 
{
    var i = 0,
        j = 0,
        temp = 0,
        k = 0,
        pos = 0;
    var temp_commit_time = []; //临时存储提交时间
    var temp_task_time = []; //临时存储运行时间
    var operate_order_temp = []; //对提交的进程按时间顺序排序
    var operate_order = []; //求得最终的运行顺序
    var format_result = []; //输出结果到数组
    var total_operate_time = 0; //到目前为止所经历的总时间
    var time_one = 0,
        time_two = 0; //辅助计算到目前位置所经历的总时间
    var max_range = 0; //当前时间内到达的进程个数
    var min = 0;
    var flag = 0; //是否找到进程
    var sjfObject = [];

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

        sjfObject.push({
            formatResult: '',
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: ''
        });
        sjfObject.formatResult = format_result;

        return sjfObject;
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
        sjfObject.push({
            formatResult: '',
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: ''
        });
        for (i = 0; i < task_num; i++) {
            temp_commit_time.push(commit_time[i]); //拷贝提交的时间副本
            temp_task_time.push(task_time[i]); //拷贝运行时间副本
            operate_order_temp.push(0); //初始化
            operate_order.push(-1);
        }
        for (i = 0; i < task_num; i++) //按时间顺序对进程排序
        {
            temp = Number.MAX_VALUE;
            for (j = 0; j < task_num; j++) {
                if (temp > temp_commit_time[j]) {
                    temp = temp_commit_time[j];
                    pos = j;
                }
            }
            temp_commit_time[pos] = Number.MAX_VALUE;
            operate_order_temp[i] = pos;
        }

        operate_order[0] = operate_order_temp[0]; //首先运行第一个到来的进程
        temp_task_time[operate_order[0]] = -1; //第一个到来的进程已经被计算
        total_operate_time = commit_time[operate_order[0]]; //到目前为止所经历的总时间
        format_result[operate_order[0]].startTime = parseFloat((commit_time[operate_order[0]]).toFixed(2));
        format_result[operate_order[0]].finishTime = parseFloat((commit_time[operate_order[0]] + task_time[operate_order[0]]).toFixed(2));
        format_result[operate_order[0]].turnOverTime = parseFloat((format_result[operate_order[0]].finishTime -
            commit_time[operate_order[0]]).toFixed(2));
        format_result[operate_order[0]].weightedTurnOverTime = parseFloat((format_result[operate_order[0]].turnOverTime /
            task_time[operate_order[0]]).toFixed(2));
        sjfObject.formatResult = format_result;
        sjfObject.operateTashNum = operate_order[0];
        if (clickFrequency == 1)
            return sjfObject;
        for (i = 1; i < task_num; i++) {
            time_one = total_operate_time + task_time[operate_order[i - 1]];
            time_two = commit_time[operate_order[i - 1]] + task_time[operate_order[i - 1]];
            total_operate_time = time_one < time_two ? time_two : time_one; //total_operate_time就是finishTime
            max_range = 0;
            for (j = 0; j < task_num; j++) {
                if (commit_time[operate_order_temp[j]] <= total_operate_time)
                    max_range++;
                else
                    break;
            }
            min = Number.MAX_VALUE;
            for (j = 1; j < max_range; j++) {
                if (temp_task_time[operate_order_temp[j]] == -1)
                    continue;
                if (min > temp_task_time[operate_order_temp[j]]) {
                    min = temp_task_time[operate_order_temp[j]];
                    pos = j;
                    flag = 1;
                }
            }
            if (flag == 0) {
                operate_order[i] = operate_order_temp[max_range];
                temp_task_time[operate_order[i]] = -1;
                total_operate_time = commit_time[operate_order[i]];
            } else {
                operate_order[i] = operate_order_temp[pos];
                temp_task_time[operate_order[i]] = -1;
            }
            flag = 0;
        }
        k = clickFrequency <= task_num ? clickFrequency : task_num;
        for (i = 1; i < k; i++) {
            format_result[operate_order[i]].startTime = format_result[operate_order[i - 1]].finishTime;
            if (format_result[operate_order[i]].startTime < commit_time[operate_order[i]])
                format_result[operate_order[i]].startTime = commit_time[operate_order[i]];
            format_result[operate_order[i]].startTime = parseFloat((format_result[operate_order[i]].startTime).toFixed(2));
            format_result[operate_order[i]].finishTime = parseFloat((format_result[operate_order[i]].startTime + task_time[
                operate_order[i]]).toFixed(2));
            format_result[operate_order[i]].turnOverTime = parseFloat((format_result[operate_order[i]].finishTime -
                commit_time[operate_order[i]]).toFixed(2));
            format_result[operate_order[i]].weightedTurnOverTime = parseFloat((format_result[operate_order[i]].turnOverTime /
                task_time[operate_order[i]]).toFixed(2));
        }
        sjfObject.formatResult = format_result;
        sjfObject.operateTashNum = operate_order[k - 1];
        if (clickFrequency == task_num) {
            sjfObject.averageTurnOverTime = 0;
            sjfObject.averageweightedTurnOverTime = 0;
            for (i = 0; i < task_num; i++) {
                sjfObject.averageweightedTurnOverTime += format_result[i].weightedTurnOverTime;
                sjfObject.averageTurnOverTime += format_result[i].turnOverTime;
            }
            sjfObject.averageTurnOverTime = parseFloat((sjfObject.averageTurnOverTime / task_num).toFixed(2));
            sjfObject.averageweightedTurnOverTime = parseFloat((sjfObject.averageweightedTurnOverTime / task_num).toFixed(
                2));
        }
    }

    return sjfObject;
}