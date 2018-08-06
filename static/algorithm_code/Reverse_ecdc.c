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

//------------------------------//
// 此代码运行环境 Visual Studio 2017
// "#define _CRT_SECURE_NO_WARNINGS" 去掉VS安全检查
// 请不要输入中文字符
//------------------------------//

void rerverse(char* text, char* result);


int main()
{
	// 存储输入的明文(或密文)
	char* text = (char*)calloc(sizeof(char),char_max);
	// 存储结果
	char* result = (char*)calloc(sizeof(char),char_max);
	printf_s("请输入明文(或密文),以回车键结束:\n");
	// 从键盘获取输入
	gets(text);

	rerverse(text, result);
	printf_s("%s\n", result);
	free(text);
	free(result);

	system("pause");

	return 0;
}

//------------------------------//
//char* text; 需要加密的明文
//char* result; 返回的结果
//------------------------------//

void rerverse(char* text,char* result)
{
	int pos = 0;
	int vaild = 0;

	memset(result, 0, char_max * sizeof(char));
	while (text[pos])
	{
		if (isalpha(text[pos]))
		{
			// 字母首位对应，其和是固定的为155(ASCII编码)
			result[vaild] = (char)155 - toupper(text[pos]);
		}
		else if (isspace(text[pos]))
		{
			pos++;
			continue;
		}
		else
		{
			result[vaild] = text[pos];
		}
		vaild++;
		pos++;
	}

	return;
}
