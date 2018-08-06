'use strict'

/*TEST START*/
var i = 0;
for (i=0; i<20; i++)
{
    console.log(RR(i, 3, [0, 2, 3], [4, 2, 4], 2));
}
/*TEST FINISH*/

function RR(clickFrequency, task_num, commit_time, task_time, time_block) //时间片轮转算法需要增加一个参数，time_block即时间片大小
{
    var i, j, k;
    var flag_1 = 0; //flag_1为0意为作业未全部完成，而当所有works的finish_time全不为""时，则将flag_1置为1，SRTF算法结束
    var flag_2 = 0; //flag_2为0意味着未找到当前时间符合运行条件的作业，则时间需向前推进1秒（再次寻找）
    var temp_2, temp_3; //用于给周转时间和带权周转时间求和
    var temp_4; //用于临时记录操作的行号
    var works = [];
    var running_log = []; //运行记录，记录每一秒钟运行的作业id
    var fmtrst = []; //formatResult临时变量
    var averageTurnOverTime = "";
    var averageweightedTurnOverTime = "";
    //对于clickFrequency为0的特殊情况，返回空对象
    if (clickFrequency === 0)
    {
        for (k=0; k<task_num; k++)
        {
            fmtrst.push({
                startTime: '',
                finishTime: '',
                turnOverTime: '',
                weightedTurnOverTime: ''
            })
        }
        running_log.push({
            formatResult: fmtrst.slice(0),
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: ''
        });
        return running_log[clickFrequency]
    }
    //初始化
    for (i=0; i<task_num; i++) //设置初始值
    {
        works.push({
            work_id: i,
            commitTime: commit_time[i],
            run_time: task_time[i],
            remain_time: task_time[i],
            start_time: "",
            finish_time: "",
            turnOverTime: "",
            weightedTurnOverTime: ""
        });
    }
    //封装返回的对象（初始化的情况）
    for (k=0; k<task_num; k++)
    {
        fmtrst.push({
            startTime: works[k].start_time,
            finishTime: works[k].finish_time,
            turnOverTime: works[k].turnOverTime,
            weightedTurnOverTime: works[k].weightedTurnOverTime
          })
    }
    running_log.push({
        formatResult: fmtrst.slice(0),
        averageTurnOverTime: '',
        averageweightedTurnOverTime: '',
        operateTashNum: ''
    });
    //开始RR计算
    i = 0;
    while (flag_1 == 0)
    {
        flag_2 = 0;
        for (j=0; j<task_num; j++)
        {
            fmtrst = [] //每一次新的运行前，清空临时变量
            if ((works[j].remain_time) && (i >= works[j].commitTime)) //如果works[j].remain_time不为0，则说明j作业仍未完成。同时要保证当前系统时间i>=作业提交时间
            {
                flag_2 = 1; //找到符合要求的作业，则将flag_2置为1
                if (works[j].remain_time <= time_block)
                {
                    // 由于剩余时间小于等于时间片长度，则本次运行时间为该作业剩余时间
                    // console.log("present_time: " + i + ", running_id: " + (j+1) + ", running_time:" + works[j].remain_time + "\n");
                    if (works[j].start_time === "")
                        works[j].start_time = i; //如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间
                    i += works[j].remain_time; // 当前时间需加上本次运行的时间
                    works[j].remain_time -= works[j].remain_time; //剩余时间需减去本次运行的时间
                    works[j].finish_time = i; //作业运行完成，设置该作业的结束时间
                    works[j].turnOverTime = parseFloat((works[j].finish_time-works[j].commitTime).toFixed(2));
                    works[j].weightedTurnOverTime = parseFloat((works[j].turnOverTime/works[j].run_time).toFixed(2));
                }
                else
                {
                    // 由于剩余时间大于时间片长度，则本次运行时间为时间片长度
                    // console.log("present_time: " + i + ", running_id: " + (j+1) + ", running_time:" + time_block + "\n");
                    if (works[j].start_time === "")
                        works[j].start_time = i; //如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间
                    i += time_block; // 当前时间需加上本次运行的时间
                    works[j].remain_time -= time_block; //剩余时间需减去本次运行的时间
                }
                //封装返回的对象（初始化的情况）
                for (k=0; k<task_num; k++)
                {
                    fmtrst.push({
                        startTime: works[k].start_time,
                        finishTime: works[k].finish_time,
                        turnOverTime: works[k].turnOverTime,
                        weightedTurnOverTime: works[k].weightedTurnOverTime
                    })
                }
                running_log.push({
                    formatResult: fmtrst.slice(0),
                    averageTurnOverTime: '',
                    averageweightedTurnOverTime: '',
                    operateTashNum: j
                });
            }
        }

        if (flag_2 == 0)
        {
            //flag_1_2为0意味着未找到当前时间符合运行条件的作业，则时间需向前推进1秒（可能是当前时间点已无作业可进行，而有的作业尚未提交，故向前推进1秒并再次寻找）
            i++;
        }

        flag_1 = 1; //先假设全部作业均运行完成
        for (j=0; j<task_num; j++) //循环全部作业，确认是否全部运行完成（找出是否有作业仍未完成）
        {
            if (works[j].finish_time === "")
            {
                flag_1 = 0;
                break;
            }
        }
        if (flag_1 == 1)
        {
            temp_2 = 0;
            temp_3 = 0;
            for (j=0; j<task_num; j++) //计算平均周转时间和平均带权周转时间
            {
                temp_2 += works[j].turnOverTime;
                temp_3 += works[j].weightedTurnOverTime;
            }
            running_log[running_log.length-1].averageTurnOverTime = parseFloat((temp_2/task_num).toFixed(2));
            running_log[running_log.length-1].averageweightedTurnOverTime = parseFloat((temp_3/task_num).toFixed(2));
        }
    }
    //根据clickFrequency返回运行结果
    if (clickFrequency <= running_log.length-1)
    {
        return running_log[clickFrequency]
    }
    else
    {
        return false; //如果clickFrequency超出范围，则返回false
    }
}
