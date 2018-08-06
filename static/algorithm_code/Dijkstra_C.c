#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <malloc.h>
#include <time.h>

//指针初始化，给指针分配对应的空间
void pointerInit(int **available, int **max, int **allocation, int **need, int **request, int **secured_sequence, int p_num, int r_num);

//随机分配数据值，获取available, max, allocation, need
void getRandomData(int *available, int *max, int *allocation, int *need, int *request, int *secured_sequence, int p_num, int r_num, int range_max);

//request请求合法性检查，检查此次申请的数量是否合法，即请求量是否超过系统剩余，以及本次分配之后，该进程占有资源量是否超出声明量，返回值为0时代表不合法
int requestInspect(int *available, int *max, int *allocation, int *need, int *request, int *secured_sequence, int p_num, int r_num);

//获得解决方案（安全序列），返回值为0时代表找不到安全序列，即不安全
int getSolution(int *available, int *max, int *allocation, int *need, int *request, int *secured_sequence, int p_num, int r_num);

//拷贝两个指定大小的int形指针的内容，第一个拷贝给第二个
void copyIntPointer(int *a, int *b, int size);

//释放全部指针
void freePointer();


int main()
{
	int i;

	int *available = NULL;//剩余资源向量
	int *max = NULL;//最大所需资源矩阵
	int *allocation = NULL;//已分配资源矩阵
	int *need = NULL;//剩余需求矩阵
	int *request = NULL;//新请求资源向量，最后一个值为request对应的进程号（从0开始）
	int *secured_sequence = NULL;//安全序列向量，全部初始化为-1
	int p_num = 4;//进程数量向量
	int r_num = 3;//资源种类向量
	int range_max = 9;//已分配资源上限（初始化用，设为15就行）

	pointerInit(&available, &max, &allocation, &need, &request, &secured_sequence, p_num, r_num);
	getRandomData(available, max, allocation, need, request, secured_sequence, p_num, r_num, range_max);

	//request[0] = 4;
	//request[1] = 3;
	//request[2] = 4;
	//request[3] = 1;

	if (!requestInspect(available, max, allocation, need, request, secured_sequence, p_num, r_num))
	{
		printf("request不符合要求\n");
		return 0;
	}
	if (getSolution(available, max, allocation, need, request, secured_sequence, p_num, r_num))
	{
		printf("找到安全序列：");
		for (i = 0; i<p_num - 1; i++)
		{
			printf(" %d -", secured_sequence[i]);
		}
		printf(" %d \n", secured_sequence[p_num - 1]);
	}
	else
	{
		printf("找不到安全序列：");
	}

	system("pause");

}

//------------------------------//
// 初始化全部指针
// int **available; 剩余资源向量
// int **max;//最大所需资源矩阵
// int **allocation;//已分配资源矩阵
// int **need;//剩余需求矩阵
// int **request//新请求资源向量
// int **secured_sequence;//安全序列向量
//------------------------------//
void pointerInit(int **available, int **max, int **allocation, int **need, int **request, int **secured_sequence, int p_num, int r_num)
{
	*available = (int *)calloc(r_num, sizeof(int));
	*max = (int *)calloc(r_num*p_num, sizeof(int));
	*allocation = (int *)calloc(r_num*p_num, sizeof(int));
	*need = (int *)calloc(r_num*p_num, sizeof(int));
	*request = (int *)calloc(r_num + 1, sizeof(int));
	*secured_sequence = (int *)calloc(p_num, sizeof(int));
}

