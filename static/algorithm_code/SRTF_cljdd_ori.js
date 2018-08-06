'use strict'

/*TEST START*/
var i = 0;
// for (i=0; i<20; i++)
// {
//     console.log(SRTF(i, 5, [0, 2, 1, 4, 3], [8, 6, 4, 3, 2]));
// }
SRTF(1, 5, [0, 2, 1, 4, 3], [8, 6, 4, 3, 2])
/*TEST FINISH*/

function SRTF(clickFrequency, task_num, commit_time, task_time)
{
    var i, j;
    var flag = 0; //flag为0意为作业未全部完成，而当所有works的finish_time全不为""时，则将flag置为1，SRTF算法结束
    var temp = [0, 0]; //临时变量，用于存储当前剩余时间最短的作业的作业号和时间
    var works = [];
    var temp_2, temp_3; //用于给周转时间和带权周转时间求和
    var running_log = []; //运行记录，记录每一秒钟运行的作业id
    var fmtrst = []; //formatResult临时变量
    //对于clickFrequency为0的特殊情况，返回空对象
    if (clickFrequency === 0)
    {
        for (j=0; j<task_num; j++)
        {
            fmtrst.push({
                startTime_1: '',
                startTime_2: '',
                startTime_3: '',
                finishTime: '',
                turnOverTime: '',
                weightedTurnOverTime: '',
                remainTime: ''
            })
        }
        running_log.push({
            formatResult: fmtrst.slice(0),
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: '',
            currentTime: ''
        });
        return running_log[clickFrequency]
    }
    //初始化
    for (j=0; j<task_num; j++) //设置初始值
    {
        works.push({
            work_id: j,
            commitTime: commit_time[j],
            run_time: task_time[j],
            remain_time: task_time[j],
            startTime_1: "",
            startTime_2: "",
            startTime_3: "",
            finish_time: "",
            turnOverTime: "",
            weightedTurnOverTime: ""
        });
    }
    //封装返回的对象（初始化的情况）
    for (j=0; j<task_num; j++)
    {
        fmtrst.push({
            startTime_1: works[j].startTime_1,
            startTime_2: works[j].startTime_2,
            startTime_3: works[j].startTime_3,
            finishTime: works[j].finish_time,
            turnOverTime: works[j].turnOverTime,
            weightedTurnOverTime: works[j].weightedTurnOverTime,
            remainTime:works[j].remain_time
          })
    }
    running_log.push({
        formatResult: fmtrst.slice(0),
        averageTurnOverTime: '',
        averageweightedTurnOverTime: '',
        operateTashNum: '',
        currentTime: ''
    });
    //开始SRTF计算
    for (i=0; flag==0; i++) //每次循环模拟系统运行的一个单位时间
    {
        fmtrst = []//每个“新的一单位时间”，清空临时变量
        temp[0] = ""; //每个“新的一单位时间”，将temp作业号初始化为""
        temp[1] = 10000; //每个“新的一单位时间”，将temp的剩余时间初始化为10000（一个极大值）

        for (j=0; j<task_num; j++) //选择这一单位时间运行的作业（寻找剩余时间最短的作业执行）
        {
            if ((works[j].finish_time === "") && (i >= works[j].commitTime)) //如果works[j].finish_time为""，则说明j作业仍未完成。同时要保证当前系统时间i>=作业提交时间
            {
                if (works[j].remain_time < temp[1]) //选取目前遇到的最小的剩余时间的作业作为temp，当j循环全部结束，temp中保存的就是最小剩余时间的作业的信息
                {
                    temp[0] = j;
                    temp[1] = works[j].remain_time;
                }
            }
        }

        if (temp[0] !== "")
        {
            if (works[temp[0]].startTime_1 === "")
            {
                works[temp[0]].startTime_1 = i; //如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间
            }
            else if (running_log[running_log.length-1].operateTashNum !== temp[0])
            {
                if (works[temp[0]].startTime_2 === "")
                {
                    works[temp[0]].startTime_2 = i;
                }
                else if (works[temp[0]].startTime_3 === "")
                {
                    works[temp[0]].startTime_3 = i;
                }
            }
            works[temp[0]].remain_time = works[temp[0]].remain_time - 1; //该作业剩余时间减1
            if (works[temp[0]].remain_time == 0)
            {
                works[temp[0]].finish_time = i+1; //如果该作业运行完这一秒后剩余时间为0，则将下一秒设为该作业的结束时间
                works[temp[0]].turnOverTime = parseFloat((works[temp[0]].finish_time-works[temp[0]].commitTime).toFixed(2));
                works[temp[0]].weightedTurnOverTime = parseFloat((works[temp[0]].turnOverTime/works[temp[0]].run_time).toFixed(2));
            }
            // console.log("present_time: " + (i+1) + ", running_id: " + (temp[0]+1));
            //封装返回的对象
            for (j=0; j<task_num; j++)
            {
                fmtrst.push({
                    startTime_1: works[j].startTime_1,
                    startTime_2: works[j].startTime_2,
                    startTime_3: works[j].startTime_3,
                    finishTime: works[j].finish_time,
                    turnOverTime: works[j].turnOverTime,
                    weightedTurnOverTime: works[j].weightedTurnOverTime,
                    remainTime:works[j].remain_time
                  })
            }
            running_log.push({
                formatResult: fmtrst.slice(0),
                averageTurnOverTime: '',
                averageweightedTurnOverTime: '',
                operateTashNum: temp[0],
                currentTime: (i+1).toString()
            });
        }

        flag = 1; //先假设全部作业均运行完成
        for (j=0; j<task_num; j++) //循环全部作业，确认是否全部运行完成（找出是否有作业仍未完成）
        {
            if (works[j].finish_time === "")
            {
                flag = 0;
                break;
            }
        }
        if (flag == 1)
        {
            fmtrst = [] //由于后面要重新装载fmtrst，故先清空之前插入的值
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
        console.log(running_log[running_log.length-1]);
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