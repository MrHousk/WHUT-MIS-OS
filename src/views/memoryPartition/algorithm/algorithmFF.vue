<template>
  <pre class='hljs'><code>
  #<span class="hljs-keyword">include</span> &lt;stdio.h&gt;
  #<span class="hljs-keyword">include</span> &lt;stdlib.h&gt;

  typedef struct Node
  {
      <span class="hljs-keyword">int</span> id;    <span class="hljs-comment">// 作业id,为-1代表空闲分区;大于0代表已分配</span>
      <span class="hljs-keyword">int</span> start; <span class="hljs-comment">// 始址</span>
      <span class="hljs-keyword">int</span> <span class="hljs-keyword">size</span>;  <span class="hljs-comment">// 大小</span>
      struct Node *<span class="hljs-keyword">next</span>;
  } Node, *LNode;
  <span class="hljs-keyword">int</span> <span class="hljs-keyword">SIZE</span>;

  <span class="hljs-comment">// 返回分区链</span>
  LNode init()
  {
      LNode head = (LNode)malloc(sizeof(Node)); <span class="hljs-comment">//使用头节点便于与插入和删除</span>
      head-&gt;<span class="hljs-keyword">next</span> = (LNode)malloc(sizeof(Node)); <span class="hljs-comment">//初始化,为整个内存空间分配一个空闲节点</span>
      head-&gt;<span class="hljs-keyword">next</span>-&gt;id = -<span class="hljs-number">1</span>;
      head-&gt;<span class="hljs-keyword">next</span>-&gt;start = <span class="hljs-number">0</span>;
      printf(<span class="hljs-string">"请输入内存空间大小: "</span>);
      scanf(<span class="hljs-string">"%d"</span>, &amp;head-&gt;<span class="hljs-keyword">next</span>-&gt;<span class="hljs-keyword">size</span>);
      head-&gt;<span class="hljs-keyword">next</span>-&gt;<span class="hljs-keyword">next</span> = <span class="hljs-keyword">NULL</span>;
      printf(<span class="hljs-string">"请输入碎片大小: "</span>);
      scanf(<span class="hljs-string">"%d"</span>, &amp;<span class="hljs-keyword">SIZE</span>);
      <span class="hljs-keyword">return</span> head;
  }

  <span class="hljs-comment">// 为作业id在分区链head中分配大小为size的内存</span>
  <span class="hljs-keyword">int</span> add(LNode head, <span class="hljs-keyword">int</span> id, <span class="hljs-keyword">int</span> <span class="hljs-keyword">size</span>)
  {
      LNode p = head-&gt;<span class="hljs-keyword">next</span>;
      <span class="hljs-keyword">for</span> (; p; p = p-&gt;<span class="hljs-keyword">next</span>) <span class="hljs-comment">// 找到第一个未分配且大于size的内存空间节点</span>
          <span class="hljs-keyword">if</span> (-<span class="hljs-number">1</span> == p-&gt;id &amp;&amp; p-&gt;<span class="hljs-keyword">size</span> &gt;= <span class="hljs-keyword">size</span>)
              <span class="hljs-keyword">break</span>;
      <span class="hljs-keyword">if</span> (p == <span class="hljs-keyword">NULL</span>)
          <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>; <span class="hljs-comment">// 不存在未分配且大于或等于size的内存空间节点</span>

      <span class="hljs-comment">// 当原来节点的大小大于size+SIZE时需要创建一个新节点temp保留余下的分区,并插在p的后面1</span>
      <span class="hljs-keyword">if</span> (p-&gt;<span class="hljs-keyword">size</span> - <span class="hljs-keyword">size</span> &gt; <span class="hljs-keyword">SIZE</span>)
      {
          LNode temp = (LNode)malloc(sizeof(Node));
          temp-&gt;id = -<span class="hljs-number">1</span>;
          temp-&gt;start = p-&gt;start + <span class="hljs-keyword">size</span>;
          temp-&gt;<span class="hljs-keyword">size</span> = p-&gt;<span class="hljs-keyword">size</span> - <span class="hljs-keyword">size</span>;
          temp-&gt;<span class="hljs-keyword">next</span> = p-&gt;<span class="hljs-keyword">next</span>;
          p-&gt;<span class="hljs-keyword">next</span> = temp;
      }
      <span class="hljs-comment">// 将原来节点变成已分配的节点,当剩余空间大于SIZE时,该节点大小为size;当剩余空间小于或等于SIZE时,该节点大小不变;</span>
      p-&gt;id = id;
      p-&gt;<span class="hljs-keyword">size</span> = (p-&gt;<span class="hljs-keyword">size</span> - <span class="hljs-keyword">size</span> &gt; <span class="hljs-keyword">SIZE</span> ? <span class="hljs-keyword">size</span> : p-&gt;<span class="hljs-keyword">size</span>);
      <span class="hljs-keyword">return</span> <span class="hljs-number">1</span>;
  }
  <span class="hljs-comment">// 回收作业id的内存,并合并相邻的空闲分区</span>
  <span class="hljs-keyword">int</span> del(LNode head, <span class="hljs-keyword">int</span> id)
  {
      LNode p = head-&gt;<span class="hljs-keyword">next</span>, a, b;
      <span class="hljs-comment">// 找到作业id所在的节点</span>
      <span class="hljs-keyword">while</span> (p &amp;&amp; p-&gt;id != id)
          p = p-&gt;<span class="hljs-keyword">next</span>;
      <span class="hljs-keyword">if</span> (p == <span class="hljs-keyword">NULL</span>)
          <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;

      p-&gt;id = -<span class="hljs-number">1</span>; <span class="hljs-comment">// 回收分区</span>

      <span class="hljs-comment">// 为避免分情况回收分区,直接从头开始查找相邻节点并合并</span>
      a = head-&gt;<span class="hljs-keyword">next</span>;
      b = a-&gt;<span class="hljs-keyword">next</span>;
      <span class="hljs-keyword">while</span> (b)
      { <span class="hljs-comment">// 至少有一个节点,所以当b=NULL时,说明合并完成</span>
          <span class="hljs-keyword">if</span> (-<span class="hljs-number">1</span> == a-&gt;id &amp;&amp; -<span class="hljs-number">1</span> == b-&gt;id &amp;&amp; a-&gt;start + a-&gt;<span class="hljs-keyword">size</span> == b-&gt;start)
          { <span class="hljs-comment">// 若相邻,合并a和b</span>
              a-&gt;<span class="hljs-keyword">size</span> += b-&gt;<span class="hljs-keyword">size</span>;
              a-&gt;<span class="hljs-keyword">next</span> = b-&gt;<span class="hljs-keyword">next</span>;
              free(b);
              <span class="hljs-comment">// 合并完相邻的a和b后,可能存在a与下一个空闲节点又相邻</span>
              b = a-&gt;<span class="hljs-keyword">next</span>;
              <span class="hljs-keyword">continue</span>;
          }
          a = a-&gt;<span class="hljs-keyword">next</span>;
          b = a-&gt;<span class="hljs-keyword">next</span>;
      }
      <span class="hljs-keyword">return</span> <span class="hljs-number">1</span>;
  }
  <span class="hljs-keyword">void</span> show(LNode head)
  {
      LNode p = head-&gt;<span class="hljs-keyword">next</span>, q = head-&gt;<span class="hljs-keyword">next</span>;
      <span class="hljs-keyword">int</span> i = <span class="hljs-number">1</span>, j = <span class="hljs-number">1</span>;
      printf(<span class="hljs-string">"        已分配分区                  空闲分区\n"</span>);
      printf(<span class="hljs-string">"(分区号, 作业, 始址, 大小)    (分区号, 始址, 大小)\n"</span>);
      <span class="hljs-keyword">while</span> (p || q)
      {
          <span class="hljs-keyword">while</span> (p &amp;&amp; p-&gt;id == -<span class="hljs-number">1</span>)
          {
              p = p-&gt;<span class="hljs-keyword">next</span>;
              i++;
          }
          <span class="hljs-keyword">while</span> (q &amp;&amp; q-&gt;id != -<span class="hljs-number">1</span>)
          {
              q = q-&gt;<span class="hljs-keyword">next</span>;
              j++;
          }
          <span class="hljs-keyword">if</span> (p)
          {
              printf(<span class="hljs-string">" %6d, %4d, %4d, %4d "</span>, i, p-&gt;id, p-&gt;start, p-&gt;<span class="hljs-keyword">size</span>);
              p = p-&gt;<span class="hljs-keyword">next</span>;
              i++;
          }
          <span class="hljs-keyword">else</span>
              printf(<span class="hljs-string">"                          "</span>);
          <span class="hljs-keyword">if</span> (q)
          {
              printf(<span class="hljs-string">"     %6d, %4d, %4d "</span>, j, q-&gt;start, q-&gt;<span class="hljs-keyword">size</span>);
              q = q-&gt;<span class="hljs-keyword">next</span>;
              j++;
          }
          printf(<span class="hljs-string">"\n"</span>);
      }
  }

  <span class="hljs-keyword">int</span> main()
  {
      LNode head = init();
      <span class="hljs-keyword">while</span> (<span class="hljs-number">1</span>)
      {
          <span class="hljs-keyword">int</span> op, id, <span class="hljs-keyword">size</span>, state;
          printf(<span class="hljs-string">"\n************************************************\n"</span>);
          printf(<span class="hljs-string">"   1: 为新作业分配内存        2: 撤销作业释放内存\n"</span>);
          printf(<span class="hljs-string">"   3: 查看FF算法内存分配      4: 退出\n"</span>);
          printf(<span class="hljs-string">"请输入操作: "</span>);
          scanf(<span class="hljs-string">"%d"</span>, &amp;op);
          <span class="hljs-keyword">switch</span> (op)
          {
          <span class="hljs-keyword">case</span> <span class="hljs-number">1</span>:
              printf(<span class="hljs-string">"请输入作业id和作业大小size: "</span>);
              scanf(<span class="hljs-string">"%d%d"</span>, &amp;id, &amp;<span class="hljs-keyword">size</span>);
              <span class="hljs-keyword">if</span> (add(head, id, <span class="hljs-keyword">size</span>))
                  printf(<span class="hljs-string">"分配成功\n"</span>);
              <span class="hljs-keyword">else</span>
                  printf(<span class="hljs-string">"分配失败\n"</span>);
              <span class="hljs-keyword">break</span>;
          <span class="hljs-keyword">case</span> <span class="hljs-number">2</span>:
              printf(<span class="hljs-string">"请输入需要撤销的作业id: "</span>);
              scanf(<span class="hljs-string">"%d"</span>, &amp;id);
              <span class="hljs-keyword">if</span> (del(head, id))
                  printf(<span class="hljs-string">"撤销成功\n"</span>);
              <span class="hljs-keyword">else</span>
                  printf(<span class="hljs-string">"撤销失败\n"</span>);
              <span class="hljs-keyword">break</span>;
          <span class="hljs-keyword">case</span> <span class="hljs-number">3</span>:
              show(head);
              <span class="hljs-keyword">break</span>;
          <span class="hljs-keyword">case</span> <span class="hljs-number">4</span>:
              <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
          }
      }
      <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }
  </code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
