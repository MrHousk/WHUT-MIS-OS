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
  // 请不要输入中文字符
  //------------------------------//

  <span class="hljs-type">void</span> rerverse(<span class="hljs-type">char</span>* text, <span class="hljs-type">char</span>* <span class="hljs-literal">result</span>);


  <span class="hljs-type">int</span> main()
  {
    // 存储输入的明文(或密文)
    <span class="hljs-type">char</span>* text = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>),char_max);
    // 存储结果
    <span class="hljs-type">char</span>* <span class="hljs-literal">result</span> = (<span class="hljs-type">char</span>*)calloc(sizeof(<span class="hljs-type">char</span>),char_max);
    printf_s(<span class="hljs-string">"请输入明文(或密文),以回车键结束:\n"</span>);
    // 从键盘获取输入
    gets(text);

    rerverse(text, <span class="hljs-literal">result</span>);
    printf_s(<span class="hljs-string">"%s\n"</span>, <span class="hljs-literal">result</span>);
    free(text);
    free(<span class="hljs-literal">result</span>);

    system(<span class="hljs-string">"pause"</span>);

    <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }

  //------------------------------//
  //<span class="hljs-type">char</span>* text; 需要加密的明文
  //<span class="hljs-type">char</span>* <span class="hljs-literal">result</span>; 返回的结果
  //------------------------------//

  <span class="hljs-type">void</span> rerverse(<span class="hljs-type">char</span>* text,<span class="hljs-type">char</span>* <span class="hljs-literal">result</span>)
  {
    <span class="hljs-type">int</span> pos = <span class="hljs-number">0</span>;
    <span class="hljs-type">int</span> vaild = <span class="hljs-number">0</span>;

    memset(<span class="hljs-literal">result</span>, <span class="hljs-number">0</span>, char_max * sizeof(<span class="hljs-type">char</span>));
    <span class="hljs-keyword">while</span> (text[pos])
    {
      <span class="hljs-keyword">if</span> (isalpha(text[pos]))
      {
        // 字母首位对应，其和是固定的为<span class="hljs-number">155</span>(<span class="hljs-type">ASCII</span>编码)
        <span class="hljs-literal">result</span>[vaild] = (<span class="hljs-type">char</span>)<span class="hljs-number">155</span> - toupper(text[pos]);
      }
      <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (isspace(text[pos]))
      {
        pos++;
        <span class="hljs-keyword">continue</span>;
      }
      <span class="hljs-keyword">else</span>
      {
        <span class="hljs-literal">result</span>[vaild] = text[pos];
      }
      vaild++;
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
