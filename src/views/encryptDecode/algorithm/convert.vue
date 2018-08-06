<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">define</span> _CRT_SECURE_NO_WARNINGS </span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;limits.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;string.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;time.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdbool.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span> &lt;ctype.h&gt;</span>

  <span class="hljs-comment">// 定义最长能够允许输入的明文（密文）字符个数</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">define</span> char_max 1000</span>

  <span class="hljs-comment">// 此代码运行环境 Visual Studio 2017</span>
  <span class="hljs-comment">// "#define _CRT_SECURE_NO_WARNINGS" 去掉VS安全检查</span>
  <span class="hljs-comment">// !!!请不要输入中文字符</span>
  <span class="hljs-comment">// 算法展示核心部分，仅限</span>

  <span class="hljs-comment">// 加密解密函数</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">convertion</span><span class="hljs-params">(<span class="hljs-keyword">char</span>* text, <span class="hljs-keyword">char</span> *result, <span class="hljs-keyword">char</span> *key)</span></span>;
  <span class="hljs-comment">// 检查密钥函数</span>
  <span class="hljs-function"><span class="hljs-keyword">bool</span> <span class="hljs-title">check_key</span><span class="hljs-params">(<span class="hljs-keyword">char</span> *key)</span></span>;

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
     <span class="hljs-comment">// 存储输入的明文(或密文)</span>
    <span class="hljs-keyword">char</span>* text = (<span class="hljs-keyword">char</span>*)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">char</span>),char_max);
    <span class="hljs-comment">// 存储结果</span>
    <span class="hljs-keyword">char</span>* result = (<span class="hljs-keyword">char</span>*)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">char</span>),char_max);
    <span class="hljs-comment">// 存储密钥</span>
    <span class="hljs-keyword">char</span> *key = (<span class="hljs-keyword">char</span>*)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">char</span>), <span class="hljs-number">27</span>);
    <span class="hljs-comment">// 加密还是解密</span>
    <span class="hljs-keyword">bool</span> isEnycript = <span class="hljs-keyword">true</span>;
    <span class="hljs-keyword">char</span> ch = <span class="hljs-string">'Y'</span>;
    <span class="hljs-comment">// 错误输入次数，连续出错三次程序退出</span>
    <span class="hljs-keyword">int</span> fail_time = <span class="hljs-number">0</span>;
    <span class="hljs-comment">// 临时变量，用于清空输入区</span>
     <span class="hljs-keyword">int</span> c = <span class="hljs-number">0</span>;


    printf_s(<span class="hljs-string">"请输入明文,以回车键结束:\n"</span>);
    <span class="hljs-comment">// 获取需要加密或解密的字符</span>
    gets(text);
    <span class="hljs-comment">// 获取密钥</span>
    printf_s(<span class="hljs-string">"请输入密钥:"</span>);
    gets(key);

    <span class="hljs-comment">// 读取密钥,保证输入的密钥只含字母</span>
    <span class="hljs-keyword">while</span> (!check_key(key))
    {
      <span class="hljs-comment">// 如果连续输入错误超过3次，程序退出</span>
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
    <span class="hljs-comment">// 选择加密或解密</span>
    <span class="hljs-comment">//printf_s("请问是加密(Y)或解密(N):");</span>
    <span class="hljs-comment">//scanf_s("%c", &amp;ch);</span>
    <span class="hljs-comment">//while (toupper(ch)!='Y'&amp;&amp;toupper(ch)!='N')</span>
    <span class="hljs-comment">//{</span>
    <span class="hljs-comment">//	while ((c = getchar()) != '\n' &amp;&amp; c != EOF);</span>
    <span class="hljs-comment">//	fail_time++;</span>
    <span class="hljs-comment">//	if (fail_time == 3)</span>
    <span class="hljs-comment">//	{</span>
    <span class="hljs-comment">//		printf_s("连续输入错误超过3次,程序退出\n");</span>
    <span class="hljs-comment">//		system("pause");</span>
    <span class="hljs-comment">//		return 0;</span>
    <span class="hljs-comment">//	}</span>
    <span class="hljs-comment">//	printf_s("请输入Y(加密)或N(解密):");</span>
    <span class="hljs-comment">//	scanf_s("%c", &amp;ch);</span>
    <span class="hljs-comment">//}</span>
    <span class="hljs-comment">// 执行加密</span>
    convertion(text, result, key);
    printf_s(<span class="hljs-string">"%s\n"</span>, result);

    <span class="hljs-built_in">free</span>(text);
    <span class="hljs-built_in">free</span>(result);

    system(<span class="hljs-string">"pause"</span>);
    <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }

  <span class="hljs-function"><span class="hljs-keyword">bool</span> <span class="hljs-title">check_key</span><span class="hljs-params">(<span class="hljs-keyword">char</span> *key)</span>
  </span>{
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>, length = <span class="hljs-number">0</span>;

    length = <span class="hljs-built_in">strlen</span>(key);
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; length; i++)
    {
      <span class="hljs-keyword">if</span> (!<span class="hljs-built_in">isalpha</span>(key[i]))
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">false</span>;
    }
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">true</span>;
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">//char* text; 需要加密的明文</span>
  <span class="hljs-comment">//char* result; 返回的结果</span>
  <span class="hljs-comment">//char key:加密的密钥</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">convertion</span><span class="hljs-params">(<span class="hljs-keyword">char</span>* text, <span class="hljs-keyword">char</span> *result, <span class="hljs-keyword">char</span> *key)</span>
  </span>{
    <span class="hljs-keyword">int</span>* key_order = <span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>) * <span class="hljs-built_in">strlen</span>(key));
    <span class="hljs-keyword">char</span>* key_temp = <span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>)*<span class="hljs-built_in">strlen</span>(key));
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">int</span> j = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">int</span> pos = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">char</span> temp = <span class="hljs-string">'a'</span>;
    <span class="hljs-keyword">int</span> count = <span class="hljs-number">0</span>;

    <span class="hljs-built_in">strcpy</span>(key_temp, key);
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; <span class="hljs-built_in">strlen</span>(key_temp) - <span class="hljs-number">1</span>; i++)
    {
      j = <span class="hljs-number">0</span>;
      <span class="hljs-keyword">for</span> (; j &lt; <span class="hljs-built_in">strlen</span>(key_temp) - <span class="hljs-number">1</span>; j++)
      {
        <span class="hljs-keyword">if</span> (<span class="hljs-built_in">toupper</span>(key_temp[j]) - <span class="hljs-built_in">toupper</span>(key_temp[j + <span class="hljs-number">1</span>])&gt;<span class="hljs-number">0</span>)
        {
          temp = <span class="hljs-built_in">toupper</span>(key_temp[j]);
          key_temp[j] = <span class="hljs-built_in">toupper</span>(key_temp[j + <span class="hljs-number">1</span>]);
          key_temp[j + <span class="hljs-number">1</span>] = temp;
        }
      }
    }
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; <span class="hljs-built_in">strlen</span>(key); i++)
    {
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; <span class="hljs-built_in">strlen</span>(key); j++)
      {
        <span class="hljs-keyword">if</span> (key_temp[i] == <span class="hljs-built_in">toupper</span>( key[j]))
        {
          key_order[i] = j;
          key[j] = <span class="hljs-string">'-'</span>;
          <span class="hljs-keyword">break</span>;
        }
      }
    }
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; <span class="hljs-built_in">strlen</span>(key); i++)
    {
      pos = key_order[i];
      <span class="hljs-keyword">while</span> (pos&lt;<span class="hljs-built_in">strlen</span>(text))
      {
        result[count] = towupper(text[pos]);
        pos += <span class="hljs-built_in">strlen</span>(key);
        count++;
      }
    }

  }</code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
