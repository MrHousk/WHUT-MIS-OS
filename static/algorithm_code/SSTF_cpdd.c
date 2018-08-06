#include<stdio.h>
#include<malloc.h>
#include<stdlib.h>
#include<math.h>

void SSTF(int *input, int list_size, int initial_position);
int SortInput(int *input, int *sort_list, int list_size);
void copyIntPointer(int *a, int *b, int size);

int main()
{
    int initial_position = 100;
    int input[9] = {55, 58, 39, 18, 90, 160, 150, 38, 184};
    SSTF(input, sizeof(input) / sizeof(input[0]), initial_position);
    return 0;
}

//------------------------------//
//int *input; 输入待访问的队列
//int list_size; 输入队列的长度
//int initial_position; 磁头初始位置
//------------------------------//
void SSTF(int *input, int list_size, int initial_position)
{
    int i, j, k;
    int position = initial_position;
    int total_moving = 0;
    int *sort_list = (int *)calloc(sizeof(int), list_size); //对输入序列排序的结果
    int *sort_list_cp = (int *)calloc(sizeof(int), list_size); //对输入序列排序的结果
    SortInput(input, sort_list, list_size);
    copyIntPointer(sort_list, sort_list_cp, list_size);
    printf("磁盘磁头初始位置为: %3d, 向磁盘号增加方向移动则移动距离为正，反之为负\n", initial_position);
    for (i=0; i<list_size; i++)
    {
        j = 0;
        for (j=0; sort_list_cp[j]!=-1; j++)
        {
            if (sort_list_cp[j] >= position)
            {
                if (j >= 1)
                {
                    if (abs(sort_list_cp[j] - position) <= abs(sort_list_cp[j-1] - position))
                    {
                        printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i+1, sort_list_cp[j], sort_list_cp[j]-position);
                        total_moving += abs(sort_list_cp[j]-position);
                        position = sort_list_cp[j];
                        for (k=j+1; k<list_size; k++)
                        {
                            sort_list_cp[k-1] = sort_list_cp[k];
                        }
                        sort_list_cp[list_size-1] = -1;
                        break;
                    }
                    else
                    {
                        printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i+1, sort_list_cp[j-1], sort_list_cp[j-1]-position);
                        total_moving += abs(sort_list_cp[j-1]-position);
                        position = sort_list_cp[j-1];
                        for (k=j; k<list_size; k++)
                        {
                            sort_list_cp[k-1] = sort_list_cp[k];
                        }
                        sort_list_cp[list_size-1] = -1;
                        break;
                    }
                }
                else
                {
                    printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i+1, sort_list_cp[j], sort_list_cp[j]-position);
                    total_moving += abs(sort_list_cp[j]-position);
                    position = sort_list_cp[j];
                    for (k=j+1; k<list_size; k++)
                    {
                        sort_list_cp[k-1] = sort_list_cp[k];
                    }
                    sort_list_cp[list_size-1] = -1;
                    break;
                }
            }
            else if ((sort_list_cp[j+1] == -1) || (j+1) == list_size)
            {
                printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i+1, sort_list_cp[j], sort_list_cp[j]-position);
                total_moving += abs(sort_list_cp[j]-position);
                for (k=j+1; k<list_size; k++)
                {
                    sort_list_cp[k-1] = sort_list_cp[k];
                }
                sort_list_cp[list_size-1] = -1;
                break;
            }
        }
    }
    printf("平均寻道长度: %3f\n", (float)total_moving/list_size);
}

//------------------------------//
//int *input; 输入待访问的队列
//int *sort_list; 输入的排序后的结果
//int list_size; 队列长度
//------------------------------//
int SortInput(int *input, int *sort_list, int list_size)
{
    int i, j;
    int temp1, temp2;
    for (i=0; i<list_size; i++)
    {
        sort_list[i] = input[i];
    }
    for (i=0; i<list_size; i++) //选择法排序
    {
        temp1 = i;
        for (j=i; j<list_size; j++)
        {
            if (sort_list[j] < sort_list[temp1])
            {
                temp1 = j;
            }
        }
        temp2 = sort_list[i];
        sort_list[i] = sort_list[temp1];
        sort_list[temp1] = temp2;
    }
    printf("Sort list: ");
    for (i=0; i<list_size; i++)
    {
        printf("%d ", sort_list[i]);
    }
    printf("\n");
}

void copyIntPointer(int *a, int *b, int size)
{
	int i;
	for (i = 0; i<size; i++)
	{
		b[i] = a[i];
	}
}
