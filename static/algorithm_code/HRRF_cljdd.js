HRRF(clickFrequency, task_num, commit_time, task_time) 
{
    var i = 0,
        j = 0,
        temp = 0,
        k = 0,
        pos = 0;
    var temp_commit_time = []; //临时存储提交时间
    var operate_order_temp = []; //对提交的进程按时间顺序排序
    var operate_order = []; //求得最终的运行顺序
    var format_result = []; //输出结果到数组
    var response_ratio = []; //比例
    var response_ratio_to_fill = []; //每次用来填充的相应比
    var need_operate = [];
    var total_operate_time = 0; //到目前为止所经历的总时间
    var time_one = 0,
        time_two = 0; //辅助计算到目前位置所经历的总时间
    var max_range = 0; //当前时间内到达的进程个数
    var max = 0;
    var flag = 0; //是否找到进程
    var hrrfObject = [];

    if (clickFrequency == 0) //第一次调用，初始化，不进行计算
    {
        for (i = 0; i < task_num; i++) {
            format_result.push({
                startTime: '',
                finishTime: '',
                turnOverTime: '',
                weightedTurnOverTime: '',
                responseRatio: '',
            });
        }
        hrrfObject.push({
            formatResult: '',
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: ''
        });
        hrrfObject.formatResult = format_result;

        return hrrfObject;
    } else {
        for (i = 0; i < task_num; i++) //初始化
        {
            format_result.push({
                startTime: '',
                finishTime: '',
                turnOverTime: '',
                weightedTurnOverTime: '',
                responseRatio: '',
            });
        }
        hrrfObject.push({
            formatResult: '',
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: ''
        });
        for (i = 0; i < task_num; i++) {
            temp_commit_time.push(commit_time[i]); //拷贝提交的时间副本
            operate_order_temp.push(0); //初始化
            operate_order.push(-1);
            need_operate.push(0);
            response_ratio.push();
            response_ratio_to_fill.push(0);
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
        need_operate[0] = -1; //第一个到来的进程已经被计算
        total_operate_time = commit_time[operate_order[0]]; //到目前为止所经历的总时间
        response_ratio[0] = 1; //第一个到达的进程相应比为1
        format_result[operate_order[0]].startTime = parseFloat((commit_time[operate_order[0]]).toFixed(2));
        format_result[operate_order[0]].finishTime = parseFloat((commit_time[operate_order[0]] + task_time[operate_order[0]]).toFixed(2));
        format_result[operate_order[0]].turnOverTime = parseFloat((format_result[operate_order[0]].finishTime -
            commit_time[operate_order[0]]).toFixed(2));
        format_result[operate_order[0]].weightedTurnOverTime = parseFloat((format_result[operate_order[0]].turnOverTime /
            task_time[operate_order[0]]).toFixed(2));
        format_result[operate_order[0]].responseRatio = parseFloat((response_ratio[0]).toFixed(2));
        hrrfObject.formatResult = format_result;
        hrrfObject.operateTashNum = operate_order[0];
        if (clickFrequency == 1)
            return hrrfObject;
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
            for (j = 1; j < max_range; j++) {
                if (need_operate[j] == -1)
                    continue;
                else
                    response_ratio[j] = parseFloat((1 + ((total_operate_time - commit_time[operate_order_temp[j]]) /
                        task_time[operate_order_temp[j]]).toFixed(2))); //响应比=1+等待时间/要求服务的时间
            }
            max = Number.MIN_VALUE;
            for (j = 1; j < max_range; j++) {
                if (need_operate[j] == -1)
                    continue;
                if (max < response_ratio[j]) {
                    max = response_ratio[j];
                    pos = j;
                    flag = 1;
                }
            }
            if (flag == 0) {
                operate_order[i] = operate_order_temp[max_range];
                need_operate[max_range] = -1;
                total_operate_time = commit_time[operate_order[i]];

                response_ratio[max_range] = 1;
                format_result[operate_order[i]].responseRatio = 1;

            } else {
                operate_order[i] = operate_order_temp[pos];
                need_operate[pos] = -1;
            }
            flag = 0;
            if (i + 1 == clickFrequency) //保存第i次的相应比
            {
                for (j = 0; j < max_range; j++) {
                    response_ratio_to_fill[j] = response_ratio[j];
                }
                temp = max_range;
            }
        }

        k = clickFrequency <= task_num ? clickFrequency : task_num;
        for (i = 1; i < k; i++) {
            format_result[operate_order[i]].startTime = parseFloat((format_result[operate_order[i - 1]].finishTime).toFixed(2));
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
        for (i = 1; i < (temp < task_num ? temp : task_num); i++) {
            format_result[operate_order_temp[i]].responseRatio = parseFloat((response_ratio_to_fill[i]).toFixed(2));
        }
        hrrfObject.formatResult = format_result;
        hrrfObject.operateTashNum = operate_order[k - 1];
        if (clickFrequency == task_num) {
            hrrfObject.averageTurnOverTime = 0;
            hrrfObject.averageweightedTurnOverTime = 0;
            for (i = 0; i < task_num; i++) {
                hrrfObject.averageweightedTurnOverTime += format_result[i].weightedTurnOverTime;
                hrrfObject.averageTurnOverTime += format_result[i].turnOverTime;
            }
            hrrfObject.averageTurnOverTime = parseFloat((hrrfObject.averageTurnOverTime / task_num).toFixed(2));
            hrrfObject.averageweightedTurnOverTime = parseFloat((hrrfObject.averageweightedTurnOverTime / task_num).toFixed(
                2));
        }

    }

    return hrrfObject;
}