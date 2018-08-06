#define _CRT_SECURE_NO_WARNINGS //去掉vs安全检查
#include<stdio.h>
#include<stdlib.h>
#include<limits.h>
#include<string.h>
#include<time.h>
#include<stdbool.h>

struct data//每一个对象所包含的元素
{
	float startTime;
	float finishTime;
	float turnOverTime;
	float weightedTurnOverTime;
};

struct  fcfsdata
{
	struct data* formatResult;
	float averageTurnOverTime;
	float averageweightedTurnOverTime;
	//int operateTashNum;
};
void fillTable(int clickFrequency, int task_num, float* commit_time, float* task_time, struct  fcfsdata* fcfsObject, int* operator_order);
int main()
{
	int task_num = 10, task_time_max = 10;
	int i = 0, j = 0, fill = 0;
	float* task_time = (float*)malloc(sizeof(float)*task_num);//随机分配每个作业运行需要的时间
	float* commit_time = (float*)malloc(sizeof(float)*task_num);//提交时间
	int* operator_order = (int*)malloc(sizeof(float)*task_num);//结果
	struct data* Objects = (struct data*)malloc(sizeof(struct data)*task_num);
	struct  fcfsdata* fcfsObject = (struct  fcfsdata*)malloc(sizeof(struct  fcfsdata));
	fcfsObject->formatResult = Objects;
	srand(time(NULL));
	for (i = 0; i < task_num; i++)
	{
		task_time[i] = rand() % task_time_max * 2 + 2;
		commit_time[i] = rand() % task_time_max + 2;
	}

	for (i = 0; i < task_num+1; i++)
	{
		fillTable(i, task_num, commit_time, task_time, fcfsObject, operator_order);
		printf_s("作业\t提交时间\t运行时间\t开始时间\t完成时间\t周转时间\t带权周转时间\n");
		for (j = 0; j < task_num; j++)
		{
			printf("%d  \t%.2f  \t\t%.2f  \t\t", j, commit_time[j], task_time[j]);
			fill = 0;
			for (fill = 0; fill < i; fill++)
			{
				if (j == operator_order[fill])
				{
					printf_s("%.2f \t\t%.2f\t\t %.2f\t\t %.2f\t\n", fcfsObject->formatResult[operator_order[fill]].startTime, fcfsObject->formatResult[operator_order[fill]].finishTime, fcfsObject->formatResult[operator_order[fill]].turnOverTime, fcfsObject->formatResult[operator_order[fill]].weightedTurnOverTime);
					break;
				}
			}
			if (fill == i)
				printf_s("\n");

		}
	}
	printf("平均周转时间:%.2f\n", fcfsObject->averageTurnOverTime);
	printf("平均带权周转时间:%.2f\n", fcfsObject->averageweightedTurnOverTime);
	system("pause");
}
void fillTable(int clickFrequency, int task_num, float* commit_time, float* task_time, struct  fcfsdata* fcfsObject,int* operator_order)
{
	int i = 0, j = 0, k = 0, pos = 0;
	float temp;
	float* temp_commit_time = (float*)malloc(sizeof(float)*task_num);
	
	struct data* format_result = (struct data*)malloc(sizeof(struct data)*task_num);

	if (clickFrequency == 0)
	{
		for (i = 0; i < task_num; i++)
		{
			fcfsObject->formatResult[i].finishTime = -1;
			fcfsObject->formatResult[i].startTime = -1;
			fcfsObject->formatResult[i].turnOverTime = -1;
			fcfsObject->formatResult[i].weightedTurnOverTime = -1;
		}
		return;
	}
	else
	{
		for (i = 0; i < task_num; i++)
		{
			format_result[i].finishTime = 0;
			format_result[i].startTime = 0;
			format_result[i].turnOverTime = 0;
			format_result[i].weightedTurnOverTime = 0;
		}
		for (i = 0; i < task_num; i++)
		{
			temp_commit_time[i] = commit_time[i];
			operator_order[i] = 0;
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
			operator_order[i] = pos;

		}
		if (clickFrequency == 1)
		{
			fcfsObject->formatResult[operator_order[0]].startTime = commit_time[operator_order[0]];
			fcfsObject->formatResult[operator_order[0]].finishTime = commit_time[operator_order[0]] + task_time[operator_order[0]];
			fcfsObject->formatResult[operator_order[0]].turnOverTime = task_time[operator_order[0]];
			fcfsObject->formatResult[operator_order[0]].weightedTurnOverTime = fcfsObject->formatResult[operator_order[0]].turnOverTime / task_time[operator_order[0]];
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
		free(temp_commit_time);
		free(format_result);
	}

	return;
}