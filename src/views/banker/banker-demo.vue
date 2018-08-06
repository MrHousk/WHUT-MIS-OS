<template>
  <section class="banker-right">
    <div v-if="!displayResultTable" class="data-input">
      <el-form ref="dataInputForm" :model="dataInputForm" :rules="dataInputFormRules" label-width="140px">
        <el-form-item prop="processNum" label="进程数">
          <el-select v-model="dataInputForm.processNum" placeholder="请选择进程数量" prefix-icon="el-icon-edit" clearable>
            <el-option v-for="item in generateProcessNumOptions()" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="resourceNum" label="资源数">
          <el-select v-model="dataInputForm.resourceNum" placeholder="请选择资源数量" prefix-icon="el-icon-edit" clearable>
            <el-option v-for="item in generateResourceNumOptions()" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="input-buttons">
        <el-button type="primary" class="confirm-input-button" @click="confirmInput" plain round>确定</el-button>
        <el-button type="primary" class="reset-button" @click="resetInputForm('dataInputForm')" plain round>重置</el-button>
      </div>
    </div>

    <div v-else class="banker-demo">
      <m-return @page-return="returnPage"></m-return>
      <div class="result-table">
        <div class="top">
          <div class="work-request-table">
            <!-- work和安全序列表 -->
            <el-table ref="workTable" class="work-table" :data="workTable" border :cell-class-name="getWorkClass">
              <el-table-column :label="initialWork?'资源总数(Total)':'当前剩余资源(Work)'">
                <el-table-column v-for="(item,index) in dataInputForm.resourceNum" :key="item.index" :prop="'available'+String.fromCharCode(index+65)"
                  :label="'资源'+String.fromCharCode(index+65)" align="center">
                  <template slot-scope="scope">
                    <el-input v-if="editButtonStaus" size="small" v-model.number="available[index]"></el-input>
                    <span v-else>{{available[index]}}</span>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column label="安全序列" prop="securedSequence" align="center" width="160">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="bottom">
                    <p>初始都为-1,当无-1时为最终的安全序列</p>
                    <div slot="reference">
                      <span>{{workTable[scope.$index].securedSequence}}</span>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>

            <!-- 请求表 -->
            <el-table class="request-table" :data="requestTable" border :cell-class-name="getRequestClass">
              <el-table-column label="请求资源量(request)">
                <el-table-column prop="requestNum" label="进程号" align="center">
                  <template slot-scope="scope">
                    <el-input v-if="editButtonStaus" size="small" v-model.number="request[dataInputForm.resourceNum]"></el-input>
                    <span v-else>{{request[dataInputForm.resourceNum]}}</span>
                  </template>
                </el-table-column>

                <el-table-column v-for="(item,index) in dataInputForm.resourceNum" :key="item.index" :prop="'request'+String.fromCharCode(index+65)"
                  :label="'资源'+String.fromCharCode(index+65)" align="center">
                  <template slot-scope="scope">
                    <el-input v-if="editButtonStaus" size="small" v-model.number="request[index]"></el-input>
                    <span v-else>{{request[index]}}</span>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>

          <div class="canvas">
            <div class="work">
              {{initialWork?'资源总数':'当前剩余资源'}}
              <div v-for="item in dataInputForm.resourceNum" :key="item">
                {{`资源${String.fromCharCode(item - 1 + 65)} `}}
                <div class="progress" :class="{'onCompare': item - 1 === WorkHighlightColumn, 'onCompareError': item - 1 === WorkHighlightColumn && returnedArray[clickFrequency].IsError}"
                  :style="{'width': `${300 * (available[item - 1] || 0) / Math.max(...available, ...need)}px`}">
                </div>
                {{available[item - 1] ? available[item - 1] : ''}}
              </div>
            </div>
            <div class="need">
              <div>
                进程
                <span class="process-num">{{NedHighlightLine !== '' ? `P${NedHighlightLine}` : '__'}}</span> 仍需资源数
              </div>
              <div v-for="item in dataInputForm.resourceNum" :key="item">
                {{`资源${String.fromCharCode(item - 1 + 65)} `}}
                <div class="progress" :class="{'onCompare': item - 1 === NedHighlightColumn, 'onCompareError': item - 1 === NedHighlightColumn && returnedArray[clickFrequency].IsError}"
                  :style="{'width': `${300 * (NedHighlightLine !== '' && need[dataInputForm.resourceNum * NedHighlightLine + (item - 1)] || 0) / Math.max(...available, ...need)}px`}">
                </div>
                {{NedHighlightLine !== '' && need[dataInputForm.resourceNum * NedHighlightLine + (item - 1)] || ''}}
              </div>
            </div>
          </div>
        </div>

        <!-- 其余数据大表 -->
        <el-table ref="resultTable" class="demo-table" :data="tableData" border max-width="620" :row-class-name="getRowClass" :cell-class-name="getCellClass">
          <el-table-column type="index" :index="processNumber" label="进程" width="60">
          </el-table-column>

          <el-table-column label="最大资源需求量(Max)">
            <el-table-column v-for="(item,index) in dataInputForm.resourceNum" :key="item.index" :prop="'max'+String.fromCharCode(index+65)"
              :label="'资源'+String.fromCharCode(index+65)" align="center">
              <template slot-scope="scope">
                <el-input v-if="editButtonStaus" size="small" v-model.number="max[scope.$index*dataInputForm.resourceNum+index]"></el-input>
                <span v-else>{{max[scope.$index*dataInputForm.resourceNum+index]}}</span>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="已分配资源量(Allocation)">
            <el-table-column v-for="(item,index) in dataInputForm.resourceNum" :key="item.index" :prop="'allocation'+String.fromCharCode(index+65)"
              :label="'资源'+String.fromCharCode(index+65)" align="center">
              <template slot-scope="scope">
                <el-input v-if="editButtonStaus" size="small" v-model.number="allocation[scope.$index*dataInputForm.resourceNum+index]"></el-input>
                <span v-else>{{allocation[scope.$index*dataInputForm.resourceNum+index]}}</span>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="需分配资源数(Need)">
            <el-table-column v-for="(item,index) in dataInputForm.resourceNum" :key="item.index" :prop="'need'+String.fromCharCode(index+65)"
              :label="'资源'+String.fromCharCode(index+65)" align="center">
              <template slot-scope="scope">
                <span>{{need[scope.$index*dataInputForm.resourceNum+index]}}</span>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="已完成" prop="isFinish" width="70" align="center">
            <template slot-scope="scope">
              <span>{{tableData[scope.$index].isFinish}}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="suspended-balls">
          <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" type="primary" icon="el-icon-star-on"></el-button>

          <div class="suspended-ball" :class="{'fill-data-ball':ballsStatus, 'disable-click':disableFillRandom}" @click='fillRandomData();generateMessage();editButtonStaus = true'>
            <span>随机填值</span>
          </div>

          <div class="suspended-ball" :class="{'edit-ball':ballsStatus, 'disable-click':disableInputSelf}" @click='inputSelf'>
            <span>{{editButtonStaus?'完成输入':'修改数据'}}</span>
          </div>

          <div class="suspended-ball" :class="{'clear-ball':ballsStatus, 'disable-click':disableClear}" @click='clear'>
            <span>清空数值</span>
          </div>

          <div class="suspended-ball" :class="{'auto-ball':ballsStatus, 'disable-click':disableAutoCalculate}" @click="autoStepCalculate">
            <span>{{autoButtonStaus?'自动计算':'暂停计算'}}</span>
          </div>

          <div class="suspended-ball" :class="{'calculate-ball':ballsStatus, 'disable-click':disableCalculate}" @click="stepCalculate">
            <span>手动计算</span>
          </div>

          <div class="suspended-ball" :class="{'withdraw-ball':ballsStatus, 'disable-click':disableWithdraw}" @click="withdraw">
            <span>撤回上步</span>
          </div>
        </div>
      </div>
    </div>

    <div class="expand-button" @click="codeAreaShow = true">
      <div class="text">查看代码</div>
    </div>

    <transition name="fadeRight">
      <div v-show="codeAreaShow" :class="['code-area',$store.getters.isCollapse?'code-area-wide':'code-area-narrow']">
        <el-tabs type="border-card" class="algorithm-tab" v-model="selectAlgorithmTab">
          <el-tab-pane label="C算法" name="C">
            <banker-code></banker-code>
          </el-tab-pane>
        </el-tabs>
        <div class="shrink-code-arrow">
          <i class="el-icon-d-arrow-right" @click="codeAreaShow = false"></i>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
  import mixin from '@/mixins/mixin'
  import notify from '@/mixins/notify'
  import bankerCode from './algorithm'
  export default {
    mixins: [mixin, notify],
    data() {
      return {
        displayResultTable: false,
        dataInputForm: {
          processNum: '',
          resourceNum: '',
        },
        dataInputFormRules: {
          processNum: [{
            required: true,
            message: '请选择进程数量',
            trigger: 'blur'
          }],
          resourceNum: [{
            required: true,
            message: '请选择资源数量',
            trigger: 'blur'
          }],
        },
        workTable: [],
        requestTable: [],
        tableData: [],
        AlloHighlightLine: '',
        AlloHighlightColumn: '',
        NedHighlightLine: '',
        NedHighlightColumn: '',
        WorkHighlightLine: '',
        WorkHighlightColumn: '',
        RequestHighlightLine: '',
        RequestHighlightColumn: '',
        ssHighlight: '',
        available: [],
        total: [],
        max: [],
        allocation: [],
        need: [],
        request: [],
        securedSequence: [],
        returnedArray: [],
        initialWork: true,
        clickFrequency: 0,
        editButtonStaus: true,
        autoButtonStaus: true,
        timer: null,
        disableFillRandom: false, // 初始可点击，下同
        disableInputSelf: false,
        disableClear: false,
        disableAutoCalculate: true, // 初始不可点击，下同
        disableCalculate: true,
        disableWithdraw: true,
        selectAlgorithmTab: 'C',
        codeAreaShow: false
      }
    },
    methods: {
      returnPage() {
        if (this.displayResultTable) {
          this.displayResultTable = false;
          this.dataInputForm.processNum = '';
          this.dataInputForm.resourceNum = '';
        }
        //返回时清除通知
        this.closeNotify();
      },
      generateProcessNumOptions() {
        var resultArray = [];
        for (let i = 3; i < 8; i++) {
          resultArray.push({
            value: i,
            label: i
          });
        }
        return resultArray;
      },
      generateResourceNumOptions() {
        var resultArray = [];
        for (let i = 2; i < 6; i++) {
          resultArray.push({
            value: i,
            label: i
          });
        }
        return resultArray;
      },
      confirmInput() {
        this.$refs.dataInputForm.validate(valid => {
          if (valid) {
            this.displayResultTable = true;
            this.editButtonStaus = true;
            this.fillRandomData();
            this.clear();
            this.request.length = this.dataInputForm.resourceNum + 1;
            this.request.fill(0);
            let rowObj = {};
            for (let i = 0; i < this.dataInputForm.resourceNum; i++) {
              rowObj['request' + String.fromCharCode(i + 65)] = this.request[i];
            }
            rowObj = Object.assign(rowObj, {
              requestNum: this.request[this.dataInputForm.resourceNum]
            })
            this.requestTable = []
            this.requestTable.push(rowObj);
            this.generateMessage();
          }
        });
      },
      //高亮work表单元格
      getWorkClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (this.clickFrequency != 0) { //这里的判断是因为，再次点击随机生成按钮后，背景色要清除
          if (rowIndex === this.WorkHighlightLine && columnIndex === this.WorkHighlightColumn || columnIndex === this.ssHighlight) {
            if (this.returnedArray[this.clickFrequency].IsError) {
              return 'onCompareError'
            } else if (columnIndex === this.ssHighlight) {
              return 'hasFinish'
            } else {
              return 'onCompare'
            }
          }
        }
      },
      //高亮请求表单元格
      getRequestClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (this.clickFrequency != 0) { //这里的判断是因为，再次点击随机生成按钮后，背景色要清除
          if (rowIndex === this.RequestHighlightLine && columnIndex === this.RequestHighlightColumn + 1) {
            if (this.returnedArray[this.clickFrequency].IsError) {
              return 'onCompareError'
            } else {
              return 'onCompare'
            }
          }
        }
      },
      //高亮大表行
      getRowClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (this.returnedArray[this.clickFrequency].Finish[rowIndex] == true) {
          return 'success-row'
        }
      },
      //高亮大表单元格
      getCellClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (this.clickFrequency != 0) { //这里的判断是因为，再次点击随机生成按钮后，背景色要清除
          if (rowIndex === this.AlloHighlightLine && columnIndex === this.AlloHighlightColumn + this.dataInputForm.resourceNum +
            1 ||
            rowIndex === this.NedHighlightLine && columnIndex === this.NedHighlightColumn + this.dataInputForm.resourceNum *
            2 + 1) {
            if (this.returnedArray[this.clickFrequency].IsError) {
              return 'onCompareError'
            } else {
              return 'onCompare'
            }
          }
        }
      },
      processNumber(index) {
        return 'P' + index
      },
      //生成随机答案
      getRandomData(processNum, resourceNum) {
        var answer = []; //首先生成随机答案序列
        var temp_answer = []; //答案序列临时变量
        var upper_limit = []; //need分配矩阵上界
        var lower_limit = []; //need分配矩阵下限
        var max_pos = processNum; //初始化随机种子，初始化最大寻址位置
        var seed = 0; //初始化随机种子，初始化最大寻址位置
        var need_random = 0; //确定需要随机分配的在lower_limit和upper_limit之间数的个数
        var i = 0,
          j = 0,
          temp = 0; //temp来存储随机数
        var range_max = 7;
        var need_resource = 0;
        var loop = 0;

        //---第一个模块，首先随机生成答案,即：生成[0~resourceNum]的不同的随机数-------------------
        var is_ordered_putout =  true;
        
        while (is_ordered_putout)
        {
          for (i = 0; i < processNum; i++) //从0开始初始化答案序列数组
          {
            temp_answer.push(i);
          }
          //生成随机答案序列
          for (i = 0; i < processNum; i++) 
          {
            temp = parseInt(Math.random() * (max_pos));
            max_pos--;
            answer.push(temp_answer[temp]); //把temp位置的数放在放在answer[i]位置上

            for (j = temp; j < max_pos; j++) 
            {
              temp_answer[j] = temp_answer[j + 1]; //将temp_answer第temp位后所有项依此前移一位
            }
          }
          for (i=0;i<processNum;i++)
          {
            if (answer[i] === i)
            {
              loop +=1;
            }
          }
          if(loop === processNum)
          {
            is_ordered_putout = true;
            temp_answer = [];
            answer = [];
            loop = 0;
            max_pos  = processNum;
          }
          else
          {
            is_ordered_putout = false;
          }

        }
        for (i = 0; i < processNum * resourceNum; i++) {
          this.allocation.push(parseInt(Math.random() * (range_max)) + 4); //生成范围在[0,range_max]范围的数值
        }
        //--第二部分，产生表示已分配资源的随机数----

        for (i = 0; i < processNum * resourceNum; i++) {
          this.need.push(0); //给need全部赋值为0
        }
        for (i = 0; i < resourceNum; i++) {
          lower_limit.push(0);
        }

        for (i = 0; i < resourceNum; i++) {
          this.need[answer[0] * resourceNum + i] = parseInt(Math.random() * 4) + 3; //为答案的第一个进程分配它已经分配的资源，至少3个
          upper_limit.push(this.need[answer[0] * resourceNum + i] + parseInt(Math.random() * (range_max / 3)) + 5); //可以满足该进程，是因为该进程的资源所需小于upper_limit矩阵,“2”表示希望差距最小是2，必须有
          this.available.push(upper_limit[i]); //系统所剩总资源
        }

        this.total = this.available.slice() 
        for (let i = 0; i < resourceNum; i++) {
          for (let j = 0; j < processNum; j++) {
            this.total[i] += this.allocation[j * resourceNum + i]
          }
        }
        // available is total now 
        this.available = this.total.slice()

        for (i = 1; i < processNum; i++) 
        {
          for (j = 0; j < resourceNum; j++)
            lower_limit[j] = upper_limit[j];
          for (j = 0; j < resourceNum; j++)
            upper_limit[j] += this.allocation[(answer[i - 1] * resourceNum + j)];
          //选择(resourceNum / 3 + 1)个数，使得这些数在[lower_limit,upper_limint]之间
          need_random = (resourceNum / 3 + 1);
          for (j = 0; j < need_random; j++) 
          {
            //随机生成上一次系统所剩的总资源和释放上一次系统所占用的资源后之间的数
            temp = parseInt(Math.random() * (resourceNum));
            need_resource = parseInt(Math.random() * (upper_limit[temp] - lower_limit[temp])) + lower_limit[temp] + 2;
            if (need_resource > upper_limit[temp])
            {
              need_resource = upper_limit[temp];
            }
            this.need[answer[i] * resourceNum + temp] = need_resource;
          }
          for (j = 0; j < resourceNum; j++)
          {
            if (this.need[(answer[i] * resourceNum + j)] === 0) //如果这个地方还没有被赋过值，则赋值,need矩阵初始值一定要为0
            {
              need_resource = parseInt(Math.random() * (upper_limit[j]/3)) + 2;
              if (need_resource > upper_limit[j])
              {
                need_resource = upper_limit[j]-1;
              }
              this.need[(answer[i] * resourceNum + j)] = need_resource ;
            }
          }
        }
        for (i = 0; i < resourceNum * processNum; i++) 
        {
          this.max.push(this.need[i] + this.allocation[i]);
        }
      },
      //根据随机生成的答案求安全序列
      getSolution(available, max, allocation, need, request, secured_sequence, p_num, r_num) {
        var i, j, m; //循环变量，无实际意义
        var flag; //标识符，标识对应线程是否能安全完成
        var last_process = p_num - 1; //最后被执行过的进程号（上一次被执行的进程）

        var finish = []; //进程完成指示向量，finish[x]的bool值代表第x个进程是否完成
        var work = available.slice(); //当前可用资源向量（实时变化，初始值等于available）
        var allo = allocation.slice(); //当前各进程占用资源矩阵（实时变化，初始值等于allocation）
        var ned = need.slice(); //当前各进程需求资源矩阵（实时变化，初始值等于need）
        var running_log = [];
        var log_times = 0;

        for (j = 0; j < p_num; j++) //给安全序列和完成序列设置初始值
        {
          secured_sequence.push(-1);
          finish.push(false);
        }

        running_log.push({
          Work: work.slice(),
          Allo: allo.slice(),
          Ned: ned.slice(),
          SecuredSequence: secured_sequence.slice(),
          Finish: finish.slice(),
          RequestHighlightLine: "",
          RequestHighlightColumn: "",
          WorkHighlightLine: "",
          WorkHighlightColumn: "",
          AlloHighlightLine: "",
          AlloHighlightColumn: "",
          NedHighlightLine: "",
          NedHighlightColumn: "",
          IsError: false,
          PromptMessage: "初始化数据及设置初值",
          LogTimes: ++log_times //测试优化用参数，记录log次数
        });

        for (i = 0; i < r_num; i++) //预分配，计算这次资源请求后，系统资源情况
        {
          work[i] = work[i] - request[i];
          allo[request[r_num] * r_num + i] = allo[request[r_num] * r_num + i] + request[i];
          ned[request[r_num] * r_num + i] = ned[request[r_num] * r_num + i] - request[i];
          running_log.push({
            Work: work.slice(),
            Allo: allo.slice(),
            Ned: ned.slice(),
            SecuredSequence: secured_sequence.slice(),
            Finish: finish.slice(),
            RequestHighlightLine: 0,
            RequestHighlightColumn: i,
            WorkHighlightLine: 0,
            WorkHighlightColumn: i,
            AlloHighlightLine: request[r_num],
            AlloHighlightColumn: i,
            NedHighlightLine: request[r_num],
            NedHighlightColumn: i,
            IsError: false,
            PromptMessage: "预分配，计算满足本次资源请求后，系统资源情况",
            LogTimes: ++log_times
          });
        }

        running_log.push({
          Work: work.slice(),
          Allo: allo.slice(),
          Ned: ned.slice(),
          SecuredSequence: secured_sequence.slice(),
          Finish: finish.slice(),
          RequestHighlightLine: "",
          RequestHighlightColumn: "",
          WorkHighlightLine: "",
          WorkHighlightColumn: "",
          AlloHighlightLine: "",
          AlloHighlightColumn: "",
          NedHighlightLine: "",
          NedHighlightColumn: "",
          IsError: false,
          PromptMessage: "开始寻找安全序列...",
          LogTimes: ++log_times
        });

        //开始寻找安全序列
        j = -1; //初始值设为-1，进入do while循环后先+1，即从第0条进程开始寻找
        for (m = 0; m < p_num; m++) //循环p_num次，每次循环寻找一条可以安全完成的进程
        {
          do //中层循环，从上一次成功执行的进程开始向后寻找可以被执行的进程，若可以完成，则插入安全序列并释放资源
          {
            j += 1; //比较查询的进程号+1
            if (j == p_num) {
              j = 0; //当j(寻找的进程号)超过范围时，重置为0
            }
            flag = 1; //先假设这条进程能够安全完成
            if (finish[j] == false) {
              for (i = 0; i < r_num; i++) //循环r_num次，判断每一种资源是否够第j个线程的需求
              {
                running_log.push({
                  Work: work.slice(),
                  Allo: allo.slice(),
                  Ned: ned.slice(),
                  SecuredSequence: secured_sequence.slice(),
                  Finish: finish.slice(),
                  RequestHighlightLine: "",
                  RequestHighlightColumn: "",
                  WorkHighlightLine: 0,
                  WorkHighlightColumn: i,
                  AlloHighlightLine: "",
                  AlloHighlightColumn: "",
                  NedHighlightLine: j,
                  NedHighlightColumn: i,
                  IsError: false,
                  PromptMessage: "判断剩余资源是否满足第" + (j + 1).toString() + "条线程需求",
                  LogTimes: ++log_times
                });
                if (ned[j * r_num + i] > work[i]) {
                  flag = 0; //这条线程所需的资源超过了现有资源（work），不能安全完成
                  running_log.push({
                    Work: work.slice(),
                    Allo: allo.slice(),
                    Ned: ned.slice(),
                    SecuredSequence: secured_sequence.slice(),
                    Finish: finish.slice(),
                    RequestHighlightLine: "",
                    RequestHighlightColumn: "",
                    WorkHighlightLine: 0,
                    WorkHighlightColumn: i,
                    AlloHighlightLine: "",
                    AlloHighlightColumn: "",
                    NedHighlightLine: j,
                    NedHighlightColumn: i,
                    IsError: true,
                    PromptMessage: "第" + (j + 1).toString() + "条线程所需的资源超过了现有资源（work），不能安全完成",
                    LogTimes: ++log_times
                  });
                  break;
                }
              }
              if (flag == 1) //经过了上面的for循环，flag仍为1，则意味着这条线程所需的所有资源都在现有（work）范围内，则插入安全序列并释放资源
              {
                secured_sequence[m] = "P" + j.toString(); //插入安全序列
                for (i = 0; i < r_num; i++) //释放进程J所占有的资源
                {
                  work[i] = work[i] + allo[j * r_num + i];
                  allo[j * r_num + i] = 0;
                  ned[j * r_num + i] = 0;
                }
                finish[j] = true; //将第j条进程置为已完成
                running_log.push({
                  Work: work.slice(),
                  Allo: allo.slice(),
                  Ned: ned.slice(),
                  SecuredSequence: secured_sequence.slice(),
                  Finish: finish.slice(),
                  RequestHighlightLine: "",
                  RequestHighlightColumn: "",
                  WorkHighlightLine: 0,
                  WorkHighlightColumn: "",
                  AlloHighlightLine: j,
                  AlloHighlightColumn: "",
                  NedHighlightLine: j,
                  NedHighlightColumn: "",
                  IsError: false,
                  PromptMessage: "第" + (j + 1).toString() + "条线程所需的资源可以满足，插入安全序列并释放资源",
                  LogTimes: ++log_times
                });
                last_process = j; //将最后被执行的进程号设置为j
                break; //跳出for j循环(while循环)，即已找到第m个可以完成的进程
              } else {
                continue;
              }
            } else {
              continue;
            }
          } while (j != last_process); //若j再次等于last_process，则意为寻找完成一圈，没有可执行的进程，则跳出循环
          if (secured_sequence[m] == -1) //如果安全序列成功找到，那么安全序列的最后一个值就会是最后完成的进程号。反之，若为-1，则代表未找到
          {
            running_log.push({
              Work: work.slice(),
              Allo: allo.slice(),
              Ned: ned.slice(),
              SecuredSequence: secured_sequence.slice(),
              Finish: finish.slice(),
              RequestHighlightLine: "",
              RequestHighlightColumn: "",
              WorkHighlightLine: "",
              WorkHighlightColumn: "",
              AlloHighlightLine: "",
              AlloHighlightColumn: "",
              NedHighlightLine: "",
              NedHighlightColumn: "",
              IsError: true,
              PromptMessage: "当前所有未完成进程所需资源均无法被满足，无法找到安全序列。本次请求不安全",
              LogTimes: ++log_times
            });
            return running_log; //无法找到安全序列，返回false
          }
        }
        running_log.push({
          Work: work.slice(),
          Allo: allo.slice(),
          Ned: ned.slice(),
          SecuredSequence: secured_sequence.slice(),
          Finish: finish.slice(),
          RequestHighlightLine: "",
          RequestHighlightColumn: "",
          WorkHighlightLine: "",
          WorkHighlightColumn: "",
          AlloHighlightLine: '',
          AlloHighlightColumn: "",
          NedHighlightLine: "",
          NedHighlightColumn: "",
          IsError: false,
          PromptMessage: "找到安全序列：" + secured_sequence.toString() + " 本次请求安全。",
          LogTimes: ++log_times
        });
        return running_log; //找到安全序列，返回true；安全序列储存在secured_sequence中
      },
      //显示当前步骤描述
      generateMessage() {
        //只在结果界面显示通知
        if (this.displayResultTable) {
          //产生新的通知先清空上次的
          this.closeNotify();
          if (!this.max[0]) {
            this.promptMessage = this.notify('点击‘随机填值’可生成初始值；点击‘完成输入’和‘手动计算/自动计算’开始演示', 'info');
            return;
          }
          //求解中遇到问题type为error
          if (this.returnedArray[this.clickFrequency].IsError) {
            this.promptMessage = this.$notify({
              title: '当前状态',
              message: this.returnedArray[this.clickFrequency].PromptMessage,
              type: 'error',
              duration: 0,
              offset: 50
            });
          } else {
            let finishNum = 0,
              finishNumBefore = 0;
            for (let i = 0; i < this.dataInputForm.processNum; i++) {
              if (this.clickFrequency) {
                if (this.returnedArray[this.clickFrequency].Finish[i]) {
                  finishNum = finishNum + 1;
                }
                if (this.returnedArray[this.clickFrequency - 1].Finish[i]) {
                  finishNumBefore = finishNumBefore + 1;
                }
              }
            }
            //一旦有进程完成type变为success，最后得到安全序列也是
            if (finishNum > finishNumBefore || this.returnedArray[this.clickFrequency + 1] === undefined) {
              this.promptMessage = this.$notify({
                title: '当前状态',
                message: this.returnedArray[this.clickFrequency].PromptMessage,
                type: 'success',
                duration: 0,
                offset: 50
              });
            } else {
              //一般情况type为info
              this.promptMessage = this.$notify({
                title: '当前状态',
                message: this.returnedArray[this.clickFrequency].PromptMessage,
                duration: 0,
                type: 'info',
                offset: 50
              });
            }
          }
        }
      },
      //不断更新finish和SecuredSequence的复用代码
      commonFill() {
        //填充finish列(需先调用getSolution)
        for (let i = 0; i < this.dataInputForm.processNum; i++) {
          this.tableData[i].isFinish = this.returnedArray[this.clickFrequency].Finish[i];
        }
        //填充上边表的SecuredSequence列
        this.workTable[0].securedSequence = this.returnedArray[this.clickFrequency].SecuredSequence.toString();
        if (this.returnedArray[this.clickFrequency - 1]) {
          if (this.returnedArray[this.clickFrequency].SecuredSequence.toString() !== this.returnedArray[this.clickFrequency -
              1].SecuredSequence.toString()) {
            this.ssHighlight = this.dataInputForm.resourceNum
          } else {
            this.ssHighlight = ''
          }
        }
      },
      //将随机值填充进表格
      fillRandomData() {
        const resourceNum = this.dataInputForm.resourceNum;
        const processNum = this.dataInputForm.processNum;
        //再次点击时，将getRandomData()中改变过的变量和table中的data清空
        this.max = [];
        this.available = [];
        this.total = [];
        this.allocation = [];
        this.need = [];
        this.workTable = [];
        this.tableData = [];
        this.clickFrequency = 0;
        this.securedSequence = [];
        this.getRandomData(processNum, resourceNum);

        //填充max列
        for (let i = 0; i < processNum; i++) {
          let rowObj = {};
          for (let j = 0; j < resourceNum; j++) {
            rowObj['max' + String.fromCharCode(j + 65)] = this.max[i * resourceNum + j];
          }
          this.tableData.push(rowObj);
        }

        //填充allocation列
        for (let i = 0; i < processNum; i++) {
          let rowObj = {};
          for (let j = 0; j < resourceNum; j++) {
            rowObj['allocation' + String.fromCharCode(j + 65)] = this.allocation[i * resourceNum + j];
          }
          Object.assign(this.tableData[i], rowObj);
        }

        //填充need列
        for (let i = 0; i < processNum; i++) {
          let rowObj = {};
          for (let j = 0; j < resourceNum; j++) {
            rowObj['need' + String.fromCharCode(j + 65)] = this.need[i * resourceNum + j];
          }
          Object.assign(this.tableData[i], rowObj);
        }

        //填充上边表的初始work列（即available）
        let rowObj = {};
        for (let i = 0; i < resourceNum; i++) {
          rowObj['available' + String.fromCharCode(i + 65)] = this.available[i];
        }
        this.workTable.push(rowObj);

        this.returnedArray = this.getSolution(this.available, this.max, this.allocation, this.need, this.request, this.securedSequence,
          processNum, resourceNum);
        this.commonFill();
      },
      //检验请求值是否合法
      requestInspect(available, max, allocation, need, request, secured_sequence, p_num, r_num) {
        //request请求合法性检查，检查此次申请的数量是否合法，即请求量是否超过系统剩余，以及本次分配之后，该进程占有资源量是否超出声明量，返回值为0时代表合法
        var i;
        for (i = 0; i < r_num; i++) {
          if ((allocation[request[r_num] * r_num + i] + request[i]) > max[request[r_num] * r_num + i]) {
            console.log("er1");
            return 1; //所需资源加已分配资源超过声明最大值，返回1
          }
          if (request[i] > available[i]) {
            console.log("er2");
            return 2; //请求资源超过系统剩余，返回2
          }
        }
        return 0; //request请求符合基本检查要求，返回0
      },
      //手动输入值
      inputSelf() {
        this.clickFrequency = 0;
        if (this.editButtonStaus) {
          const resourceNum = this.dataInputForm.resourceNum;
          const processNum = this.dataInputForm.processNum;
          this.closeNotify();
          //资源总数、最大资源量、已分配资源量不可为空，且必须为非负数
          for (let i = 0; i < processNum; i++) {
            for (let j = 0; j < resourceNum; j++) {
              if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(this.max[i * resourceNum + j]) ||
                !/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(this.allocation[i * resourceNum + j]) || !
                /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(this.available[j])) {
                this.promptMessage = this.notify('资源总数、最大资源量、已分配资源量不可为空，且必须为非负数', 'warning');
                return;
              }
            }
          }

          //检测max和allocation之间的关系
          for (let i = 0; i < processNum; i++) {
            for (let j = 0; j < resourceNum; j++) {
              this.need[i * resourceNum + j] = this.max[i * resourceNum + j] -
                this.allocation[i * resourceNum + j];
              if (this.need[i * resourceNum + j] < 0) {
                this.promptMessage = this.notify('输入不合法，max值不能小于相对应的need值', 'error');
                return;
              }
            }
          }

          //资源总数必须大于所有进程已分配资源数之和
          for (let i = 0; i < resourceNum; i++) {
            let val = this.available[i]
            for (let j = 0; j < processNum; j++) {
              val -= this.allocation[j * resourceNum + i]
            }
            if (val < 0) {
              this.promptMessage = this.notify('资源总数必须大于所有进程已分配资源数之和', 'warning');
              return;
            }
          }

          //检测request输入本身的范围
          let inputVal = this.request[resourceNum];
          if (Number.isInteger(inputVal) && inputVal >= 0 && inputVal < processNum) {
            //从total变为available/work
            for (let i = 0; i < resourceNum; i++) {
              for (let j = 0; j < processNum; j++) {
                this.available[i] -= this.allocation[j * resourceNum + i]
              }
            }
            //检测request合法性
            let isRequestSuccess = this.requestInspect(this.available, this.max, this.allocation, this.need, this.request,
              this.securedSequence, processNum, resourceNum);
            if (isRequestSuccess == 1 || isRequestSuccess == 2) {
              //出错后恢复available，否则会一直递减
              for (let i = 0; i < resourceNum; i++) {
                for (let j = 0; j < processNum; j++) {
                  this.available[i] += this.allocation[j * resourceNum + i]
                }
              }
              if (isRequestSuccess == 1) {
                this.promptMessage = this.notify('所需资源数超过仍需资源数', 'error');
                return;
              }
              if (isRequestSuccess == 2) {
                this.promptMessage = this.notify('请求资源超过系统剩余', 'error');
                return;
              }
            }
            //执行到这里说明通过了所有的运算前检验
            this.editButtonStaus = false;
            this.promptMessage = this.$notify({
              title: '提示',
              message: '已通过将总资源数减去所有进程已分配资源数之和，得到了当前剩余资源数',
              type: 'info',
              offset: 50
            })
            this.securedSequence = [];
            this.returnedArray = this.getSolution(this.available, this.max, this.allocation, this.need, this.request,
              this.securedSequence,
              processNum, resourceNum);
          } else {
            this.promptMessage = this.notify('请求资源的进程号为应介于0-' + (processNum - 1) + '的整数', 'error');
          }
        } else {
          this.editButtonStaus = true;
          this.available = this.total.slice()
        }
      },
      // 清空
      clear() {
        this.editButtonStaus = true; // 清空后表格为可输入状态
        this.clickFrequency = 0; // 为去除高亮背景色
        this.max = [];
        this.available = [];
        this.total = [];
        this.allocation = [];
        this.need = [];
      },
      //不断点击展示求解过程
      stepCalculate() {
        this.clickFrequency = this.clickFrequency + 1;
        if (this.clickFrequency >= this.returnedArray.length) {
          this.clickFrequency = this.clickFrequency - 1;
          this.generateMessage()
          // this.closeNotify();
          // this.promptMessage = this.$notify({
          //   title: '计算完成',
          //   message: "您可回退查看或修改参数重新计算",
          //   type: 'success',
          //   offset: 50,
          //   duration: 0
          // });
          return 0;
        }
        //available、finish、SecuredSequence需实时更新,finish、SecuredSequence合并到了commonFill，而available不方便合并
        this.available = this.returnedArray[this.clickFrequency].Work.slice();

        const resourceNum = this.dataInputForm.resourceNum;
        const processNum = this.dataInputForm.processNum;
        //更新allocation列
        for (let i = 0; i < processNum; i++) {
          for (let j = 0; j < resourceNum; j++) {
            this.allocation = this.returnedArray[this.clickFrequency].Allo.slice();
          }
        }

        //更新need列
        for (let i = 0; i < processNum; i++) {
          for (let j = 0; j < resourceNum; j++) {
            this.need = this.returnedArray[this.clickFrequency].Ned.slice();
          }
        }
        this.commonFill();

        this.AlloHighlightLine = this.returnedArray[this.clickFrequency].AlloHighlightLine;
        this.AlloHighlightColumn = this.returnedArray[this.clickFrequency].AlloHighlightColumn;
        this.NedHighlightLine = this.returnedArray[this.clickFrequency].NedHighlightLine;
        this.NedHighlightColumn = this.returnedArray[this.clickFrequency].NedHighlightColumn;
        this.WorkHighlightLine = this.returnedArray[this.clickFrequency].WorkHighlightLine;
        this.WorkHighlightColumn = this.returnedArray[this.clickFrequency].WorkHighlightColumn;
        this.RequestHighlightLine = this.returnedArray[this.clickFrequency].RequestHighlightLine;
        this.RequestHighlightColumn = this.returnedArray[this.clickFrequency].RequestHighlightColumn;
        this.generateMessage();
      },
      // 自动求解
      autoStepCalculate() {
        if (this.autoButtonStaus) {
          this.autoButtonStaus = false
          // 其余按钮无法点击
          this.disableFillRandom = true
          this.disableInputSelf = true
          this.disableClear = true
          this.disableCalculate = true
          this.disableWithdraw = true

          this.timer = setInterval(() => {
            if (this.stepCalculate() === 0) {
              clearInterval(this.timer)
              this.autoButtonStaus = true
              this.disableFillRandom = false
              this.disableInputSelf = false
              this.disableClear = false
              this.disableCalculate = false
              this.disableWithdraw = false
            }
          }, 1200)
        } else {
          this.autoButtonStaus = true
          this.disableFillRandom = false
          this.disableInputSelf = false
          this.disableClear = false
          this.disableCalculate = false
          this.disableWithdraw = false
          clearInterval(this.timer)
        }
      },
      // 撤回
      withdraw() {
        if (this.clickFrequency) {
          this.clickFrequency = this.clickFrequency - 2;
          this.stepCalculate();
        } else {
          this.closeNotify();
          this.promptMessage = this.notify("当前状态无法撤回", 'warning');
        }
      }
    },
    watch: {
      editButtonStaus: function () {
        // 可手动输入时计算和撤回按钮无法点击
        if (this.editButtonStaus) {
          this.disableAutoCalculate = true;
          this.disableCalculate = true;
          this.disableWithdraw = true;
          this.initialWork = true;
        } else {
          this.disableAutoCalculate = false;
          this.disableCalculate = false;
          this.disableWithdraw = false;
          this.initialWork = false;
        }
      }
    },
    destroyed() {
      this.closeNotify();
    },
    components: {
      bankerCode
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .banker-right {
    display: flex;
    overflow: hidden;
    height: 100%;
    .data-input {
      width: 450px;
      height: 200px;
      padding: 80px 60px 50px 40px;
      margin: auto;
      .input-buttons {
        .confirm-input-button {
          margin: 0 20px 0 105px;
        }
      }
    }
    .banker-demo {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      overflow: auto;
      height: 100%;
      .result-table {
        margin: auto;
        padding: 30px 60px 25px 15px;
        .top {
          display: flex;
          .work-request-table {
            width: 500px;
            .work-table,
            .request-table {
              width: 450px;
              margin-bottom: 15px;
            }
          }
          .canvas {
            width: 400px;
            .work,
            .need {
              color: $color-theme;
              font-weight: 600;
              height: 140px;
              box-sizing: border-box;
              padding-left: 10px;
              position: relative;
              top: -0.3em;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              .process-num {
                text-decoration: underline;
              }
              .progress {
                display: inline-block;
                background-color: #ddd;
                height: 15px;
                border-radius: 1000px;
              }
            }
            .work {
              border-bottom: 1px solid $color-theme;
            }
          }
        }
        .work-table,
        .demo-table,
        .request-table {
          border-radius: 8px;
        }

        .suspended-balls {
          > :nth-child(1) {
            z-index: 2;
          }
          .collapsed-ball {
            opacity: 1;
          }
          .fill-data-ball {
            transform: translateY(-27em);
          }
          .edit-ball {
            transform: translateY(-22.5em);
          }
          .clear-ball {
            transform: translateY(-18em);
          }
          .auto-ball {
            transform: translateY(-13.5em);
          }
          .calculate-ball {
            transform: translateY(-9em);
          }
          .withdraw-ball {
            transform: translateY(-4.5em);
          }
          .disable-click {
            pointer-events: none;
            cursor: default;
            opacity: 0.4;
          }
        }
      }
    }

    .expand-button {
      position: absolute;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      font-size: 1.125rem; // padding:10px 6px;
      border: 1px solid $color-theme;
      background-color: $color-theme;
      color: #fff;
      opacity: 0.7;
      top: 30%;
      left: calc(100vw - 45px);
      writing-mode: vertical-lr;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      cursor: pointer;
      .text {
        position: relative;
        left: -50px;
        font-size: 1em;
        letter-spacing: 3px;
      }
      &:hover {
        opacity: 1;
      }
    }

    .code-area {
      @media only screen and (min-device-width: 1920px) {
        margin-left:200px;
        height: calc(100vh - 55px);
      }
      @media only screen and (min-device-width:1024px)and (max-device-width:1359px) {
        margin-left: 70px;
      }
      display: flex;
      flex-direction: column;
      position: fixed;
      margin-left:130px;
      margin-top:-46px;
      height: calc(100vh - 55px);
      border: 1px solid $color-dividingLine;
      background: #fff;
      box-shadow:-1px 0 60px #333;
      transition: .6s width ease-in-out;
      z-index: 10000;
      user-select: text;
      .algorithm-tab {
        height: 100%;
        overflow: auto;
      }
      .shrink-code-arrow {
        @media only screen and (min-device-width: 1920px) {
          margin-top:calc((100vh - 60px)*0.5);
        }
        position: fixed;
        margin-left:2px; //fixed定位后使用margin-left可基于父元素定位
        margin-top:calc((100vh - 55px)*0.5);
        cursor: pointer;
        opacity: 0.8;
        z-index: 2;
        [class^="el-icon-"] {
          font-size: 2rem;
          color: $color-theme;
          transition: 0.4s linear;
        }
        [class^="el-icon-"]:hover {
          transform: translateX(8px);
        }
      }
    }
    .code-area-wide {
      @media only screen and (min-device-width: 1920px) {
        width: calc(100vw - 200px - 66px - 4px);
      }
      @media only screen and (min-device-width:1024px)and (max-device-width:1359px) {
        width: calc(100% - 70px - 63px);
      }
      width: calc(100% - 130px - 66px);
    }
    .code-area-narrow {
      @media only screen and (min-device-width: 1920px) {
        width: calc(100vw - 200px - 200px + 4px);
      }
      @media only screen and (min-device-width:1024px)and (max-device-width:1359px) {
        width: calc(100vw - 70px - 190px);
      }
      width: calc(100vw - 130px - 192px);
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .banker-right {
    .data-input .el-input__inner {
      width: 250px;
    }
    .el-table th {
      padding: 8px 0;
    }
    .result-table {
      .el-input__inner {
        height: 2em;
        border: 2px solid #dcdcdc;
      }
    }

    .el-table .success-row {
      background: $color-success;
    }
    .onCompare {
      animation: onCompare 1.5s 1 forwards;
    }
    .hasFinish {
      animation: hasFinish 1.5s 1 forwards;
    }
    .onCompareError {
      animation: onCompareError 1.5s 1 forwards;
    }
  }

  @keyframes onCompare {
    0% {
      background-color: #fff;
    }
    100% {
      background-color: $color-theme3;
    }
  }

  @keyframes onCompareError {
    0% {
      background-color: #fff;
    }
    100% {
      background-color: $color-error;
    }
  }

  @keyframes hasFinish {
    0% {
      background-color: #fff;
    }
    100% {
      background-color: $color-success;
    }
  }
</style>
