<template>
  <pre class='hljs'><code><span class="hljs-comment">#define _CRT_SECURE_NO_WARNINGS </span>
  <span class="hljs-comment">#include&lt;stdio.h&gt;</span>
  <span class="hljs-comment">#include&lt;stdlib.h&gt;</span>
  <span class="hljs-comment">#include&lt;limits.h&gt;</span>
  <span class="hljs-comment">#include&lt;string.h&gt;</span>
  <span class="hljs-comment">#include&lt;time.h&gt;</span>
  <span class="hljs-comment">#include&lt;stdbool.h&gt;</span>
  <span class="hljs-comment">#include &lt;ctype.h&gt;</span>

  // 定义最长能够允许输入的明文（密文）字符个数
  <span class="hljs-comment">#define char_max 1000</span>

  // 此代码运行环境 <span class="hljs-type">Visual</span> <span class="hljs-type">Studio</span> <span class="hljs-number">2017</span>
  // <span class="hljs-string">"#define _CRT_SECURE_NO_WARNINGS"</span> 去掉<span class="hljs-type">VS</span>安全检查
  // !!!请不要输入中文字符

  // 加密解密函数
  <span class="hljs-type">void</span> singleTablereplacement(<span class="hljs-type">char</span>* text, <span class="hljs-type">char</span> *<span class="hljs-literal">result</span>, <span class="hljs-type">char</span>*key, <span class="hljs-type">bool</span> isEnycript);
  // 检查密钥函数
  <span class="hljs-type">bool</span> check_key(<span class="hljs-type">char</span> *key);

  <span class="hljs-type">int</span> main()
  {
     // 存储输入的明文(或密文)
    <span class="hljs-type">char</span>* text = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>),char_max);
    // 存储结果
    <span class="hljs-type">char</span>* <span class="hljs-literal">result</span> = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>),char_max);
    // 存储密钥
    <span class="hljs-type">char</span> *key = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>), <span class="hljs-number">27</span>);
    // 加密还是解密
    <span class="hljs-type">bool</span> isEnycript = <span class="hljs-literal">true</span>;
    <span class="hljs-type">char</span> ch = 'Y';
    // 错误输入次数，连续出错三次程序退出
    <span class="hljs-type">int</span> fail_time = <span class="hljs-number">0</span>;
    // 临时变量，用于清空输入区
    <span class="hljs-type">int</span> c = <span class="hljs-number">0</span>;


    printf_s(<span class="hljs-string">"请输入明文(或密文),以回车键结束:\n"</span>);
    // 获取需要加密或解密的字符
    gets(text);
    // 获取密钥
    printf_s(<span class="hljs-string">"请输入密钥:"</span>);
    gets(key);

    // 读取密钥,保证输入的密钥只含字母
    <span class="hljs-keyword">while</span> (!check_key(key))
    {
      // 如果连续输入错误超过<span class="hljs-number">3</span>次，程序退出
      fail_time++;
      <span class="hljs-keyword">if</span> (fail_time == <span class="hljs-number">3</span>)
      {
        printf_s(<span class="hljs-string">"连续输入错误超过3次,程序退出\n"</span>);
        system(<span class="hljs-string">"pause"</span>);
        <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
      }
      printf_s(<span class="hljs-string">"密钥含有非法字符,请重新输入(密钥只能为字母,且长度小于等于26):"</span>);
      gets(key);


    }
    fail_time = <span class="hljs-number">0</span>;
    // 选择加密或解密
    printf_s(<span class="hljs-string">"请问是加密(Y)或解密(N):"</span>);
    scanf_s(<span class="hljs-string">"%c"</span>, &amp;ch);
    <span class="hljs-keyword">while</span> (toupper(ch)!='Y'&amp;&amp;toupper(ch)!='N')
    {
      <span class="hljs-keyword">while</span> ((c = getchar()) != '\n' &amp;&amp; c != <span class="hljs-type">EOF</span>);
      fail_time++;
      <span class="hljs-keyword">if</span> (fail_time == <span class="hljs-number">3</span>)
      {
        printf_s(<span class="hljs-string">"连续输入错误超过3次,程序退出\n"</span>);
        system(<span class="hljs-string">"pause"</span>);
        <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
      }
      printf_s(<span class="hljs-string">"请输入Y(加密)或N(解密):"</span>);
      scanf_s(<span class="hljs-string">"%c"</span>, &amp;ch);
    }
    // 执行加密
    singleTablereplacement(text, <span class="hljs-literal">result</span>, key,<span class="hljs-literal">true</span>);
    printf_s(<span class="hljs-string">"%s\n"</span>, <span class="hljs-literal">result</span>);

    free(text);
    free(<span class="hljs-literal">result</span>);

    system(<span class="hljs-string">"pause"</span>);
    <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }

  <span class="hljs-type">bool</span> check_key(<span class="hljs-type">char</span> *key)
  {
    <span class="hljs-type">int</span> i = <span class="hljs-number">0</span>, length = <span class="hljs-number">0</span>;

    length = strlen(key);
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; length; i++)
    {
      <span class="hljs-keyword">if</span> (!isalpha(key[i]))
        <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>;
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>;
  }
  //------------------------------//
  //<span class="hljs-type">char</span>* text; 需要加密的明文
  //<span class="hljs-type">char</span>* <span class="hljs-literal">result</span>; 返回的结果
  //<span class="hljs-type">int</span> key:加密的密钥
  //<span class="hljs-type">bool</span> isEnycript: 加密还是解密
  //------------------------------//
  <span class="hljs-type">void</span> singleTablereplacement(<span class="hljs-type">char</span>* text,<span class="hljs-type">char</span> *<span class="hljs-literal">result</span>,<span class="hljs-type">char</span>*key,<span class="hljs-type">bool</span> isEnycript)
  {
    // 存储明文
    <span class="hljs-type">char</span> *plain_table = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>), <span class="hljs-number">27</span>);
    // 存储密文
    <span class="hljs-type">char</span> *cipher_table = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>), <span class="hljs-number">27</span>);
    // 检查密文中的字母是否重复，哈希值
    <span class="hljs-type">int</span> *check_repeat = (<span class="hljs-type">int</span>*)calloc(sizeof(<span class="hljs-type">int</span>), <span class="hljs-number">27</span>);
    <span class="hljs-type">int</span> i = <span class="hljs-number">0</span>, pos = <span class="hljs-number">0</span>, pass = <span class="hljs-number">0</span>;

    // 明文字母
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">65</span>; i &lt; <span class="hljs-number">91</span>; i++)
    {
      plain_table[i-<span class="hljs-number">65</span>] = (<span class="hljs-type">char</span>)i;
    }

    // 填写密文字母
    i = <span class="hljs-number">0</span>;
    // 依次遍历密钥
    <span class="hljs-keyword">while</span> (key[i])
    {
      // 如果该字母还没有出现过，该字母哈希值所在位置对应为<span class="hljs-number">0</span>
      <span class="hljs-keyword">if</span> (!check_repeat[(toupper(key[i]) - <span class="hljs-number">65</span>)])
      {
        // 将密钥放到密文表中
        cipher_table[pos] = toupper(key[i]);
        // 标记该字母已经出现过
        check_repeat[(toupper(key[i]) - <span class="hljs-number">65</span>)] = <span class="hljs-number">1</span>;
        pos++;
      }
      i++;
    }
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">65</span>; i &lt; <span class="hljs-number">91</span>; i++)
    {
      // 把没有出现过的密钥字母填入密文表中
      <span class="hljs-keyword">if</span> (!check_repeat[i - <span class="hljs-number">65</span>])
      {
        cipher_table[pos] = (<span class="hljs-type">char</span>)i;
        check_repeat[i - <span class="hljs-number">65</span>] = <span class="hljs-number">1</span>;
        pos++;
      }
    }

    // 进行加密或解密
    i = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">if</span> (isEnycript)
    {
      <span class="hljs-keyword">while</span> (text[i])
      {
        // 如果是字母,找到该明文字母对应的密文字母
        <span class="hljs-keyword">if</span> (isalpha(text[i]))
          <span class="hljs-literal">result</span>[i - pass] = cipher_table[toupper(text[i]) - <span class="hljs-number">65</span>];
        // 去掉所有' ','\t','\n','\v','\r','\f'显示为空的字符
        <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (isspace(text[i]))
        {
          i++;
          pass++;
          <span class="hljs-keyword">continue</span>;
        }
        // 其它字符原样输出
        <span class="hljs-keyword">else</span>
          <span class="hljs-literal">result</span>[i - pass] = text[i];
        i++;
      }
    }
    <span class="hljs-keyword">else</span>
    {
      <span class="hljs-keyword">while</span> (text[i])
      {
        <span class="hljs-keyword">if</span> (isalpha(text[i]))
          <span class="hljs-literal">result</span>[i - pass] = plain_table[toupper(text[i] - <span class="hljs-number">65</span>)];
        <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (isspace(text[i]))
        {
          i++;
          pass++;
          <span class="hljs-keyword">continue</span>;
        }
        <span class="hljs-keyword">else</span>
          <span class="hljs-literal">result</span>[i - pass] = text[i];
        i++;
      }
    }

    <span class="hljs-keyword">return</span>;
  }</code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
