#include <stdio.h>
#include <malloc.h>
#include <stdlib.h>
#include <math.h>

void CSCAN(int *input, int list_size, int initial_position, int initial_direction);
int SortInput(int *input, int *sort_list, int list_size);
void copyIntPointer(int *a, int *b, int size);

int main()
{
    int initial_position = 100;
    int initial_direction = 1;
    int input[9] = {55, 58, 39, 18, 90, 160, 150, 38, 184};
    CSCAN(input, sizeof(input) / sizeof(input[0]), initial_position, initial_direction);
    return 0;
}
//------------------------------//
//int *input; 输入数据，需要访问的磁盘号
//int list_size; 输入数据的长度
//int initial_position; 磁头初始位置
//int initial_direction; 磁头初始移动方向
//------------------------------//
void CSCAN(int *input, int list_size, int initial_position, int initial_direction)
{
    int i, j, k;
    int position = initial_position; //磁头初始位置
    int total_moving = 0; //总移动距离
    int *sort_list = (int *)calloc(sizeof(int), list_size);
    int *sort_list_cp = (int *)calloc(sizeof(int), list_size);
    SortInput(input, sort_list, list_size);
    copyIntPointer(sort_list, sort_list_cp, list_size);
    printf("磁盘磁头初始位置为: %3d, 向磁盘号增加方向移动则移动距离为正，反之为负\n", initial_position);
    for (i = 0; i < list_size; i++)
    {
        j = 0;
        for (j = 0; sort_list_cp[j] != -1; j++)
        {
            if (sort_list_cp[j] >= position)
            {
                if (j >= 1)
                {
                    //position在sort_list_cp[j]和sort_list_cp[j-1]之间，可能等于sort_list_cp[j]
                    if ((initial_direction == 1) || (sort_list_cp[j] == position))
                    {
                        //向数字增加方向扫描或（向数字减小方向扫描但sort_list_cp[j]等于position的情况）
                        printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i + 1, sort_list_cp[j], sort_list_cp[j] - position);
                        total_moving += abs(sort_list_cp[j] - position);
                        position = sort_list_cp[j];
                        for (k = j + 1; k < list_size; k++)
                        {
                            sort_list_cp[k - 1] = sort_list_cp[k];
                        }
                        sort_list_cp[list_size - 1] = -1;
                        break;
                    }
                    else
                    {
                        //向数字增加方向扫描且sort_list_cp[j]不等于position的情况
                        printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i + 1, sort_list_cp[j - 1], sort_list_cp[j - 1] - position);
                        total_moving += abs(sort_list_cp[j - 1] - position);
                        position = sort_list_cp[j - 1];
                        for (k = j; k < list_size; k++)
                        {
                            sort_list_cp[k - 1] = sort_list_cp[k];
                        }
                        sort_list_cp[list_size - 1] = -1;
                        break;
                    }
                }
                else
                {
                    //sort_list_cp数组中第一项的值就大于position，即position小于sort_list_cp中的所有值
                    if (initial_direction == 0)
                    //如果initial_direction = 0，则position跳转至sort_list_cp末尾继续向前扫描
                    {
                        for (k = 0; k < list_size; k++)
                        {
                            if ((sort_list_cp[k + 1] == -1) || (k + 1) == list_size)
                                break;
                        }
                        printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i + 1, sort_list_cp[k], sort_list_cp[k] - position);
                        total_moving += abs(sort_list_cp[k] - position);
                        position = sort_list_cp[k];
                        sort_list_cp[k] = -1;
                        break;
                    }
                    else
                    {
                        printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i + 1, sort_list_cp[j], sort_list_cp[j] - position);
                        total_moving += abs(sort_list_cp[j] - position);
                        position = sort_list_cp[j];
                        for (k = j + 1; k < list_size; k++)
                        {
                            sort_list_cp[k - 1] = sort_list_cp[k];
                        }
                        sort_list_cp[list_size - 1] = -1;
                        break;
                    }
                }
            }
            else if ((sort_list_cp[j + 1] == -1) || (j + 1) == list_size)
            {
                //sort_list_cp数组中最后一项的值仍小于position，即position大于sort_list_cp中的所有值
                if (initial_direction == 1)
                //如果initial_direction = 1，则position跳转至sort_list_cp首部继续向后扫描
                {
                    printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i + 1, sort_list_cp[0], sort_list_cp[0] - position);
                    total_moving += abs(sort_list_cp[0] - position);
                    position = sort_list_cp[0];
                    for (k = 1; k < list_size; k++)
                    {
                        sort_list_cp[k - 1] = sort_list_cp[k];
                    }
                    sort_list_cp[list_size - 1] = -1;
                    break;
                }
                else
                {
                    printf("%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n", i + 1, sort_list_cp[j], sort_list_cp[j] - position);
                    total_moving += abs(sort_list_cp[j] - position);
                    position = sort_list_cp[j];
                    for (k = j + 1; k < list_size; k++)
                    {
                        sort_list_cp[k - 1] = sort_list_cp[k];
                    }
                    sort_list_cp[list_size - 1] = -1;
                    break;
                }
            }
        }
    }
    printf("平均寻道长度: %3f\n", (float)total_moving / list_size);
}

//对int型数组进行排序
int SortInput(int *input, int *sort_list, int list_size)
{
    int i, j;
    int temp1, temp2;
    for (i = 0; i < list_size; i++)
    {
        sort_list[i] = input[i];
    }
    for (i = 0; i < list_size; i++) //选择法排序
    {
        temp1 = i;
        for (j = i; j < list_size; j++)
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
    for (i = 0; i < list_size; i++)
    {
        printf("%d ", sort_list[i]);
    }
    printf("\n");
}

//拷贝两个指针（int型数组）
void copyIntPointer(int *a, int *b, int size)
{
    int i;
    for (i = 0; i < size; i++)
    {
        b[i] = a[i];
    }
}