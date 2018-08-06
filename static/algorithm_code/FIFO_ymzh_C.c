#include<stdio.h>
#include<malloc.h>
#include<stdlib.h>

void FIFO_PageReplacement(int *resource, int length, int page_num);

int main()
{
	int length = 3;//内存页面最大长度
	int *resource = (int *)calloc(sizeof(int), length + 3);//分配空间,0号位为标识符，1号位为此次替换的位置，2号位为下一次替换的位置
	int i = 0;

	for (i = 0; i < length + 3; i++)
	{
		resource[i] = -1;//初始化为-1，表示空
	}
	resource[2] = 3;//下一次替换的位置初始化为3:

	//------------------测试----------------------
	int list[25] = { 7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1 };
	int j = 0;
	for (i = 0; i < 20; i++)
	{
		FIFO_PageReplacement(resource, length, list[i]);

		for (j = 0; j < length + 3; j++)
			printf_s("%d ", resource[j]);
		printf_s("\n");
	}

	system("pause");
}

//------------------------------//
//int *resource; 当前内存中的页面号序列，初始为空
//int length; 内存能容纳的最大长度
//int page_num; 请求的页面序号
//------------------------------//
void FIFO_PageReplacement(int *resource,int length,int page_num)
{
	int i = 0;
	for (i = 3; i < length + 3; i++)//判断请求的页面在已分配的页面中是否已经存在，若存在，则直接返回
	{
		if (resource[i] == page_num)
		{
			resource[0] = 0;//如果请求的页面在内存中，则不需要添加新的页面
			resource[1] = i;//请求的页面在编号为i的位置
			return;
		}
	}

	//执行到这里表示请求的页面没有在已分配的页面中，则从前往后依次替换一个页面，把请求的页面放到替换的位置
	resource[1] = (resource[2] - 3) % length + 3;
	resource[resource[1]] = page_num;
	resource[2] += 1;
	resource[0] = 1; //1表示需要添加新的进程

	return 0;
}
