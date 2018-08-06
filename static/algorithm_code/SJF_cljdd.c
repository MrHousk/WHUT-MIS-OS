#define _CRT_SECURE_NO_WARNINGS //ȥ��vs��ȫ���
#include<stdio.h>
#include<stdlib.h>
#include<limits.h>
#include<string.h>
#include<time.h>
#include<stdbool.h>

struct data//ÿһ��������������Ԫ��
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
	float* task_time = (float*)malloc(sizeof(float)*task_num);//�������ÿ����ҵ������Ҫ��ʱ��
	float* commit_time = (float*)malloc(sizeof(float)*task_num);//�ύʱ��
	int* operator_order = (int*)malloc(sizeof(float)*task_num);//���
	struct data* Objects = (struct data*)malloc(sizeof(struct data)*task_num);
	struct  fcfsdata* fcfsObject = (struct  fcfsdata*)malloc(sizeof(struct  fcfsdata));
	fcfsObject->formatResult = Objects;
	srand(time(NULL));
	for (i = 0; i < task_num; i++)
	{
		task_time[i] = rand() % task_time_max * 2 + 2;
		commit_time[i] = rand() % task_time_max + 2;
	}

	for (i = 0; i < task_num + 1; i++)
	{
		fillTable(i, task_num, commit_time, task_time, fcfsObject, operator_order);
		printf_s("��ҵ\t�ύʱ��\t����ʱ��\t��ʼʱ��\t���ʱ��\t��תʱ��\t��Ȩ��תʱ��\n");
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
	printf("ƽ����תʱ��:%.2f\n", fcfsObject->averageTurnOverTime);
	printf("ƽ����Ȩ��תʱ��:%.2f\n", fcfsObject->averageweightedTurnOverTime);
	system("pause");
}
void fillTable(int clickFrequency, int task_num, float* commit_time, float* task_time, struct  fcfsdata* fcfsObject, int* operator_order)
{
	int i = 0, j = 0, k = 0, pos = 0, max_range = 0, flag = 0;
	float temp = 0, total_operate_time = 0, time_one = 0, time_two = 0, min = 0;
	float* temp_commit_time = (float*)malloc(sizeof(float)*task_num);
	float* temp_task_time = (float*)malloc(sizeof(float)*task_num);
	int* operate_order_temp = (int*)malloc(sizeof(int)*task_num);
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
		if (clickFrequency == 1)
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
				temp_task_time[i] = task_time[i];
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
				min = (float)INT_MAX;
				for (j = 1; j < max_range; j++)
				{
					if (temp_task_time[operate_order_temp[j]] == -1)
						continue;
					if (min > temp_task_time[operate_order_temp[j]])
					{
						min = temp_task_time[operate_order_temp[j]];
						pos = j;
						flag = 1;
					}
				}
				if (flag == 0)
				{
					operator_order[i] = operate_order_temp[max_range];
					temp_task_time[operator_order[i]] = -1;
					total_operate_time = commit_time[operator_order[i]];
				}
				else
				{
					operator_order[i] = operate_order_temp[pos];
					temp_task_time[operator_order[i]] = -1;
				}
				flag = 0;
			}
			/*for (i = 0; i < task_num; i++)
			{
			printf_s("%2d ", operate_order_temp[i]);
			}
			printf_s("\n");
			for (i = 0; i < task_num; i++)
			{
			printf_s("%2d ", operator_order[i]);
			}
			printf_s("\n");*/
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
	}

	free(temp_commit_time);
	free(format_result);
	free(operate_order_temp);
	free(temp_task_time);
	return;
}