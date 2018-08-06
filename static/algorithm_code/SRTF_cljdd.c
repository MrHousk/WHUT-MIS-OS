#include<stdio.h>
#include<malloc.h>
#include<stdlib.h>

struct work
{
    int commit_time; //作业提交时间
    int run_time; //作业运行所需时间
    int remain_time; //作业当前剩余时间（完成作业仍需要的时间）
    int start_time; //作业运行开始时间（第一次开始）
    int finish_time; //作业完成时间（该作业完成）
    float turnaround_time; //周转时间
    float weighted_turnover_time; //带权周转时间
}; //每个结构体是一项作业（一条进程）

void SRTF(struct work *wk, int work_num, float *average_turnaround_time, float *average_weighted_turnover_time);

int main()
{
    int i;
    int work_num = 4; //作业数量设置为4个（可变）
    struct work *wk = (struct work *)calloc(sizeof(struct work), work_num);
    float average_turnaround_time; //平均周转时间
    float average_weighted_turnover_time; //平均带权周转时间
    /*****测试开始*****/
    srand((unsigned)time(NULL)); //初始化随机种子
    printf("-----INIT-----\n");
    for (i=0; i<work_num; i++)
    {
        wk[i].commit_time = rand() % 10;
        wk[i].run_time = (rand() % 7) + 1;
        wk[i].remain_time = wk[i].run_time;
        wk[i].start_time = -1;
        wk[i].finish_time = -1;
        wk[i].turnaround_time = -1;
        wk[i].weighted_turnover_time = -1;
    }
    wk[0].commit_time = 0; //设置第一个任务的提交时间为第0秒
    for (i=0; i<work_num; i++)
    {
        printf("work_id: %d, ", i+1);
        printf("commit_time: %d, ", wk[i].commit_time);
        printf("run_time: %d, ", wk[i].run_time);
        printf("remain_time: %d, ", wk[i].remain_time);
        printf("start_time: %d, ", wk[i].start_time);
        printf("finish_time: %d\n", wk[i].finish_time);
    }
    printf("-----START-----\n");
    SRTF(wk, work_num, &average_turnaround_time, &average_weighted_turnover_time);
    printf("-----FINISH-----\n");
    for (i=0; i<work_num; i++)
    {
        printf("work_id: %d, ", i+1);
        printf("commit_time: %d, ", wk[i].commit_time);
        printf("run_time: %d, ", wk[i].run_time);
        printf("remain_time: %d, ", wk[i].remain_time);
        printf("start_time: %d, ", wk[i].start_time);
        printf("finish_time: %d", wk[i].finish_time);
        printf("turnaround_time: %.1f", wk[i].turnaround_time);
        printf("weighted_turnover_time: %.1f\n", wk[i].weighted_turnover_time);
    }
    printf("-----average_turnaround_time: %f\n", average_turnaround_time);
    printf("-----average_weighted_turnover_time: %f\n", average_weighted_turnover_time);
    /*****测试完成*****/
    return 0;
}

//------------------------------//
//struct work *wk; 进程描述（结构体）
//int work_num; 进程数量
// float *average_turnaround_time; 平均带权周转时间（指针）
// float *average_weighted_turnover_time; 平均带权周转时间（指针）
//------------------------------//
void SRTF(struct work *wk, int work_num, float *average_turnaround_time, float *average_weighted_turnover_time)
{
    int i, j;
    int flag = 0; //flag为0意为作业未全部完成，而当所有wk的finish_time全不为-1时，则将flag置为1，SRTF算法结束
    int temp[2]; //临时变量，用于存储当前剩余时间最短的作业的作业号和时间
    float temp_2, temp_3; //用于给周转时间和带权周转时间求和
    for (i=0; flag==0; i++) //每次循环模拟系统运行的一秒
    {
        temp[0] = -1; //每个“新的一秒”，将temp作业号初始化为-1（不存在的作业号）
        temp[1] = 10000; //每个“新的一秒”，将temp的剩余时间初始化为10000（一个极大值）

        for (j=0; j<work_num; j++) //选择这一秒运行的作业（寻找剩余时间最短的作业执行）
        {
            if ((wk[j].remain_time) && (i >= wk[j].commit_time)) //如果wk[j].remain_time不为0，则说明j作业仍未完成。同时要保证当前系统时间i>=作业提交时间
            {
                if (wk[j].remain_time < temp[1]) //选取目前遇到的最小的剩余时间的作业作为temp，当j循环全部结束，temp中保存的就是最小剩余时间的作业的信息
                {
                    temp[0] = j;
                    temp[1] = wk[j].remain_time;
                }
            }
        }

        if (temp[0] != -1)
        {
            wk[temp[0]].remain_time--; //该作业剩余时间减1
            if (wk[temp[0]].start_time == -1)
                wk[temp[0]].start_time = i; //如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间
            if (wk[temp[0]].remain_time == 0)
                wk[temp[0]].finish_time = i+1; //如果该作业运行完这一秒后剩余时间为0，则将下一秒设为该作业的结束时间
            printf("present_time: %d, running_id: %d\n", i+1, temp[0]+1);
        }

        flag = 1; //先假设全部作业均运行完成
        for (j=0; j<work_num; j++) //循环全部作业，确认是否全部运行完成（找出是否有作业仍未完成）
        {
            if (wk[j].finish_time == -1)
            {
                flag = 0;
                break;
            }
        }
        if (flag == 1)
        {
            temp_2 = 0;
            temp_3 = 0;
            for (j=0; j<work_num; j++) //计算平均周转时间和平均带权周转时间
            {
                wk[j].turnaround_time = wk[j].finish_time - wk[j].commit_time;
                wk[j].weighted_turnover_time = wk[j].turnaround_time / wk[j].run_time;
                temp_2 += wk[j].turnaround_time;
                temp_3 += wk[j].weighted_turnover_time;
            }
            *average_turnaround_time = (temp_2/work_num);
            *average_weighted_turnover_time = (temp_3/work_num);
        }
    }
}
