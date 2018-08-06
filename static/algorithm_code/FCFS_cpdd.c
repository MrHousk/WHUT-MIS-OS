#include<stdio.h>
#include<malloc.h>
#include<stdlib.h>
#include<math.h>

void FCFS(int *input, int list_size, int initial_position);
int SortInput(int *input, int *sort_list, int list_size);

int main()
{
    int initial_position = 100;
    int input[9] = {55, 58, 39, 18, 90, 160, 150, 38, 184};
    FCFS(input, sizeof(input) / sizeof(input[0]), initial_position);
    return 0;
}

//------------------------------//
//int *input; 输入数据，需要访问的磁盘号
//int list_size; 输入数据的长度
//int initial_position; 磁头初始位置
//------------------------------//
void FCFS(int *input, int list_size, int initial_position)
{
    int i;
    int position = initial_position;
    int total_moving = 0;
    int *sort_list = (int *)calloc(sizeof(int), list_size);
    SortInput(input, sort_list, list_size);
    printf("磁盘磁头初始位置为: %3d, 向磁盘号增加方向移动则移动距离为正，反之为负\n", initial_position);
    for (i=0; i<list_size; i++)
    {
        printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i+1, input[i], input[i]-position);
        total_moving += abs(input[i]-position);
        position = input[i];
    }
    printf("平均寻道长度: %3f\n", (float)total_moving/list_size);
}

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
