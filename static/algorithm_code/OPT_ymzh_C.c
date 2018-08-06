#include<stdio.h>
#include<malloc.h>
#include<stdlib.h>

void OPT(int *in_use, int inuse_length, int *page_list, int list_length); //OPT置换算法（框架）
int findIndex(int *in_use, int inuse_length, int *page_list, int list_length, int start); //OPT算法核心部分，即当内存区满时，找到被置换的页面

int main()
{
    int i, j;
    int *in_use = (int *)calloc(sizeof(int), inuse_length); //内存空间
    int inuse_length = 3; //内存页面最大长度
    int page_list[] = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1}; //来到的页面号列表（测试用）
    int list_length = sizeof(page_list)/sizeof(page_list[0]); //页面号列表长度

    for (i = 0; i < inuse_length; i++)
	{
		in_use[i] = -1;//初始化为-1，表示空
	}

    OPT(in_use, inuse_length, &page_list, list_length); //执行OPT置换算法

    return 0;
}
//------------------------------//
// int resource: 分配内存空间,存储资源的分配情况
// int times：下一次访问时，记录每个页面从载入到当前经过的单位时间个数
// int length：内存页面最大长度
// int page_num：page_num为请求的页面
//------------------------------//
void OPT(int *in_use, int inuse_length, int *page_list, int list_length)
{
    int i, j;
    int flag; //标识位，假如内存未满或内存中有当前新来到的页面，则flag置为1，不执行findIndex函数
    int replace_index; //被交换出内存的页面在内存中的位置
    for (i=0; i<list_length; i++)
    {
        printf("新页面: %d\n", page_list[i]);
        flag = 0;
        for (j=0; j<inuse_length; j++)
        {
            if (in_use[j] == page_list[i])
            {
                printf("页面片段%d在内存中，不需要置换\n", page_list[i]);
                flag = 1;
                break;
            }
            else if (in_use[j] == -1)
            {
                in_use[j] = page_list[i];
                printf("当前内存有空位，新页面%d被插入到%d号位\n", page_list[i], i+1);
                flag = 1;
                break;
            }
        }
        if (flag == 0) //缺页中断时寻找被替换的页面
        {
            replace_index = findIndex(in_use, inuse_length, page_list, list_length, i+1);
            printf("内存区满，根据OPT算法，新页面%d与%d号位的%d号页面交换\n", page_list[i], replace_index+1, in_use[replace_index]);
            in_use[replace_index] = page_list[i];
        }
        //打印每一轮插入页面后的结果
        printf("当前页面情况: ");
        for (j=0; j<inuse_length; j++)
        {
            printf("%d ", in_use[j]);
        }
        printf("\n");
    }

}

int findIndex(int *in_use, int inuse_length, int *page_list, int list_length, int start)
{
    int *compare = (int *)calloc(sizeof(int), inuse_length);
    int times = 0;//记录内存中页面号与list中页面号相等的次数
    int i, j;

    if (start >= list_length)
    {
        return 0; //假如来到的是最后一个页面，就任选一个内存位置替换
    }

    for (i=0; i<inuse_length; i++) //复制in_use到compare
    {
        compare[i] = in_use[i];
    }
    
    //从page_list[start]位置开始比对，如果比对相等次数等于2或者全部比对完成，则认为找到需要被替换的页面位置（最晚被使用的）
    for (i=start; (i<list_length) && (times < inuse_length-1); i++) 
    {
        for (j = 0; j<inuse_length; j++)
        {
            if (compare[j] == page_list[i])
            {
                compare[j] = -1; //标记为-1代表这个数字出现过在list中，换句话说，最后没有被标称-1的就是最晚出现在list中的页面号
                times++;
                break;
            }
        }
    }
    for (i=0; i<inuse_length; i++)
    {
        if (compare[i] != -1)
        {
            return i; //当找到不为-1的compare[i]时，i即为需要被置换的页面的内存中的位置(replace_index)
        }
    }
}
