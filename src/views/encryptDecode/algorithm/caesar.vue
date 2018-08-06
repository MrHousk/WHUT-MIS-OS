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

  //------------------------------//
  // 此代码运行环境 <span class="hljs-type">Visual</span> <span class="hljs-type">Studio</span> <span class="hljs-number">2017</span>
  // <span class="hljs-string">"#define _CRT_SECURE_NO_WARNINGS"</span> 去掉<span class="hljs-type">VS</span>安全检查
  // 为了简化输入逻辑，此代码默认进行加密操作
  // key为正字母向后移动，key为负向前移动，key值正负交替，即可模拟加密与解密过程
  // 请不要输入中文字符
  //------------------------------//

  <span class="hljs-type">void</span> <span class="hljs-type">CaesarsCipher</span>(<span class="hljs-type">char</span>* text, <span class="hljs-type">char</span>* <span class="hljs-literal">result</span>, <span class="hljs-type">int</span> key);

  <span class="hljs-type">int</span> main()
  {
    // 存储输入的明文(或密文)
    <span class="hljs-type">char</span>* text = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>),char_max);
    // 存储结果
    <span class="hljs-type">char</span>* <span class="hljs-literal">result</span> = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>),char_max);
    // 密钥
    <span class="hljs-type">int</span> key = <span class="hljs-number">0</span>;
    // 临时变量，用于清空输入区
    <span class="hljs-type">int</span> c = <span class="hljs-number">0</span>;

    // 输入失败的次数，连续<span class="hljs-number">3</span>次输入失败程序将自动退出
    <span class="hljs-type">int</span> fail_time = <span class="hljs-number">0</span>;
    //
    printf_s(<span class="hljs-string">"请输入明文(或密文),以回车键结束:\n"</span>);
    // 从键盘获取输入
    gets(text);
    printf_s(<span class="hljs-string">"请输入密钥(整数):"</span>);
    // 读取密钥必须是整数
    <span class="hljs-keyword">while</span> (scanf_s(<span class="hljs-string">"%d"</span>, &amp;key) != <span class="hljs-number">1</span>)
    {
      // 清空缓冲区
      <span class="hljs-keyword">while</span> ((c = getchar()) != '\n' &amp;&amp; c != <span class="hljs-type">EOF</span>);
      fail_time++;
      <span class="hljs-keyword">if</span> (fail_time == <span class="hljs-number">3</span>)
      {
        printf_s(<span class="hljs-string">"连续失败达到3次，程序自动退出\n"</span>);
        system(<span class="hljs-string">"pause"</span>);
        <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
      }
      printf_s(<span class="hljs-string">"请输入整数密钥:"</span>);
    }

    <span class="hljs-type">CaesarsCipher</span>(text, <span class="hljs-literal">result</span>, key);
    printf_s(<span class="hljs-string">"%s\n"</span>, <span class="hljs-literal">result</span>);
    free(text);
    free(<span class="hljs-literal">result</span>);

    system(<span class="hljs-string">"pause"</span>);

    <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }

  //------------------------------//
  //<span class="hljs-type">char</span>* text; 需要加密的明文
  //<span class="hljs-type">char</span>* <span class="hljs-literal">result</span>; 返回的结果
  //<span class="hljs-type">int</span> key:加密的密钥
  //------------------------------//
  <span class="hljs-type">void</span> <span class="hljs-type">CaesarsCipher</span>(<span class="hljs-type">char</span>* text, <span class="hljs-type">char</span>* <span class="hljs-literal">result</span>,<span class="hljs-type">int</span> key)
  {
    // 记录当前位置
    <span class="hljs-type">int</span> pos = <span class="hljs-number">0</span>;
    // 记录有效的值
    <span class="hljs-type">int</span> vaild = <span class="hljs-number">0</span>;
    // 字母的ascii码值
    <span class="hljs-type">int</span> code = <span class="hljs-number">0</span>;
    // 初始化结果数组
    memset(<span class="hljs-literal">result</span>, <span class="hljs-number">0</span>, char_max*sizeof(<span class="hljs-type">char</span>));
    // 对关键字取模运算
    key = abs(key) % <span class="hljs-number">26</span>;
    // 遍历输入的所有字符
    <span class="hljs-keyword">while</span> (text[pos])
    {
      // 如果是字母，进行处理
      <span class="hljs-keyword">if</span> (isalpha(text[pos]))
      {
        // 获取字母<span class="hljs-type">ASCII</span>值
        code = toupper(text[pos]);
        // 进行加密或解密操作
        code += key;
        // 判断<span class="hljs-type">ASCII</span>是否越界
        <span class="hljs-keyword">if</span> (code &gt; <span class="hljs-number">90</span>)
          code = code - <span class="hljs-number">26</span>;
        <span class="hljs-keyword">if</span> (code &lt; <span class="hljs-number">65</span>)
          code = code + <span class="hljs-number">26</span>;
        <span class="hljs-literal">result</span>[vaild] = (<span class="hljs-type">char</span>)code;
        vaild++;
      }
      // 去掉所有' ','\t','\n','\v','\r','\f'显示为空的字符
      <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (isspace(text[pos]))
      {
        pos++;
        <span class="hljs-keyword">continue</span>;
      }
      // 其它字符原样输入
      <span class="hljs-keyword">else</span>
      {
        <span class="hljs-literal">result</span>[vaild] = text[pos];
        vaild++;
      }
      pos++;
    }

    <span class="hljs-keyword">return</span>;
  }
  </code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
