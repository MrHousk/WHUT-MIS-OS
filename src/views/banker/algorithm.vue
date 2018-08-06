<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">include</span> &lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span> &lt;stdlib.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span> &lt;string.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span> &lt;malloc.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span> &lt;time.h&gt;</span>

  <span class="hljs-comment">//指针初始化，给指针分配对应的空间</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">pointerInit</span><span class="hljs-params">(<span class="hljs-keyword">int</span> **available, <span class="hljs-keyword">int</span> **max, <span class="hljs-keyword">int</span> **allocation, <span class="hljs-keyword">int</span> **need, <span class="hljs-keyword">int</span> **request, <span class="hljs-keyword">int</span> **secured_sequence, <span class="hljs-keyword">int</span> p_num, <span class="hljs-keyword">int</span> r_num)</span></span>;

  <span class="hljs-comment">//随机分配数据值，获取available, max, allocation, need</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">getRandomData</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *available, <span class="hljs-keyword">int</span> *max, <span class="hljs-keyword">int</span> *allocation, <span class="hljs-keyword">int</span> *need, <span class="hljs-keyword">int</span> *request, <span class="hljs-keyword">int</span> *secured_sequence, <span class="hljs-keyword">int</span> p_num, <span class="hljs-keyword">int</span> r_num, <span class="hljs-keyword">int</span> range_max)</span></span>;

  <span class="hljs-comment">//request请求合法性检查，检查此次申请的数量是否合法，即请求量是否超过系统剩余，以及本次分配之后，该进程占有资源量是否超出声明量，返回值为0时代表不合法</span>
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">requestInspect</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *available, <span class="hljs-keyword">int</span> *max, <span class="hljs-keyword">int</span> *allocation, <span class="hljs-keyword">int</span> *need, <span class="hljs-keyword">int</span> *request, <span class="hljs-keyword">int</span> *secured_sequence, <span class="hljs-keyword">int</span> p_num, <span class="hljs-keyword">int</span> r_num)</span></span>;

  <span class="hljs-comment">//获得解决方案（安全序列），返回值为0时代表找不到安全序列，即不安全</span>
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">getSolution</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *available, <span class="hljs-keyword">int</span> *max, <span class="hljs-keyword">int</span> *allocation, <span class="hljs-keyword">int</span> *need, <span class="hljs-keyword">int</span> *request, <span class="hljs-keyword">int</span> *secured_sequence, <span class="hljs-keyword">int</span> p_num, <span class="hljs-keyword">int</span> r_num)</span></span>;

  <span class="hljs-comment">//拷贝两个指定大小的int形指针的内容，第一个拷贝给第二个</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">copyIntPointer</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *a, <span class="hljs-keyword">int</span> *b, <span class="hljs-keyword">int</span> size)</span></span>;

  <span class="hljs-comment">//释放全部指针</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">freePointer</span><span class="hljs-params">()</span></span>;


  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
    <span class="hljs-keyword">int</span> i;

    <span class="hljs-keyword">int</span> *available = NULL;<span class="hljs-comment">//剩余资源向量</span>
    <span class="hljs-keyword">int</span> *max = NULL;<span class="hljs-comment">//最大所需资源矩阵</span>
    <span class="hljs-keyword">int</span> *allocation = NULL;<span class="hljs-comment">//已分配资源矩阵</span>
    <span class="hljs-keyword">int</span> *need = NULL;<span class="hljs-comment">//剩余需求矩阵</span>
    <span class="hljs-keyword">int</span> *request = NULL;<span class="hljs-comment">//新请求资源向量，最后一个值为request对应的进程号（从0开始）</span>
    <span class="hljs-keyword">int</span> *secured_sequence = NULL;<span class="hljs-comment">//安全序列向量，全部初始化为-1</span>
    <span class="hljs-keyword">int</span> p_num = <span class="hljs-number">5</span>;<span class="hljs-comment">//进程数量向量</span>
    <span class="hljs-keyword">int</span> r_num = <span class="hljs-number">4</span>;<span class="hljs-comment">//资源种类向量</span>
    <span class="hljs-keyword">int</span> range_max = <span class="hljs-number">9</span>;<span class="hljs-comment">//已分配资源上限（初始化用，设为15就行）</span>

    pointerInit(&amp;available, &amp;max, &amp;allocation, &amp;need, &amp;request, &amp;secured_sequence, p_num, r_num);
    getRandomData(available, max, allocation, need, request, secured_sequence, p_num, r_num, range_max);

    <span class="hljs-keyword">if</span> (!requestInspect(available, max, allocation, need, request, secured_sequence, p_num, r_num))
    {
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"request不符合要求\n"</span>);
      <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
    }
    <span class="hljs-keyword">if</span> (getSolution(available, max, allocation, need, request, secured_sequence, p_num, r_num))
    {
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"找到安全序列："</span>);
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i&lt;p_num - <span class="hljs-number">1</span>; i++)
      {
        <span class="hljs-built_in">printf</span>(<span class="hljs-string">" %d -"</span>, secured_sequence[i]);
      }
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">" %d \n"</span>, secured_sequence[p_num - <span class="hljs-number">1</span>]);
    }
    <span class="hljs-keyword">else</span>
    {
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"找不到安全序列："</span>);
    }

    system(<span class="hljs-string">"pause"</span>);
    <span class="hljs-comment">//scanf_s(" ");</span>

  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// 初始化全部指针</span>
  <span class="hljs-comment">// int **available; 剩余资源向量</span>
  <span class="hljs-comment">// int **max;//最大所需资源矩阵</span>
  <span class="hljs-comment">// int **allocation;//已分配资源矩阵</span>
  <span class="hljs-comment">// int **need;//剩余需求矩阵</span>
  <span class="hljs-comment">// int **request//新请求资源向量</span>
  <span class="hljs-comment">// int **secured_sequence;//安全序列向量</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">pointerInit</span><span class="hljs-params">(<span class="hljs-keyword">int</span> **available, <span class="hljs-keyword">int</span> **max, <span class="hljs-keyword">int</span> **allocation, <span class="hljs-keyword">int</span> **need, <span class="hljs-keyword">int</span> **request, <span class="hljs-keyword">int</span> **secured_sequence, <span class="hljs-keyword">int</span> p_num, <span class="hljs-keyword">int</span> r_num)</span>
  </span>{
    *available = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(r_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));
    *max = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(r_num*p_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));
    *allocation = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(r_num*p_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));
    *need = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(r_num*p_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));
    *request = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(r_num + <span class="hljs-number">1</span>, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));
    *secured_sequence = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(p_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// 初始化全部指针</span>
  <span class="hljs-comment">// int *available; 剩余资源向量</span>
  <span class="hljs-comment">// int *max;//最大所需资源矩阵</span>
  <span class="hljs-comment">// int *allocation;//已分配资源矩阵</span>
  <span class="hljs-comment">// int *need;//剩余需求矩阵</span>
  <span class="hljs-comment">// int *request//新请求资源向量</span>
  <span class="hljs-comment">// int *secured_sequence;//安全序列向量</span>
  <span class="hljs-comment">// int p_num; 进程数量向量</span>
  <span class="hljs-comment">// int r_num; 资源种类向量</span>
  <span class="hljs-comment">// int range_max; 已分配资源上限</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">getRandomData</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *available, <span class="hljs-keyword">int</span> *max, <span class="hljs-keyword">int</span> *allocation, <span class="hljs-keyword">int</span> *need, <span class="hljs-keyword">int</span> *request, <span class="hljs-keyword">int</span> *secured_sequence, <span class="hljs-keyword">int</span> p_num, <span class="hljs-keyword">int</span> r_num, <span class="hljs-keyword">int</span> range_max)</span>
  </span>{

    <span class="hljs-keyword">int</span> *answer = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>),p_num);<span class="hljs-comment">//首先生成随机答案序列</span>
    <span class="hljs-keyword">int</span> *temp_answer = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>),p_num);<span class="hljs-comment">//答案序列临时变量</span>
    <span class="hljs-keyword">int</span> *upper_limit = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), r_num);<span class="hljs-comment">//need分配矩阵上界</span>
    <span class="hljs-keyword">int</span> *lower_limit = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), r_num);<span class="hljs-comment">//need分配矩阵下限</span>
    <span class="hljs-keyword">int</span> max_pos = p_num, seed = <span class="hljs-number">0</span>;<span class="hljs-comment">//初始化随机种子，初始化最大寻址位置</span>
    <span class="hljs-keyword">int</span> need_random = <span class="hljs-number">0</span>;<span class="hljs-comment">//确定需要随机分配的在lower_limit和upper_limit之间数的个数</span>
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>, j = <span class="hljs-number">0</span>, temp = <span class="hljs-number">0</span>;<span class="hljs-comment">//temp来存储随机数</span>

    <span class="hljs-comment">//---第一个模块，首先随机生成答案,即：生成[0~r_num]的不同的随机数-------------------</span>
    srand(time(NULL));<span class="hljs-comment">//重置时间种子</span>
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; p_num; i++)<span class="hljs-comment">//从0开始初始化答案序列数组</span>
    {
      temp_answer[i] = i;
    }
    <span class="hljs-comment">//生成随机答案序列</span>
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; p_num; i++)
    {
      temp = rand() % max_pos;
      max_pos--;
      answer[i] = temp_answer[temp];

      <span class="hljs-keyword">for</span> (j = temp; j &lt; max_pos; j++)
      {
        temp_answer[j] = temp_answer[j + <span class="hljs-number">1</span>];
      }
    }
    seed = clock()*clock()*clock()*clock()*time(NULL);<span class="hljs-comment">//初始分配allocation数值</span>
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; p_num*r_num; i++)
    {
      allocation[i] = rand() % range_max + <span class="hljs-number">1</span>;<span class="hljs-comment">//生成范围在[0,range_max]范围的数值</span>
    }

    <span class="hljs-comment">//--第二部分，产生表示已分配资源的随机数----</span>
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; r_num; i++)
    {
      need[answer[<span class="hljs-number">0</span>] * r_num + i] = rand() % range_max + <span class="hljs-number">1</span>;<span class="hljs-comment">//为答案的第一个进程分配它已经分配的资源，至少一个</span>
      <span class="hljs-comment">//-↓-可以满足该进程，是因为该进程的资源所需小于upper_limit矩阵,“2”表示希望差距最小是2，必须有</span>
      upper_limit[i] = need[answer[<span class="hljs-number">0</span>] * r_num + i] + rand() % (range_max / <span class="hljs-number">3</span>) + <span class="hljs-number">3</span>;
      available[i] = upper_limit[i];<span class="hljs-comment">//系统所剩总资源</span>
    }

    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">1</span>; i &lt; p_num; i++)
    {
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; r_num; j++)
        lower_limit[j] = upper_limit[j];
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; r_num; j++)
        upper_limit[j] += allocation[(answer[i-<span class="hljs-number">1</span>] * r_num + j)];
      <span class="hljs-comment">//选择(r_num / 3 + 1)个数，使得这些数在[lower_limit,upper_limint]之间</span>
      need_random = (r_num / <span class="hljs-number">3</span> + <span class="hljs-number">1</span>);
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; need_random; j++)
      {
        temp = rand() % r_num;
        need[answer[i] * r_num + temp] = rand() % (upper_limit[temp] - lower_limit[temp]) + lower_limit[temp] + <span class="hljs-number">1</span>;	
      }
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt;r_num; j++)
      {
        <span class="hljs-keyword">if</span> (need[(answer[i] * r_num + j)] == <span class="hljs-number">0</span>)
        <span class="hljs-comment">//如果这个地方还没有被赋过值，则赋值,need矩阵初始值一定要为0</span>
        {
          need[(answer[i] * r_num + j)] = rand() % upper_limit[j] + <span class="hljs-number">1</span>;
        }

      }
    }
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; r_num*p_num; i++)
    {
      max[i] = need[i] + allocation[i];
    }

    <span class="hljs-comment">//-----------------测试输出随机答案------------------------</span>
    printf_s(<span class="hljs-string">"max:"</span>);
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; p_num*r_num; i++)
    {
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%d "</span>, max[i]);
    }
    printf_s(<span class="hljs-string">"\nneed:"</span>);
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; p_num*r_num; i++)
    {
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%d "</span>, need[i]);
    }

    printf_s(<span class="hljs-string">"\nanswer"</span>);
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; p_num; i++)
    {
      printf_s(<span class="hljs-string">" %d"</span>, answer[i]);
    }
    <span class="hljs-built_in">printf</span>(<span class="hljs-string">"\nallocation:"</span>);
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; p_num*r_num; i++)
    {
      printf_s(<span class="hljs-string">"%d "</span>, allocation[i]);
    }
    printf_s(<span class="hljs-string">"\n"</span>);

  } 

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// 安全检查</span>
  <span class="hljs-comment">// int *available; 剩余资源向量</span>
  <span class="hljs-comment">// int *max;//最大所需资源矩阵</span>
  <span class="hljs-comment">// int *allocation;//已分配资源矩阵</span>
  <span class="hljs-comment">// int *need;//剩余需求矩阵</span>
  <span class="hljs-comment">// int *request//新请求资源向量</span>
  <span class="hljs-comment">// int *secured_sequence;//安全序列向量</span>
  <span class="hljs-comment">// int p_num; 进程数量向量</span>
  <span class="hljs-comment">// int r_num; 资源种类向量</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">requestInspect</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *available, <span class="hljs-keyword">int</span> *max, <span class="hljs-keyword">int</span> *allocation, <span class="hljs-keyword">int</span> *need, <span class="hljs-keyword">int</span> *request, <span class="hljs-keyword">int</span> *secured_sequence, <span class="hljs-keyword">int</span> p_num, <span class="hljs-keyword">int</span> r_num)</span>
  </span>{
    <span class="hljs-keyword">int</span> i;
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i&lt;r_num; i++)
    {
      <span class="hljs-keyword">if</span> ((allocation[request[r_num] * r_num + i] + request[i]) &gt; max[request[r_num] * r_num + i])
      {
        printf_s(<span class="hljs-string">"//所需资源加已分配资源超过声明最大值，返回false"</span>);
        system(<span class="hljs-string">"pause"</span>);

        <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;<span class="hljs-comment">//所需资源加已分配资源超过声明最大值，返回false</span>
      }
      <span class="hljs-keyword">if</span> (request[i] &gt; available[i])
      {
        printf_s(<span class="hljs-string">"请求资源超过系统剩余，返回false"</span>);
        system(<span class="hljs-string">"pause"</span>);


        <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;<span class="hljs-comment">//请求资源超过系统剩余，返回false</span>
      }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-number">1</span>;<span class="hljs-comment">//request请求符合基本检查要求，返回true</span>
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// 获得安全序列</span>
  <span class="hljs-comment">// int *available; 剩余资源向量</span>
  <span class="hljs-comment">// int *max;//最大所需资源矩阵</span>
  <span class="hljs-comment">// int *allocation;//已分配资源矩阵</span>
  <span class="hljs-comment">// int *need;//剩余需求矩阵</span>
  <span class="hljs-comment">// int *request//新请求资源向量</span>
  <span class="hljs-comment">// int *secured_sequence;//安全序列向量</span>
  <span class="hljs-comment">// int p_num; 进程数量向量</span>
  <span class="hljs-comment">// int r_num; 资源种类向量</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">getSolution</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *available, <span class="hljs-keyword">int</span> *max, <span class="hljs-keyword">int</span> *allocation, <span class="hljs-keyword">int</span> *need, <span class="hljs-keyword">int</span> *request, <span class="hljs-keyword">int</span> *secured_sequence, <span class="hljs-keyword">int</span> p_num, <span class="hljs-keyword">int</span> r_num)</span>
  </span>{
    <span class="hljs-keyword">int</span> i, j, m;<span class="hljs-comment">//循环变量，无实际意义</span>
    <span class="hljs-keyword">int</span> flag;<span class="hljs-comment">//标识符，标识对应线程是否能安全完成</span>

    <span class="hljs-keyword">int</span> *finish = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(p_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));<span class="hljs-comment">//进程完成指示向量，finish[x]的bool值代表第x个进程是否完成</span>

    <span class="hljs-keyword">int</span> *work = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(r_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));<span class="hljs-comment">//当前可用资源向量（实时变化，初始值等于available）</span>
    <span class="hljs-keyword">int</span> *allo = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(p_num*r_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));<span class="hljs-comment">//当前各进程占用资源矩阵（实时变化，初始值等于allocation）</span>
    <span class="hljs-keyword">int</span> *ned = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(p_num*r_num, <span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>));<span class="hljs-comment">//当前各进程需求资源矩阵（实时变化，初始值等于need）</span>

    <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j&lt;p_num; j++)<span class="hljs-comment">//开始寻找安全序列前，将安全序列置为-1</span>
    {
      secured_sequence[j] = -<span class="hljs-number">1</span>;
    }

    copyIntPointer(available, work, r_num);<span class="hljs-comment">//设置word初始值</span>
    copyIntPointer(allocation, allo, p_num*r_num);<span class="hljs-comment">//设置allo初始值</span>
    copyIntPointer(need, ned, p_num*r_num);<span class="hljs-comment">//设置ned初始值</span>

    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i&lt;r_num; i++)<span class="hljs-comment">//预分配，计算这次资源请求后，系统资源情况</span>
    {
      work[i] = work[i] - request[i];
      allo[request[r_num] * r_num + i] = allo[request[r_num] * r_num + i] + request[i];
      ned[request[r_num] * r_num + i] = ned[request[r_num] * r_num + i] - request[i];
    }
    <span class="hljs-comment">//开始寻找安全序列</span>
    <span class="hljs-keyword">for</span> (m = <span class="hljs-number">0</span>; m&lt;p_num; m++)
    <span class="hljs-comment">//循环p_num次，每次循环寻找一条可以安全完成的进程</span>
    {
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j&lt;p_num; j++)
      <span class="hljs-comment">//循环p_num次，每次循环判断第j条进程是否可以安全完成，若可以完成，则插插入安全序列并释放资源</span>
      {
        flag = <span class="hljs-number">1</span>;<span class="hljs-comment">//先假设这条进程能够安全完成</span>
        <span class="hljs-keyword">if</span> (finish[j] == <span class="hljs-number">0</span>)
        {
          <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i&lt;r_num; i++)
          <span class="hljs-comment">//循环r_num次，判断每一种资源是否够第j个线程的需求</span>
          {
            <span class="hljs-keyword">if</span> (ned[j*r_num + i] &gt; work[i])
            {
              flag = <span class="hljs-number">0</span>;<span class="hljs-comment">//这条线程所需的资源超过了现有资源（work），不能安全完成</span>
              <span class="hljs-keyword">break</span>;
            }
          }
          <span class="hljs-keyword">if</span> (flag == <span class="hljs-number">1</span>)
          <span class="hljs-comment">//经过了上面的for循环，flag仍为1，则意味着这条线程所需的所有资源都在现有（work）范围内，则插入安全序列并释放资源</span>
          {
            secured_sequence[m] = j;<span class="hljs-comment">//插入安全序列</span>
            <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i&lt;r_num; i++)<span class="hljs-comment">//释放进程J所占有的资源</span>
            {
              work[i] = work[i] + allo[j * r_num + i];
            }
            finish[j] = <span class="hljs-number">1</span>;<span class="hljs-comment">//将第j条进程置为已完成</span>
            <span class="hljs-keyword">break</span>;<span class="hljs-comment">//跳出for j循环，即已找到第m个可以完成的进程</span>
          }
          <span class="hljs-keyword">else</span>
          {
            <span class="hljs-keyword">continue</span>;
          }
        }
        <span class="hljs-keyword">else</span>
        {
          <span class="hljs-keyword">continue</span>;
        }
      }
      <span class="hljs-keyword">if</span> (secured_sequence[m] == -<span class="hljs-number">1</span>)
      <span class="hljs-comment">//如果安全序列成功找到，那么安全序列的最后一个值就会是最后完成的进程号。反之，若为-1，则代表未找到</span>
      {
        <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;<span class="hljs-comment">//无法找到安全序列，返回false</span>
      }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-number">1</span>;<span class="hljs-comment">//找到安全序列，返回true；安全序列储存在secured_sequence中</span>
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// 拷贝两个int型指针内容</span>
  <span class="hljs-comment">// int *a; 原指针</span>
  <span class="hljs-comment">// int *b; 待赋值的指针</span>
  <span class="hljs-comment">// int size; 指针数组大小</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">copyIntPointer</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *a, <span class="hljs-keyword">int</span> *b, <span class="hljs-keyword">int</span> size)</span>
  </span>{
    <span class="hljs-keyword">int</span> i;
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i&lt;size; i++)
    {
      b[i] = a[i];
    }
  }

  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">freePointer</span><span class="hljs-params">()</span>
  </span>{
    <span class="hljs-comment">//释放指针，请同学们自行完善补充</span>
    <span class="hljs-built_in">printf</span>(<span class="hljs-string">"--------------------"</span>);
  }
  </code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