//------------------------------//
// 生成随机数据
// int *available; 剩余资源向量
// int *max;//最大所需资源矩阵
// int *allocation;//已分配资源矩阵
// int *need;//剩余需求矩阵
// int *request//新请求资源向量
// int *secured_sequence;//安全序列向量
// int p_num; 进程数量向量
// int r_num; 资源种类向量
// int range_max; 已分配资源上限
//------------------------------//
void getRandomData(int *available, int *max, int *allocation, int *need, int *request, int *secured_sequence, int p_num, int r_num, int range_max)
{

	int *answer = (int*)calloc(sizeof(int),p_num);//首先生成随机答案序列
	int *temp_answer = (int*)calloc(sizeof(int),p_num);//答案序列临时变量
	int *upper_limit = (int*)calloc(sizeof(int), r_num);//need分配矩阵上界
	int *lower_limit = (int*)calloc(sizeof(int), r_num);//need分配矩阵下限
	int max_pos = p_num, seed = 0;//初始化随机种子，初始化最大寻址位置
	int need_random = 0;//确定需要随机分配的在lower_limit和upper_limit之间数的个数
	int i = 0, j = 0, temp = 0;//temp来存储随机数

	//---第一个模块，首先随机生成答案,即：生成[0~r_num]的不同的随机数-------------------
	srand(time(NULL));//重置时间种子
	for (i = 0; i < p_num; i++)//从0开始初始化答案序列数组
	{
		temp_answer[i] = i;
	}
	//生成随机答案序列
	for (i = 0; i < p_num; i++)
	{
		temp = rand() % max_pos;
		max_pos--;
		answer[i] = temp_answer[temp];
		
		for (j = temp; j < max_pos; j++)
		{
			temp_answer[j] = temp_answer[j + 1];
		}
	}
	seed = clock()*clock()*clock()*clock()*time(NULL);//初始分配allocation数值
	for (i = 0; i < p_num*r_num; i++)
	{
		allocation[i] = rand() % range_max + 1;//生成范围在[0,range_max]范围的数值
	}

	//--第二部分，产生表示已分配资源的随机数----
	for (i = 0; i < r_num; i++)
	{
		need[answer[0] * r_num + i] = rand() % range_max + 1;//为答案的第一个进程分配它已经分配的资源，至少一个
		//-↓-可以满足该进程，是因为该进程的资源所需小于upper_limit矩阵,“2”表示希望差距最小是2，必须有
		upper_limit[i] = need[answer[0] * r_num + i] + rand() % (range_max / 3) + 3;
		available[i] = upper_limit[i];//系统所剩总资源
	}

	for (i = 1; i < p_num; i++)
	{
		for (j = 0; j < r_num; j++)
			lower_limit[j] = upper_limit[j];
		for (j = 0; j < r_num; j++)
			upper_limit[j] += allocation[(answer[i-1] * r_num + j)];
		//选择(r_num / 3 + 1)个数，使得这些数在[lower_limit,upper_limint]之间
		need_random = (r_num / 3 + 1);
		for (j = 0; j < need_random; j++)
		{
			temp = rand() % r_num;
			need[answer[i] * r_num + temp] = rand() % (upper_limit[temp] - lower_limit[temp]) + lower_limit[temp] + 1;	
		}
		for (j = 0; j <r_num; j++)
		{
			if (need[(answer[i] * r_num + j)] == 0)
			//如果这个地方还没有被赋过值，则赋值,need矩阵初始值一定要为0
			{
				need[(answer[i] * r_num + j)] = rand() % upper_limit[j] + 1;
			}
				
		}
	}
	for (i = 0; i < r_num*p_num; i++)
	{
		max[i] = need[i] + allocation[i];
	}

	//-----------------测试输出随机答案------------------------
	printf("max:");
	for (i = 0; i < p_num*r_num; i++)
	{
		printf("%d ", max[i]);
	}

	printf("\nneed:");
	for (i = 0; i < p_num*r_num; i++)
	{
		printf("%d ", need[i]);
	}

	printf("\nallocation:");
	for (i = 0; i < p_num*r_num; i++)
	{
		printf("%d ", allocation[i]);
	}

	printf("\navailable:");
	for (i = 0; i < r_num; i++)
	{
		printf("%d ", available[i]);
	}
	printf("\n");

} 

//------------------------------//
// 安全检查
// int *available; 剩余资源向量
// int *max;//最大所需资源矩阵
// int *allocation;//已分配资源矩阵
// int *need;//剩余需求矩阵
// int *request//新请求资源向量
// int *secured_sequence;//安全序列向量
// int p_num; 进程数量向量
// int r_num; 资源种类向量
//------------------------------//
int requestInspect(int *available, int *max, int *allocation, int *need, int *request, int *secured_sequence, int p_num, int r_num)
{
	int i;
	for (i = 0; i<r_num; i++)
	{
		if ((allocation[request[r_num] * r_num + i] + request[i]) > max[request[r_num] * r_num + i])
		{
			printf("//所需资源加已分配资源超过声明最大值，返回false");
			system("pause");

			return 0;//所需资源加已分配资源超过声明最大值，返回false
		}
		if (request[i] > available[i])
		{
			printf("请求资源超过系统剩余，返回false");
			system("pause");


			return 0;//请求资源超过系统剩余，返回false
		}
	}
	return 1;//request请求符合基本检查要求，返回true
}

