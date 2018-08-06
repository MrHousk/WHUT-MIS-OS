#define _CRT_SECURE_NO_WARNINGS //去掉vs安全检查
#include<stdio.h>
#include<stdlib.h>
#include<limits.h>
#include<string.h>
#include<time.h>
#include<stdbool.h>

struct data//结构体，存储每个任务的相关信息
{
	float startTime;
	float finishTime;
	float turnOverTime;
	float weightedTurnOverTime;
	float responseRatio;
};

//------------------------------//
// 此代码运行环境 Visual Studio 2017
// "#define _CRT_SECURE_NO_WARNINGS" 去掉VS安全检查
// 为了简化输入逻辑，此代码默认进行加密操作
// key为正字母向后移动，key为负向前移动，key值正负交替，即可模拟加密与解密过程
// 请不要输入中文字符
//------------------------------//

// 结构体，存储每一个结构的相关信息
struct  fcfsdata
{
	struct data* formatResult;
	float averageTurnOverTime;
	float averageweightedTurnOverTime;
	//int operateTashNum;
};

int fillTable(int clickFrequency, int task_num, float* commit_time, float* task_time, struct  fcfsdata* fcfsObject, int* operator_order, int* operate_order_temp);
int main()
{
	int task_num = 10, task_time_max = 10;
	int i = 0, j = 0, t = 0, fill = 0, response_num = 0;
	float* task_time = (float*)malloc(sizeof(float)*task_num);//随机分配每个作业运行需要的时间
	float* commit_time = (float*)malloc(sizeof(float)*task_num);//提交时间
	int* operator_order = (int*)malloc(sizeof(float)*task_num);//结果
	int* operate_order_temp = (int*)malloc(sizeof(int)*task_num);
	struct data* Objects = (struct data*)malloc(sizeof(struct data)*task_num);
	struct  fcfsdata* fcfsObject = (struct  fcfsdata*)malloc(sizeof(struct  fcfsdata));
	fcfsObject->formatResult = Objects;
	srand(time(NULL));
	for (i = 0; i < task_num; i++)
	{
		task_time[i] = rand() % task_time_max * 2 + 2;
		commit_time[i] = rand() % task_time_max * 5 + 2;
	}

	for (i = 0; i < task_num+1; i++)
	{
		response_num = fillTable(i, task_num, commit_time, task_time, fcfsObject, operator_order,operate_order_temp);
		printf_s("作业\t提交时间\t运行时间\t开始时间\t完成时间\t周转时间\t带权周转时间\t响应比\n");
		for (j = 0; j < task_num; j++)
		{
			printf("%d  \t%.2f  \t\t%.2f  \t\t", j, commit_time[j], task_time[j]);
			for (fill = 0; fill < i; fill++)
			{
				if (j == operator_order[fill])
				{
					printf_s("%.2f \t\t%.2f\t\t %.2f\t\t %.2f\t\t%.2f", fcfsObject->formatResult[operator_order[fill]].startTime, fcfsObject->formatResult[operator_order[fill]].finishTime, fcfsObject->formatResult[operator_order[fill]].turnOverTime, fcfsObject->formatResult[operator_order[fill]].weightedTurnOverTime, fcfsObject->formatResult[operator_order[fill]].responseRatio);
					break;
				}
			}
			if (fill == i&&fill!=0&&i!=1)
			{
				for (t = 0; t < response_num; t++)
				{
					if (j == operate_order_temp[t])
					{
						printf_s("\t\t\t\t\t\t\t\t%.2f",fcfsObject->formatResult[j].responseRatio);
						break;
					}
						
				}
			}
			printf_s("\n");
		}
	}
	printf("平均周转时间:%.2f\n", fcfsObject->averageTurnOverTime);
	printf("平均带权周转时间:%.2f\n", fcfsObject->averageweightedTurnOverTime);
	system("pause");
}
//------------------------------//
// int clickFrequency: 调用的次数
// int task：每次执行的任务调度编号
// float* commit_time：作业的提交时间
// float* task_time：作业需要的运行时间
// struct  fcfsdata* fcfsObject：结构体，存储每个任务的相关信息
// int* operator_order：作业的运行顺序
// int* operate_order_temp:对作业按照时间顺序排序
//------------------------------//
int fillTable(int clickFrequency, int task_num, float* commit_time, float* task_time, struct  fcfsdata* fcfsObject,int* operator_order, int* operate_order_temp)
{
	int i = 0, j = 0, k = 0, pos = 0, max_range = 0, flag = 0;
	float  temp = 0,total_operate_time = 0, time_one = 0, time_two = 0, max = 0;
	float* temp_commit_time = (float*)malloc(sizeof(float)*task_num);
	float* response_ratio = (float*)malloc(sizeof(float)*task_num);
	float* response_ratio_to_fill = (float*)malloc(sizeof(float)*task_num);
	int* need_operate = (int*)malloc(sizeof(int)*task_num);

	if (clickFrequency == 0)
	{
		for (i = 0; i < task_num; i++)
		{
			fcfsObject->formatResult[i].finishTime = -1;
			fcfsObject->formatResult[i].startTime = -1;
			fcfsObject->formatResult[i].turnOverTime = -1;
			fcfsObject->formatResult[i].weightedTurnOverTime = -1;
			fcfsObject->formatResult[i].responseRatio = -1;
		}
		free(temp_commit_time);
		free(need_operate);
		free(response_ratio);
		free(response_ratio_to_fill);
		return 0;
	}
	else
	{	
		for (i = 0; i < task_num; i++)
		{
			temp_commit_time[i] = commit_time[i];
			operate_order_temp[i] = 0;
			operator_order[i] = 0;
			need_operate[i] = 0;
			response_ratio[i] = 0;
			response_ratio_to_fill[i] = 0;
		}
		for (i = 0; i < task_num; i++)
		{
			temp = (float)INT_MAX;
			for (j = 0; j < task_num; j++)
			{
				if (temp > temp_commit_time[j])
				{
					temp = temp_commit_time[j];
					pos = j;
				}
			}
			temp_commit_time[pos] = (float)INT_MAX;
			operate_order_temp[i] = pos;
		}
		operator_order[0] = operate_order_temp[0];
		for (i = 1; i < task_num; i++)
		{
			time_one = total_operate_time + task_time[operator_order[i - 1]];
			time_two = commit_time[operator_order[i - 1]] + task_time[operator_order[i - 1]];
			total_operate_time = time_one < time_two ? time_two : time_one;
			max_range = 0;
			for (j = 0; j < task_num; j++)
			{
				if (commit_time[operate_order_temp[j]] <= total_operate_time)
					max_range++;
				else
				{
					break;
				}
			}
			for (j = 0; j < max_range; j++)
			{
				if (need_operate[j] == -1)
					continue;
				else
					response_ratio[j] = 1 + total_operate_time - commit_time[operate_order_temp[j]] / task_time[operate_order_temp[j]];
			}
			max = (float)INT_MIN;
			for (j = 1; j < max_range; j++)
			{
				if (need_operate[j] == -1)
					continue;
				if (max < response_ratio[j])
				{
					max = response_ratio[j];
					pos = j;
					flag = 1;
				}
			}
			if (flag == 0)
			{
				operator_order[i] = operate_order_temp[max_range];
				need_operate[max_range] = -1;
				total_operate_time = commit_time[operator_order[i]];

				response_ratio[max_range] = 1;
				fcfsObject->formatResult[operator_order[i]].responseRatio = 1;
			}
			else
			{
				operator_order[i] = operate_order_temp[pos];
				need_operate[pos] = -1;
			}
			flag = 0;
			if (i + 1 == clickFrequency)
			{
				for (j = 0; j<max_range; j++)
				{
					response_ratio_to_fill[j] = response_ratio[j];
				}
				temp = (float)max_range;
			}
		}
		if (clickFrequency == 1)
		{
			fcfsObject->formatResult[operator_order[0]].startTime = commit_time[operator_order[0]];
			fcfsObject->formatResult[operator_order[0]].finishTime = commit_time[operator_order[0]] + task_time[operator_order[0]];
			fcfsObject->formatResult[operator_order[0]].turnOverTime = task_time[operator_order[0]];
			fcfsObject->formatResult[operator_order[0]].weightedTurnOverTime = fcfsObject->formatResult[operator_order[0]].turnOverTime / task_time[operator_order[0]];
			fcfsObject->formatResult[operator_order[0]].responseRatio = 1;
			return;
		}
		else
		{
			k = clickFrequency <= task_num ? clickFrequency : task_num;
			fcfsObject->formatResult[operator_order[k - 1]].startTime = fcfsObject->formatResult[operator_order[k - 2]].finishTime;
			if (fcfsObject->formatResult[operator_order[k - 1]].startTime < commit_time[operator_order[k - 1]])
			{
				fcfsObject->formatResult[operator_order[k - 1]].startTime = commit_time[operator_order[k - 1]];
			}
			fcfsObject->formatResult[operator_order[k - 1]].finishTime = fcfsObject->formatResult[operator_order[k - 1]].startTime + task_time[operator_order[k - 1]];
			fcfsObject->formatResult[operator_order[k - 1]].turnOverTime = fcfsObject->formatResult[operator_order[k - 1]].finishTime - commit_time[operator_order[k - 1]];
			fcfsObject->formatResult[operator_order[k - 1]].weightedTurnOverTime = fcfsObject->formatResult[operator_order[k - 1]].turnOverTime / task_time[operator_order[k - 1]];
			for (i = 1; i < (int)temp; i++)
			{
				fcfsObject->formatResult[operate_order_temp[i]].responseRatio = response_ratio_to_fill[i];
			}
		}
				
		if (clickFrequency == task_num)
		{
			fcfsObject->averageTurnOverTime = 0;
			fcfsObject->averageweightedTurnOverTime = 0;
			for (i = 0; i < task_num; i++)
			{
				fcfsObject->averageTurnOverTime += fcfsObject->formatResult[i].turnOverTime;
				fcfsObject->averageweightedTurnOverTime += fcfsObject->formatResult[i].weightedTurnOverTime;
			}
			fcfsObject->averageTurnOverTime = fcfsObject->averageTurnOverTime / task_num;
			fcfsObject->averageweightedTurnOverTime = fcfsObject->averageweightedTurnOverTime / task_num;
		}
	}

	free(temp_commit_time);
	free(need_operate);
	free(response_ratio);
	free(response_ratio_to_fill);
	return (int)temp;
}