<template>
  <pre class='hljs'><code>#<span class="hljs-keyword">include</span> &lt;stdio.h&gt;
  #define getpch(<span class="hljs-keyword">type</span>) (<span class="hljs-keyword">type</span> *)mallloc(sizeof(<span class="hljs-keyword">type</span>))
  <span class="hljs-keyword">struct</span> <span class="hljs-type">LNode</span>
  {
      <span class="hljs-built_in">int</span> size;
      <span class="hljs-built_in">int</span> start;
      <span class="hljs-built_in">int</span> <span class="hljs-keyword">end</span>;
      <span class="hljs-keyword">struct</span> <span class="hljs-type">LNode</span> *next;
      <span class="hljs-keyword">struct</span> <span class="hljs-type">LNode</span> *front;
  } * <span class="hljs-type">L</span>;
  typedef <span class="hljs-keyword">struct</span> <span class="hljs-type">LNode</span> <span class="hljs-type">LN</span>;
  <span class="hljs-type">LN</span> *find;
  <span class="hljs-built_in">int</span> n;
  void <span class="hljs-type">InsertList</span>(<span class="hljs-built_in">int</span> size, <span class="hljs-built_in">int</span> start)
  {
      <span class="hljs-type">LN</span> *p, *s, *t;
      p = <span class="hljs-type">L</span>;
      <span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>;
      printf(<span class="hljs-string">"\n空闲区号 长度 起始位置 终止位置\n"</span>);
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">1</span>; i &lt;= n; i++)
      {
          printf(<span class="hljs-string">"%3d\t %3d\t%3d\t %4d\n"</span>, i, p-&gt;size, p-&gt;start, p-&gt;<span class="hljs-keyword">end</span>);
          p = p-&gt;next;
      }
  }

  void <span class="hljs-type">SortList</span><span class="hljs-literal">()</span>
  {
      <span class="hljs-type">LN</span> *p, *s, *t;
      <span class="hljs-built_in">int</span> min_start, i;
      <span class="hljs-built_in">int</span> size, start, <span class="hljs-keyword">end</span>;
      t = <span class="hljs-type">L</span>-&gt;next;
      p = <span class="hljs-type">L</span>-&gt;next;
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; n; i++)
      {
          s = p-&gt;next;
          min_start = p-&gt;start;
          <span class="hljs-keyword">while</span> (s)
          {
              <span class="hljs-keyword">if</span> (min_start &gt; s-&gt;start)
              {
                  min_start = s-&gt;start;
                  t = s;
              }
              s = s-&gt;next;
          }
          size = t-&gt;size;
          start = t-&gt;start;
          <span class="hljs-keyword">end</span> = t-&gt;<span class="hljs-keyword">end</span>;
          t-&gt;size = p-&gt;size;
          t-&gt;start = p-&gt;start;
          t-&gt;<span class="hljs-keyword">end</span> = p-&gt;<span class="hljs-keyword">end</span>;
          p-&gt;size = size;
          p-&gt;start = start;
          p-&gt;<span class="hljs-keyword">end</span> = <span class="hljs-keyword">end</span>;
          t = t-&gt;next;
          p = p-&gt;next;
      }
  }

  void <span class="hljs-type">GetFree</span><span class="hljs-literal">()</span>
  {
      <span class="hljs-built_in">int</span> size, start, i;
      <span class="hljs-type">L</span> = getpch(<span class="hljs-type">LN</span>);
      <span class="hljs-type">L</span>-&gt;next = <span class="hljs-type">NULL</span>;
      <span class="hljs-type">L</span>-&gt;front = <span class="hljs-type">NULL</span>;
      printf(<span class="hljs-string">"请输入空闲区数："</span>);
      scanf(<span class="hljs-string">"%d"</span>, &amp;n);
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">1</span>; i &lt;= n; i++)
      {
          printf(<span class="hljs-string">"请输入第%2d空闲区的大小和初始地址。\n"</span>, i);
          scanf(<span class="hljs-string">"%3d,%3d"</span>, &amp;size, &amp;start);
          <span class="hljs-type">InsertList</span>(size, start);
      }
      printf(<span class="hljs-string">"\n按任意键继续。"</span>);
  }

  <span class="hljs-built_in">int</span> flag = -<span class="hljs-number">1</span>;
  void <span class="hljs-type">NF_Assign</span>(<span class="hljs-built_in">int</span> size)
  {
      <span class="hljs-type">LN</span> *p, *t;
      <span class="hljs-built_in">int</span> i = n;
      p = find-&gt;next;
      t = find;
      <span class="hljs-keyword">while</span> (p)
      {
          <span class="hljs-keyword">if</span> (size &gt; p-&gt;size)
          {
              p = p-&gt;next;
              t = t-&gt;next;
              <span class="hljs-keyword">if</span> (!p)
              {
                  printf(<span class="hljs-string">"没有足够大的空间去分配！分配不成功。"</span>);
              }
          }
          <span class="hljs-keyword">else</span>
          {
              p-&gt;size = p-&gt;size - size;
              p-&gt;start = p-&gt;start + size;
              find = p;
              <span class="hljs-keyword">if</span> (p-&gt;size == <span class="hljs-number">0</span>)
              {
                  t-&gt;next = p-&gt;next;
                  p-&gt;next-&gt;front = t;
                  n--;
                  free(p);
              }
              printf(<span class="hljs-string">"分配成功！\n"</span>);
              flag = <span class="hljs-number">1</span>;
              printf(<span class="hljs-string">"分配后的空闲链表情况如下：\n"</span>);
              <span class="hljs-type">Print</span>(<span class="hljs-type">L</span>);
              break;
          }
      }
      <span class="hljs-keyword">if</span> (flag == -<span class="hljs-number">1</span>)
      {
          p = <span class="hljs-type">L</span>-&gt;next;
          t = <span class="hljs-type">L</span>;
          <span class="hljs-keyword">while</span> (p != find)
          {
              <span class="hljs-keyword">if</span> (size &gt; p-&gt;size)
              {
                  p = p-&gt;size;
                  t = t-&gt;next;
                  <span class="hljs-keyword">if</span> (!p)
                  {
                      printf(<span class="hljs-string">"没有足够大的空间去分配！分配不成功。"</span>);
                  }
              }
              <span class="hljs-keyword">else</span>
              {
                  p-&gt;size = p-&gt;size - size;
                  p-&gt;start = p-&gt;start + size;
                  find = t;
                  <span class="hljs-keyword">if</span> (p-&gt;size == <span class="hljs-number">0</span>)
                  {
                      t-&gt;next = p-&gt;next;
                      p-&gt;next-&gt;front = t;
                      n--;
                      free(p);
                  }
                  printf(<span class="hljs-string">"分配成功！\n"</span>);
                  printf(<span class="hljs-string">"分配后的空闲链表情况如下：\n"</span>);
                  <span class="hljs-type">PrintList</span>(<span class="hljs-type">L</span>);
                  break;
              }
          }
      }
  }

  void main<span class="hljs-literal">()</span>
  {
      <span class="hljs-built_in">int</span> start, <span class="hljs-keyword">end</span>, size;
      <span class="hljs-built_in">int</span> m;
      <span class="hljs-type">GetFree</span><span class="hljs-literal">()</span>;
      getch<span class="hljs-literal">()</span>;
      system(<span class="hljs-string">"cls"</span>);
      <span class="hljs-type">SortList</span><span class="hljs-literal">()</span>;
      printf(<span class="hljs-string">"\n空闲链表情况：\n"</span>);
      <span class="hljs-type">PrintList</span><span class="hljs-literal">()</span>;
      printf(<span class="hljs-string">"请输入进程需要的空闲区大小："</span>);
      scanf(<span class="hljs-string">"%d"</span>, &amp;size);
      <span class="hljs-type">NF_Assign</span>(size);
  }</code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