//------------------------------//
// 获得安全序列
// int *available; 剩余资源向量
// int *max;//最大所需资源矩阵
// int *allocation;//已分配资源矩阵
// int *need;//剩余需求矩阵
// int *request//新请求资源向量
// int *secured_sequence;//安全序列向量
// int p_num; 进程数量向量
// int r_num; 资源种类向量
//------------------------------//
int getSolution(int *available, int *max, int *allocation, int *need, int *request, int *secured_sequence, int p_num, int r_num)
{
	int i, j, m;//循环变量，无实际意义
	int flag;//标识符，标识对应线程是否能安全完成
	int last_process = p_num - 1; //最后被执行过的进程号（上一次被执行的进程）

	int *finish = (int *)calloc(p_num, sizeof(int));//进程完成指示向量，finish[x]的bool值代表第x个进程是否完成

	int *work = (int *)calloc(r_num, sizeof(int));//当前可用资源向量（实时变化，初始值等于available）
	int *allo = (int *)calloc(p_num*r_num, sizeof(int));//当前各进程占用资源矩阵（实时变化，初始值等于allocation）
	int *ned = (int *)calloc(p_num*r_num, sizeof(int));//当前各进程需求资源矩阵（实时变化，初始值等于need）

	for (j = 0; j<p_num; j++)//开始寻找安全序列前，将安全序列置为-1
	{
		secured_sequence[j] = -1;
	}

	copyIntPointer(available, work, r_num);//设置word初始值
	copyIntPointer(allocation, allo, p_num*r_num);//设置allo初始值
	copyIntPointer(need, ned, p_num*r_num);//设置ned初始值

	for (i = 0; i<r_num; i++)//预分配，计算这次资源请求后，系统资源情况
	{
		work[i] = work[i] - request[i];
		allo[request[r_num] * r_num + i] = allo[request[r_num] * r_num + i] + request[i];
		ned[request[r_num] * r_num + i] = ned[request[r_num] * r_num + i] - request[i];
	}
	//开始寻找安全序列
	j = -1;
	//初始值设为-1，进入do while循环后先+1，即从第0条进程开始寻找
	for (m = 0; m<p_num; m++)
	//循环p_num次，每次循环寻找一条可以安全完成的进程
	{
		do
		//中层循环，从上一次成功执行的进程开始向后寻找可以被执行的进程，若可以完成，则插入安全序列并释放资源
		{
			j += 1; //比较查询的进程号+1
            if (j == p_num)
            {
                j = 0; //当j(寻找的进程号)超过范围时，重置为0
            }
			flag = 1;//先假设这条进程能够安全完成
			if (finish[j] == 0)
			{
				for (i = 0; i<r_num; i++)
				//循环r_num次，判断每一种资源是否够第j个线程的需求
				{
					if (ned[j*r_num + i] > work[i])
					{
						flag = 0;//这条线程所需的资源超过了现有资源（work），不能安全完成
						break;
					}
				}
				if (flag == 1)
				//经过了上面的for循环，flag仍为1，则意味着这条线程所需的所有资源都在现有（work）范围内，则插入安全序列并释放资源
				{
					secured_sequence[m] = j;//插入安全序列
					for (i = 0; i<r_num; i++)//释放进程J所占有的资源
					{
						work[i] = work[i] + allo[j * r_num + i];
					}
					finish[j] = 1;//将第j条进程置为已完成
					last_process = j; //将最后被执行的进程号设置为j
					break;//跳出for j循环(while循环)，即已找到第m个可以完成的进程
				}
				else
				{
					continue;
				}
			}
			else
			{
				continue;
			}
		} while (j != last_process); //若j再次等于last_process，则意为寻找完成一圈，没有可执行的进程，则跳出循环
		if (secured_sequence[m] == -1)
		//如果安全序列成功找到，那么安全序列的最后一个值就会是最后完成的进程号。反之，若为-1，则代表未找到
		{
			return 0;//无法找到安全序列，返回false
		}
	}
	return 1;//找到安全序列，返回true；安全序列储存在secured_sequence中
}

//------------------------------//
// 拷贝两个int型指针内容
// int *a; 原指针
// int *b; 待赋值的指针
// int size; 指针数组大小
//------------------------------//
void copyIntPointer(int *a, int *b, int size)
{
	int i;
	for (i = 0; i<size; i++)
	{
		b[i] = a[i];
	}
}

void freePointer()
{
	// 释放指针，请同学们自行完善补充
	printf("--------------------");
}
