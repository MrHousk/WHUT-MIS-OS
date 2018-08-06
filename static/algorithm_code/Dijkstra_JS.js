'use strict'

main()

function main() {
    var i;
    var p_num = 4;
    var r_num = 3;
    var available = [];
    var max = [];
    var allocation = [];
    var need = [];
    var request = [];
    var secured_sequence = [];
    var running_log = [];

    getRandomData(available, max, allocation, need, request, secured_sequence, p_num, r_num);

    request[0] = 0;
    request[1] = 0;
    request[2] = 0;
    request[3] = 0; //进程号

    if (requestInspect(available, max, allocation, need, request, secured_sequence, p_num, r_num)) {
        console.log("request不符合要求");
        return false;
    }
    running_log = getSolution(available, max, allocation, need, request, secured_sequence, p_num, r_num);
    for (i = 0; i < running_log.length; i++) {
        console.log(running_log[i]);
    }
    console.log(secured_sequence);
}

function getRandomData(available, max, allocation, need, request, secured_sequence, p_num, r_num) {
    var answer = [];//首先生成随机答案序列
    var temp_answer = [];//答案序列临时变量
    var upper_limit = [];//need分配矩阵上界
    var lower_limit = [];//need分配矩阵下限
    var max_pos = p_num;//初始化随机种子，初始化最大寻址位置
    var seed = 0;//初始化随机种子，初始化最大寻址位置
    var need_random = 0;//确定需要随机分配的在lower_limit和upper_limit之间数的个数
    var i = 0, j = 0, temp = 0;//temp来存储随机数
    var range_max = 15;

    //---第一个模块，首先随机生成答案,即：生成[0~r_num]的不同的随机数-------------------
    for (i = 0; i < p_num; i++)//从0开始初始化答案序列数组
    {
        temp_answer.push(i);
    }
    //生成随机答案序列
    for (i = 0; i < p_num; i++) {
        temp = parseInt(Math.random() * (max_pos));
        max_pos--;
        answer.push(temp_answer[temp]);//把temp位置的数放在放在answer[i]位置上

        for (j = temp; j < max_pos; j++) {
            temp_answer[j] = temp_answer[j + 1];//将temp_answer第temp位后所有项依此前移一位
        }
    }
    for (i = 0; i < p_num * r_num; i++) {
        allocation.push(parseInt(Math.random() * (range_max)) + 1);//生成范围在[0,range_max]范围的数值
    }

    //--第二部分，产生表示已分配资源的随机数----

    for (i = 0; i < p_num * r_num; i++) {
        need.push(0);//给need全部赋值为0  
    }
    for (i = 0; i < r_num; i++) {
        lower_limit.push(0);
    }

    for (i = 0; i < r_num; i++) {
        need[answer[0] * r_num + i] = parseInt(Math.random() * (range_max)) + 1;//为答案的第一个进程分配它已经分配的资源，至少一个
        upper_limit.push(need[answer[0] * r_num + i] + parseInt(Math.random() * (range_max / 3)) + 3);//可以满足该进程，是因为该进程的资源所需小于upper_limit矩阵,“2”表示希望差距最小是2，必须有
        available.push(upper_limit[i]);//系统所剩总资源
    }

    for (i = 1; i < p_num; i++) {
        for (j = 0; j < r_num; j++)
            lower_limit[j] = upper_limit[j];
        for (j = 0; j < r_num; j++)
            upper_limit[j] += allocation[(answer[i - 1] * r_num + j)];
        //选择(r_num / 3 + 1)个数，使得这些数在[lower_limit,upper_limint]之间
        need_random = (r_num / 3 + 1);
        for (j = 0; j < need_random; j++) {
            //随机生成上一次系统所剩的总资源和释放上一次系统所占用的资源后之间的数
            temp = parseInt(Math.random() * (r_num));
            need[answer[i] * r_num + temp] = parseInt(Math.random() * (upper_limit[temp] - lower_limit[temp])) + lower_limit[temp] + 1;
        }
        for (j = 0; j < r_num; j++) {
            if (need[(answer[i] * r_num + j)] == 0)//如果这个地方还没有被赋过值，则赋值,need矩阵初始值一定要为0
            {
                need[(answer[i] * r_num + j)] = parseInt(Math.random() * (upper_limit[j])) + 1;
            }

        }
    }
    for (i = 0; i < r_num * p_num; i++) {
        max.push(need[i] + allocation[i]);
    }
    //-----------------测试输出随机答案------------------------
    console.log("max:");
    console.log(max);
    console.log("need:");
    console.log(need);
    console.log("answer");
    console.log(answer);
    console.log("allocation:");
    console.log(allocation);
    console.log("available");
    console.log(available);
}

