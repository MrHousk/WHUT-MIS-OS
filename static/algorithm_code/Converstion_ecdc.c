#define _CRT_SECURE_NO_WARNINGS 
#include<stdio.h>
#include<stdlib.h>
#include<limits.h>
#include<string.h>
#include<time.h>
#include<stdbool.h>
#include <ctype.h>

// 定义最长能够允许输入的明文（密文）字符个数
#define char_max 1000

// 此代码运行环境 Visual Studio 2017
// "#define _CRT_SECURE_NO_WARNINGS" 去掉VS安全检查
// !!!请不要输入中文字符
// 算法展示核心部分，仅限

// 加密解密函数
void convertion(char* text, char *result, char *key);
// 检查密钥函数
bool check_key(char *key);

int main()
{
	 // 存储输入的明文(或密文)
	char* text = (char*)calloc(sizeof(char),char_max);
	// 存储结果
	char* result = (char*)calloc(sizeof(char),char_max);
	// 存储密钥
	char *key = (char*)calloc(sizeof(char), 27);
	// 加密还是解密
	bool isEnycript = true;
	char ch = 'Y';
	// 错误输入次数，连续出错三次程序退出
	int fail_time = 0;
	// 临时变量，用于清空输入区
 	int c = 0;


	printf_s("请输入明文,以回车键结束:\n");
	// 获取需要加密或解密的字符
	gets(text);
	// 获取密钥
	printf_s("请输入密钥:");
	gets(key);
	
	// 读取密钥,保证输入的密钥只含字母
	while (!check_key(key))
	{
		// 如果连续输入错误超过3次，程序退出
		fail_time++;
		if (fail_time == 3)
		{
			printf_s("连续输入错误超过3次,程序退出\n");
			system("pause");
			return 0;
		}
		printf_s("密钥含有非法字符,请重新输入(密钥只能为字母,且长度小于等于26):");
		gets(key);
		

	}
	fail_time = 0;
	// 选择加密或解密
	//printf_s("请问是加密(Y)或解密(N):");
	//scanf_s("%c", &ch);
	//while (toupper(ch)!='Y'&&toupper(ch)!='N')
	//{
	//	while ((c = getchar()) != '\n' && c != EOF);
	//	fail_time++;
	//	if (fail_time == 3)
	//	{
	//		printf_s("连续输入错误超过3次,程序退出\n");
	//		system("pause");
	//		return 0;
	//	}
	//	printf_s("请输入Y(加密)或N(解密):");
	//	scanf_s("%c", &ch);
	//}
	// 执行加密
	convertion(text, result, key);
	printf_s("%s\n", result);

	free(text);
	free(result);

	system("pause");
	return 0;
}

bool check_key(char *key)
{
	int i = 0, length = 0;

	length = strlen(key);
	for (i = 0; i < length; i++)
	{
		if (!isalpha(key[i]))
			return false;
	}
	return true;
}

//------------------------------//
//char* text; 需要加密的明文
//char* result; 返回的结果
//char key:加密的密钥
//------------------------------//
void convertion(char* text, char *result, char *key)
{
	int* key_order = malloc(sizeof(int) * strlen(key));
	char* key_temp = malloc(sizeof(int)*strlen(key));
	int i = 0;
	int j = 0;
	int pos = 0;
	char temp = 'a';
	int count = 0;

	strcpy(key_temp, key);
	for (i = 0; i < strlen(key_temp) - 1; i++)
	{
		j = 0;
		for (; j < strlen(key_temp) - 1; j++)
		{
			if (toupper(key_temp[j]) - toupper(key_temp[j + 1])>0)
			{
				temp = toupper(key_temp[j]);
				key_temp[j] = toupper(key_temp[j + 1]);
				key_temp[j + 1] = temp;
			}
		}
	}
	for (i = 0; i < strlen(key); i++)
	{
		for (j = 0; j < strlen(key); j++)
		{
			if (key_temp[i] == toupper( key[j]))
			{
				key_order[i] = j;
				key[j] = '-';
				break;
			}
		}
	}
	for (i = 0; i < strlen(key); i++)
	{
		pos = key_order[i];
		while (pos<strlen(text))
		{
			result[count] = towupper(text[pos]);
			pos += strlen(key);
			count++;
		}
	}

}