function requestInspect(available, max, allocation, need, request, secured_sequence, p_num, r_num) {
    //request请求合法性检查，检查此次申请的数量是否合法，即请求量是否超过系统剩余，以及本次分配之后，该进程占有资源量是否超出声明量，返回值为0时代表合法
    var i;
    for (i = 0; i < r_num; i++) {
        if ((allocation[request[r_num] * r_num + i] + request[i]) > max[request[r_num] * r_num + i]) {
            console.log("er1");
            return 1; //所需资源加已分配资源超过声明最大值，返回1
        }
        if (request[i] > available[i]) {
            console.log("er2");
            return 2; //请求资源超过系统剩余，返回2
        }
    }
    return 0; //request请求符合基本检查要求，返回0
}

function getSolution(available, max, allocation, need, request, secured_sequence, p_num, r_num) {
    var i, j, m; //循环变量，无实际意义
    var flag; //标识符，标识对应线程是否能安全完成
    var last_process = p_num - 1; //最后被执行过的进程号（上一次被执行的进程）

    var finish = []; //进程完成指示向量，finish[x]的bool值代表第x个进程是否完成
    var work = available.slice(); //当前可用资源向量（实时变化，初始值等于available）
    var allo = allocation.slice(); //当前各进程占用资源矩阵（实时变化，初始值等于allocation）
    var ned = need.slice(); //当前各进程需求资源矩阵（实时变化，初始值等于need）
    var running_log = []; 
    var log_times = 0;

    for (j = 0; j < p_num; j++) //给安全序列和完成序列设置初始值
    {
        secured_sequence.push(-1);
        finish.push(false);
    }

    running_log.push({
        Work: work.slice(),
        Allo: allo.slice(),
        Ned: ned.slice(),
        SecuredSequence: secured_sequence.slice(),
        Finish: finish.slice(),
        RequestHighlightLine: "",
        RequestHighlightColumn: "",
        WorkHighlightLine: "",
        WorkHighlightColumn: "",
        AlloHighlightLine: "",
        AlloHighlightColumn: "",
        NedHighlightLine: "",
        NedHighlightColumn: "",
        IsError: false,
        PromptMessage: "初始化数据及设置初值",
        LogTimes: ++log_times //测试优化用参数，记录log次数
    });

    for (i = 0; i < r_num; i++) //预分配，计算这次资源请求后，系统资源情况
    {
        work[i] = work[i] - request[i];
        allo[request[r_num] * r_num + i] = allo[request[r_num] * r_num + i] + request[i];
        ned[request[r_num] * r_num + i] = ned[request[r_num] * r_num + i] - request[i];
        running_log.push({
            Work: work.slice(),
            Allo: allo.slice(),
            Ned: ned.slice(),
            SecuredSequence: secured_sequence.slice(),
            Finish: finish.slice(),
            RequestHighlightLine: 0,
            RequestHighlightColumn: i,
            WorkHighlightLine: 0,
            WorkHighlightColumn: i,
            AlloHighlightLine: request[r_num],
            AlloHighlightColumn: i,
            NedHighlightLine: request[r_num],
            NedHighlightColumn: i,
            IsError: false,
            PromptMessage: "预分配，计算满足本次资源请求后，系统资源情况",
            LogTimes: ++log_times
        });
    }

    running_log.push({
        Work: work.slice(),
        Allo: allo.slice(),
        Ned: ned.slice(),
        SecuredSequence: secured_sequence.slice(),
        Finish: finish.slice(),
        RequestHighlightLine: "",
        RequestHighlightColumn: "",
        WorkHighlightLine: "",
        WorkHighlightColumn: "",
        AlloHighlightLine: "",
        AlloHighlightColumn: "",
        NedHighlightLine: "",
        NedHighlightColumn: "",
        IsError: false,
        PromptMessage: "开始寻找安全序列...",
        LogTimes: ++log_times
    });

    //开始寻找安全序列
    j = -1; //初始值设为-1，进入do while循环后先+1，即从第0条进程开始寻找
    for (m = 0; m < p_num; m++) //循环p_num次，每次循环寻找一条可以安全完成的进程
    {
        do //中层循环，从上一次成功执行的进程开始向后寻找可以被执行的进程，若可以完成，则插入安全序列并释放资源
        {
            j += 1; //比较查询的进程号+1
            if (j == p_num)
            {
                j = 0; //当j(寻找的进程号)超过范围时，重置为0
            }
            flag = 1; //先假设这条进程能够安全完成
            if (finish[j] == false) {
                for (i = 0; i < r_num; i++) //循环r_num次，判断每一种资源是否够第j个线程的需求
                {
                    running_log.push({
                        Work: work.slice(),
                        Allo: allo.slice(),
                        Ned: ned.slice(),
                        SecuredSequence: secured_sequence.slice(),
                        Finish: finish.slice(),
                        RequestHighlightLine: "",
                        RequestHighlightColumn: "",
                        WorkHighlightLine: 0,
                        WorkHighlightColumn: i,
                        AlloHighlightLine: "",
                        AlloHighlightColumn: "",
                        NedHighlightLine: j,
                        NedHighlightColumn: i,
                        IsError: false,
                        PromptMessage: "判断剩余资源是否满足第" + (j + 1).toString() + "条线程需求",
                        LogTimes: ++log_times
                    });
                    if (ned[j * r_num + i] > work[i]) {
                        flag = 0; //这条线程所需的资源超过了现有资源（work），不能安全完成
                        running_log.push({
                            Work: work.slice(),
                            Allo: allo.slice(),
                            Ned: ned.slice(),
                            SecuredSequence: secured_sequence.slice(),
                            Finish: finish.slice(),
                            RequestHighlightLine: "",
                            RequestHighlightColumn: "",
                            WorkHighlightLine: 0,
                            WorkHighlightColumn: i,
                            AlloHighlightLine: "",
                            AlloHighlightColumn: "",
                            NedHighlightLine: j,
                            NedHighlightColumn: i,
                            IsError: true,
                            PromptMessage: "第" + (j + 1).toString() + "条线程所需的资源超过了现有资源（work），不能安全完成",
                            LogTimes: ++log_times
                        });
                        break;
                    }
                }
                if (flag == 1) //经过了上面的for循环，flag仍为1，则意味着这条线程所需的所有资源都在现有（work）范围内，则插入安全序列并释放资源
                {
                    secured_sequence[m] = "P" + j.toString(); //插入安全序列
                    for (i = 0; i < r_num; i++) //释放进程J所占有的资源
                    {
                        work[i] = work[i] + allo[j * r_num + i];
                        allo[j * r_num + i] = 0;
                        ned[j * r_num + i] = 0;
                    }
                    finish[j] = true; //将第j条进程置为已完成
                    running_log.push({
                        Work: work.slice(),
                        Allo: allo.slice(),
                        Ned: ned.slice(),
                        SecuredSequence: secured_sequence.slice(),
                        Finish: finish.slice(),
                        RequestHighlightLine: "",
                        RequestHighlightColumn: "",
                        WorkHighlightLine: 0,
                        WorkHighlightColumn: "",
                        AlloHighlightLine: j,
                        AlloHighlightColumn: "",
                        NedHighlightLine: j,
                        NedHighlightColumn: "",
                        IsError: false,
                        PromptMessage: "第" + (j + 1).toString() + "条线程所需的资源可以满足，插入安全序列并释放资源",
                        LogTimes: ++log_times
                    });
                    last_process = j; //将最后被执行的进程号设置为j
                    break; //跳出for j循环(while循环)，即已找到第m个可以完成的进程
                } else {
                    continue;
                }
            } else {
                continue;
            }
        } while (j != last_process); //若j再次等于last_process，则意为寻找完成一圈，没有可执行的进程，则跳出循环
        if (secured_sequence[m] == -1) //如果安全序列成功找到，那么安全序列的最后一个值就会是最后完成的进程号。反之，若为-1，则代表未找到
        {
            running_log.push({
                Work: work.slice(),
                Allo: allo.slice(),
                Ned: ned.slice(),
                SecuredSequence: secured_sequence.slice(),
                Finish: finish.slice(),
                RequestHighlightLine: "",
                RequestHighlightColumn: "",
                WorkHighlightLine: "",
                WorkHighlightColumn: "",
                AlloHighlightLine: "",
                AlloHighlightColumn: "",
                NedHighlightLine: "",
                NedHighlightColumn: "",
                IsError: true,
                PromptMessage: "当前所有未完成进程所需资源均无法被满足，无法找到安全序列。本次请求不安全",
                LogTimes: ++log_times
            });
            return running_log; //无法找到安全序列，返回false
        }
    }
    running_log.push({
        Work: work.slice(),
        Allo: allo.slice(),
        Ned: ned.slice(),
        SecuredSequence: secured_sequence.slice(),
        Finish: finish.slice(),
        RequestHighlightLine: "",
        RequestHighlightColumn: "",
        WorkHighlightLine: "",
        WorkHighlightColumn: "",
        AlloHighlightLine: '',
        AlloHighlightColumn: "",
        NedHighlightLine: "",
        NedHighlightColumn: "",
        IsError: false,
        PromptMessage: "找到安全序列：" + secured_sequence.toString() + " 本次请求安全。",
        LogTimes: ++log_times
    });
    return running_log; //找到安全序列，返回true；安全序列储存在secured_sequence中
}







