<template>
  <section class="processor-schedule-right">
    <demo-code :codeAreaShow="codeAreaShow" @page-return="returnPage" @expand-code="expandCode" @shrink-code="shrinkCode">
      <div v-if="!displayResultTable" class="data-input">
        <el-form label-width="140px" ref="dataInputForm" :model="dataInputForm" :rules="dataInputFormRules">
          <el-form-item prop="taskNum" label="作业数量">
            <el-select v-model="dataInputForm.taskNum" placeholder="请选择作业数量" prefix-icon="el-icon-edit" clearable>
              <el-option v-for="item in generateTaskNumOptions()" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item v-if="selectedAlgorithmIndex=='SRTF'" prop="unitRunTime" label="单位运行时间">
            <el-input v-model.number="dataInputForm.unitRunTime" placeholder="请输入单位运行时间"></el-input>
          </el-form-item>
          <div v-if="selectedAlgorithmIndex=='SRTF'" class="tips">
            注：处理机调度算法要求系统每运行一单位时间判断一次剩余时间最短的进程号
          </div> -->

          <el-form-item v-if="selectedAlgorithmIndex=='RR'" prop="timeBlock" label="时间块大小">
            <el-select v-model="dataInputForm.timeBlock" placeholder="请选择时间块大小" clearable>
              <el-option v-for="item in generateTimeBlockOptions()" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="input-buttons">
          <el-button type="primary" class="confirm-input-button" @click="confirmTaskNum" plain round>确定</el-button>
          <el-button type="primary" class="reset-button" @click="resetInputForm('dataInputForm')" plain round>重置</el-button>
        </div>
      </div>

      <div v-else class="result-table">
        <div class="selected-child-algorithm">当前子算法: {{selectedAlgorithmText}}</div>
        <el-table class="demo-table" ref="resultTable" :data="tableData" border highlight-current-row @current-change="handleCurrentChange">
          <el-table-column type="index" label="作业" width="55">
          </el-table-column>

          <el-table-column v-if="selectedAlgorithmIndex !== 'RR' && selectedAlgorithmIndex !== 'SRTF'" prop="commitTime" label="提交时间"
            width="135">
            <template slot-scope="scope">
              <el-input v-if="editButtonStatus" size="small" placeholder="请输入非负数" v-model.number="tableData[scope.$index].commitTime"></el-input>
              <span v-else>{{tableData[scope.$index].commitTime}}</span>
            </template>
          </el-table-column>

          <el-table-column v-else prop="commitTime" label="提交时间" width="135">
            <template slot-scope="scope">
              <el-input v-if="editButtonStatus" size="small" placeholder="请输入自然数" v-model.number="tableData[scope.$index].commitTime"></el-input>
              <span v-else>{{tableData[scope.$index].commitTime}}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="selectedAlgorithmIndex !== 'RR' && selectedAlgorithmIndex !== 'SRTF'" prop="runTime" label="运行时间"
            width="120">
            <template slot-scope="scope">
              <el-input v-if="editButtonStatus" size="small" placeholder="请输入正数" v-model.number="tableData[scope.$index].runTime"></el-input>
              <div v-else>{{tableData[scope.$index].runTime}}</div>
            </template>
          </el-table-column>

          <el-table-column v-else prop="runTime" label="运行时间" width="135">
            <template slot-scope="scope">
              <el-input v-if="editButtonStatus" size="small" placeholder="请输入正整数" v-model.number="tableData[scope.$index].runTime"></el-input>
              <span v-else>{{tableData[scope.$index].runTime}}</span>
            </template>
          </el-table-column>

          <el-table-column v-for="column in columns" :key="column.index" :prop="column.prop" :label="column.description" :width="column.width">
          </el-table-column>

          <el-table-column v-if="selectedAlgorithmIndex === 'SRTF'" prop="remainTime" label="剩余时间" width="145">
            <template slot-scope="scope">
              <div class="progress" :class="{'not-arrived': tableData[scope.$index].commitTime > currentTime}" :style="{'width': `${100 * tableData[scope.$index].remainTime / maxOfRuntime}px`}"></div>
              {{tableData[scope.$index].remainTime}}
            </template>
          </el-table-column>
        </el-table>

        <div class="suspended-balls">
          <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" type="primary" icon="el-icon-star-on"></el-button>
          <div class="suspended-ball" :class="{'random-ball':ballsStatus}" @click='randomFill'>
            <span>随机填值</span>
          </div>
          <div class="suspended-ball" :class="{'edit-ball':ballsStatus}" @click='editData'>
            <span>{{editButtonStatus?'完成输入':'手动输入'}}</span>
          </div>
          <div class="suspended-ball" :class="{'calculate-ball':ballsStatus}" @click="stepCalculate">
            <span>逐步计算</span>
          </div>
          <div class="suspended-ball" :class="{'clear-ball':ballsStatus}" @click="clearData">
            <span>清空数据</span>
          </div>
        </div>
      </div>
      <div slot="code">
        <algorithmFCFS v-if="selectedAlgorithmIndex=='FCFS'"></algorithmFCFS>
        <algorithmSJF v-if="selectedAlgorithmIndex=='SJF'"></algorithmSJF>
        <algorithmSRTF v-if="selectedAlgorithmIndex=='SRTF'"></algorithmSRTF>
        <algorithmHRRF v-if="selectedAlgorithmIndex=='HRRF'"></algorithmHRRF>
        <algorithmRR v-if="selectedAlgorithmIndex=='RR'"></algorithmRR>
      </div>
    </demo-code>
  </section>
</template>

<script>
  import demoCode from "@/views/components/demo-code.vue"
  import mixin from '@/mixins/mixin'
  import algorithmFCFS from "./algorithm/algorithmFCFS.vue"
  import algorithmSJF from "./algorithm/algorithmSJF.vue"
  import algorithmSRTF from "./algorithm/algorithmSRTF.vue"
  import algorithmHRRF from "./algorithm/algorithmHRRF.vue"
  import algorithmRR from "./algorithm/algorithmRR.vue"
  import notify from '@/mixins/notify'

  export default {
    mixins: [mixin, notify],
    props: ["selectedAlgorithmIndex", "selectedAlgorithmText"],
    data() {
      return {
        taskNumOptions: [],
        dataInputForm: {
          taskNum: "", //作业数
          timeBlock: "", //RR算法时间块个数
          unitRunTime: ""
        },
        dataInputFormRules: {
          taskNum: [{
            required: true,
            message: "请选择作业数",
            trigger: "blur"
          }],
          timeBlock: [{
            required: true,
            message: "请选择时间块大小",
            trigger: "blur"
          }],
          unitRunTime: [{
            required: true,
            message: "请输入单位运行时间",
            trigger: "blur"
          }, {
            validator: (rule, value, callback) => {
              if (/^[0-9]\d*(\.{0,1}\d+){0,1}$/.test(value) == false || value === 0) {
                callback(new Error('请输入正数'));
              } else {
                callback();
              }
            }
          }]
        },
        displayResultTable: false, //输入作业数后展示计算结果
        tableData: [], //表格内的数据
        commitTimeArray: [], //输入的提交时间数组，下同
        runTimeArray: [],
        maxOfRuntime: 0,
        columns: [], //表格列属性
        averageTurnOverTime: "", //平均周转时间
        averageWeightedTurnOverTime: "", //平均带权周转时间
        promptMessage: "",
        editButtonStatus: true, //"编辑"按钮状态，初始为“完成”，反之为“编辑”
        clickFrequency: 0, //“逐步计算”按钮被点击次数
        currentTime: 0
      };
    },
    methods: {
      //初始值随机生成函数
      fillRandom(number, isDigital = true) {
        var result = []
        for (var i = 0; i < number; i++) {
          result.push({
            commitTime: "",
            runTime: ""
          })
        }
        var count = 9 //count must be larger than number
        var commitTime = new Array()
        var runTime = new Array()
        for (var i = 0; i < count; i++) {
          commitTime[i] = (i + 1 + Math.random()).toFixed(1)
          runTime[i] = (Math.random() * 5 + 1).toFixed(1)
          if (isDigital == false) {
            commitTime[i] = (i + 1 + Math.random()).toFixed(0)
            runTime[i] = (Math.random() * 5 + 1).toFixed(0)
          }
        }
        commitTime.sort(function () {
          return 0.5 - Math.random()
        })
        runTime.sort(function () {
          return 0.5 - Math.random()
        })
        this.maxOfRuntime = Math.max(...runTime.slice(0, number))
        for (var i = 0; i < number; i++) {
          result[i].commitTime = parseFloat(commitTime[i])
          result[i].runTime = parseFloat(runTime[i])
        }
        return result
      },
      //选择算法，填充表格列，然后展示表格，为提取公共组件，统一了方法名
      changeChildAlgorithm() {
        this.dataInputForm.taskNum = ""; //换新的算法把输入框的值清空，下同
        this.dataInputForm.timeBlock = "";
        this.dataInputForm.unitRunTime = "";
        this.columns = [{
          prop: "startTime",
          description: "开始时间",
          width: '90'
        }, {
          prop: "finishTime",
          description: "完成时间",
          width: '90'
        }, {
          prop: "turnOverTime",
          description: "周转时间",
          width: '90'
        }, {
          prop: "weightedTurnOverTime",
          description: "带权周转时间",
          width: '120'
        }];
        if (this.selectedAlgorithmIndex == "SRTF") {
          this.columns.splice(
            0, 1, {
              prop: "startTime_1",
              description: "首次开始",
              width: '90'
            }, {
              prop: "startTime_2",
              description: "第二次开始",
              width: '105'
            }, {
              prop: "startTime_3",
              description: "第三次开始",
              width: '105'
            }
          );
        }
        if (this.selectedAlgorithmIndex == "HRRF") {
          this.columns.push({
            prop: "responseRatio",
            description: "响应比"
          });
        }
      },
      returnPage() {
        if (this.displayResultTable) {
          this.displayResultTable = false;
          this.dataInputForm.taskNum = ""; //返回时把输入框的值清空，下同
          this.dataInputForm.timeBlock = "";
          this.dataInputForm.unitRunTime = "";
          this.closeNotify();
        } else {
          this.$emit("page-return");
        }
      },
      publicAlgorithmFunction() {
        switch (this.selectedAlgorithmIndex) {
          case "FCFS":
            return this.FCFS(
              this.clickFrequency,
              this.dataInputForm.taskNum,
              this.commitTimeArray,
              this.runTimeArray
            );
          case "SJF":
            return this.SJF(
              this.clickFrequency,
              this.dataInputForm.taskNum,
              this.commitTimeArray,
              this.runTimeArray
            );
          case "SRTF":
            return this.SRTF(
              this.clickFrequency,
              this.dataInputForm.taskNum,
              this.commitTimeArray,
              this.runTimeArray,
              this.dataInputForm.unitRunTime
            );
          case "HRRF":
            return this.HRRF(
              this.clickFrequency,
              this.dataInputForm.taskNum,
              this.commitTimeArray,
              this.runTimeArray
            );
          case "RR":
            return this.RR(
              this.clickFrequency,
              this.dataInputForm.taskNum,
              this.commitTimeArray,
              this.runTimeArray,
              this.dataInputForm.timeBlock
            );
        }
      },
      generateTaskNumOptions() {
        var resultArray = [];
        for (let i = 3; i < 8; i++) {
          resultArray.push({
            value: i,
            label: i
          });
        }
        return resultArray;
      },
      generateTimeBlockOptions() {
        var resultArray = [];
        for (let i = 1; i < 6; i++) {
          resultArray.push({
            value: i,
            label: i
          });
        }
        return resultArray;
      },
      confirmTaskNum() {
        this.$refs.dataInputForm.validate(valid => {
          if (valid) {
            this.displayResultTable = true
            this.clearData()
            this.closeNotify()
            var initialData = []
            if (this.selectedAlgorithmIndex == "RR" || this.selectedAlgorithmIndex == "SRTF") {
              initialData = this.fillRandom(this.dataInputForm.taskNum, false)
            } else {
              initialData = this.fillRandom(this.dataInputForm.taskNum)
            }
            this.tableData.forEach((item, index, array) => {
              Object.assign(item, initialData[index])
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      randomFill() {
        this.clearData()
        this.closeNotify()
        var initialData = []
        if (this.selectedAlgorithmIndex == "RR" || this.selectedAlgorithmIndex == "SRTF") {
          initialData = this.fillRandom(this.dataInputForm.taskNum, false)
        } else {
          initialData = this.fillRandom(this.dataInputForm.taskNum)
        }
        this.tableData.forEach((item, index, array) => {
          Object.assign(item, initialData[index])
        })
      },
      editData() {
        if (this.editButtonStatus) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].commitTime === undefined ||
              this.tableData[i].runTime === undefined
            ) {
              this.closeNotify()
              this.promptMessage = this.notify("请输入提交时间和运行时间", "info")
              return
            }
            if (this.selectedAlgorithmIndex == 'RR' || this.selectedAlgorithmIndex == 'SRTF') {
              if (!/^\d+$/.test(this.tableData[i].commitTime) ||
                !/^[1-9]\d*$/.test(this.tableData[i].runTime)) {
                this.closeNotify()
                this.promptMessage = this.notify(
                  "提交时间需为自然数，运行时间需为正整数",
                  "error"
                )
                return
              }
            }
            if (!/^\d+(\.{0,1}\d+){0,1}$/.test(this.tableData[i].commitTime) ||
              !/^[0-9]\d*(\.{0,1}\d+){0,1}$/.test(this.tableData[i].runTime) ||
              this.tableData[i].runTime == 0) {
              this.closeNotify()
              this.promptMessage = this.notify(
                "提交时间需为非负数，运行时间需为正数",
                "error"
              )
              return
            }
          }
          this.editButtonStatus = false
          this.tableData.forEach((item, index, array) => {
            this.commitTimeArray[index] = item.commitTime
            this.runTimeArray[index] = item.runTime
          })
        } else {
          this.editButtonStatus = true
          this.clickFrequency = 0
        }
      },
      setCurrent(row) {
        this.$refs.resultTable.setCurrentRow(row);
      },
      //检验所有作业是否都执行完成,可通过检查是否有数据为空
      checkNotComplete() {
        if (this.selectedAlgorithmIndex == 'SRTF') {
          for (let rowObj of this.tableData) {
            if (rowObj.remainTime !== 0) {
              return true;
            }
          }
          return false;
        }
        for (let rowObj of this.tableData) {
          for (let key in rowObj) {
            if (rowObj[key] === "") {
              return true;
            }
          }
        }
        return false;
      },
      stepCalculate() {
        if (this.editButtonStatus) {
          this.closeNotify();
          this.promptMessage = this.notify('请先点击“完成输入”按钮', 'info');
          return;
        }
        //仍有作业未完成
        if (this.checkNotComplete() || this.clickFrequency == 0) {
          this.clickFrequency = this.clickFrequency + 1;
          var returnedCalResult = this.publicAlgorithmFunction().formatResult;
          this.tableData.forEach((item, index, array) => {
            Object.assign(item, returnedCalResult[index]);
          });
          this.setCurrent();
          setTimeout(() => {
            this.setCurrent(
              this.tableData[this.publicAlgorithmFunction().operateTashNum]
            );
          }, 100);
          this.averageTurnOverTime = this.publicAlgorithmFunction().averageTurnOverTime;
          this.averageWeightedTurnOverTime = this.publicAlgorithmFunction().averageweightedTurnOverTime;
          if (this.selectedAlgorithmIndex == 'SRTF') {
            this.closeNotify();
            this.currentTime = this.publicAlgorithmFunction().currentTime
            this.promptMessage = this.notify(`当前运行时刻: ${this.currentTime}`, 'info', 0);
          }
        }
        if (!this.checkNotComplete()) {
          this.closeNotify();
          this.promptMessage = this.notify(
            `计算完成,平均周转时间为 ${this.averageTurnOverTime},平均带权周转时间为 ${this.averageWeightedTurnOverTime}`, 'success', 0);
        }
      },
      clearData() {
        this.clickFrequency = 0;
        this.commitTimeArray = [];
        this.runTimeArray = [];
        this.tableData = this.publicAlgorithmFunction().formatResult;
        this.averageTurnOverTime = "";
        this.averageWeightedTurnOverTime = "";
        this.editButtonStatus = true;
        this.closeNotify();
        this.promptMessage = this.notify('数据已清空', 'success');
      },
      //先来先服务算法
      FCFS(clickFrequency, task_num, commit_time, task_time) {
        var i = 0,
          j = 0,
          temp = 0,
          k = 0,
          pos = 0;
        var temp_commit_time = [];
        var operator_order = [];
        var format_result = [];
        var fcfsObject = [];

        if (clickFrequency == 0) {
          //第一次调用，初始化，不进行计算
          for (i = 0; i < task_num; i++) {
            format_result.push({
              startTime: "",
              finishTime: "",
              turnOverTime: "",
              weightedTurnOverTime: ""
            });
          }
          fcfsObject.push({
            formatResult: "",
            averageTurnOverTime: "",
            averageweightedTurnOverTime: "",
            operateTashNum: ""
          });
          fcfsObject.formatResult = format_result;

          return fcfsObject;
        } else {
          for (
            i = 0; i < task_num; i++ //初始化
          ) {
            format_result.push({
              startTime: "",
              finishTime: "",
              turnOverTime: "",
              weightedTurnOverTime: ""
            });
          }
          fcfsObject.push({
            formatResult: "",
            averageTurnOverTime: "",
            averageweightedTurnOverTime: "",
            operateTashNum: ""
          });
          for (i = 0; i < task_num; i++) {
            temp_commit_time.push(commit_time[i]);
            operator_order.push(0);
          }

          for (
            i = 0; i < task_num; i++ //求得运算顺序
          ) {
            temp = Number.MAX_VALUE;
            for (j = 0; j < task_num; j++) {
              if (temp > temp_commit_time[j]) {
                temp = temp_commit_time[j];
                pos = j;
              }
            }
            temp_commit_time[pos] = Number.MAX_VALUE;
            operator_order[i] = pos;
          }
          format_result[operator_order[0]].startTime = parseFloat(
            commit_time[operator_order[0]].toFixed(2)
          );
          format_result[operator_order[0]].finishTime = parseFloat(
            (
              commit_time[operator_order[0]] + task_time[operator_order[0]]
            ).toFixed(2)
          );
          format_result[operator_order[0]].turnOverTime = parseFloat(
            (
              format_result[operator_order[0]].finishTime -
              commit_time[operator_order[0]]
            ).toFixed(2)
          );
          format_result[operator_order[0]].weightedTurnOverTime = parseFloat(
            (
              format_result[operator_order[0]].turnOverTime /
              task_time[operator_order[0]]
            ).toFixed(2)
          );
          k = clickFrequency <= task_num ? clickFrequency : task_num;
          for (i = 1; i < k; i++) {
            format_result[operator_order[i]].startTime =
              format_result[operator_order[i - 1]].finishTime;
            if (
              format_result[operator_order[i]].startTime <
              commit_time[operator_order[i]]
            )
              format_result[operator_order[i]].startTime =
              commit_time[operator_order[i]];
            format_result[operator_order[i]].startTime = parseFloat(
              format_result[operator_order[i]].startTime.toFixed(2)
            );
            format_result[operator_order[i]].finishTime = parseFloat(
              (
                format_result[operator_order[i]].startTime +
                task_time[operator_order[i]]
              ).toFixed(2)
            );
            format_result[operator_order[i]].turnOverTime = parseFloat(
              (
                format_result[operator_order[i]].finishTime -
                commit_time[operator_order[i]]
              ).toFixed(2)
            );
            format_result[operator_order[i]].weightedTurnOverTime = parseFloat(
              (
                format_result[operator_order[i]].turnOverTime /
                task_time[operator_order[i]]
              ).toFixed(2)
            );
          }
          fcfsObject.formatResult = format_result;
          fcfsObject.operateTashNum = operator_order[k - 1];
          if (clickFrequency == task_num) {
            fcfsObject.averageTurnOverTime = 0;
            fcfsObject.averageweightedTurnOverTime = 0;
            for (i = 0; i < task_num; i++) {
              fcfsObject.averageweightedTurnOverTime +=
                format_result[i].weightedTurnOverTime;
              fcfsObject.averageTurnOverTime += format_result[i].turnOverTime;
            }
            fcfsObject.averageTurnOverTime = parseFloat(
              (fcfsObject.averageTurnOverTime / task_num).toFixed(2)
            );
            fcfsObject.averageweightedTurnOverTime = parseFloat(
              (fcfsObject.averageweightedTurnOverTime / task_num).toFixed(2)
            );
          }
        }

        return fcfsObject;
      },
      //最短作业优先算法
      SJF(clickFrequency, task_num, commit_time, task_time) {
        var i = 0,
          j = 0,
          temp = 0,
          k = 0,
          pos = 0;
        var temp_commit_time = []; //临时存储提交时间
        var temp_task_time = []; //临时存储运行时间
        var operate_order_temp = []; //对提交的进程按时间顺序排序
        var operate_order = []; //求得最终的运行顺序
        var format_result = []; //输出结果到数组
        var total_operate_time = 0; //到目前为止所经历的总时间
        var time_one = 0,
          time_two = 0; //辅助计算到目前位置所经历的总时间
        var max_range = 0; //当前时间内到达的进程个数
        var min = 0;
        var flag = 0; //是否找到进程
        var sjfObject = [];

        if (clickFrequency == 0) {
          //第一次调用，初始化，不进行计算
          for (i = 0; i < task_num; i++) {
            format_result.push({
              startTime: "",
              finishTime: "",
              turnOverTime: "",
              weightedTurnOverTime: ""
            });
          }

          sjfObject.push({
            formatResult: "",
            averageTurnOverTime: "",
            averageweightedTurnOverTime: "",
            operateTashNum: ""
          });
          sjfObject.formatResult = format_result;

          return sjfObject;
        } else {
          for (
            i = 0; i < task_num; i++ //初始化
          ) {
            format_result.push({
              startTime: "",
              finishTime: "",
              turnOverTime: "",
              weightedTurnOverTime: ""
            });
          }
          sjfObject.push({
            formatResult: "",
            averageTurnOverTime: "",
            averageweightedTurnOverTime: "",
            operateTashNum: ""
          });
          for (i = 0; i < task_num; i++) {
            temp_commit_time.push(commit_time[i]); //拷贝提交的时间副本
            temp_task_time.push(task_time[i]); //拷贝运行时间副本
            operate_order_temp.push(0); //初始化
            operate_order.push(-1);
          }
          for (
            i = 0; i < task_num; i++ //按时间顺序对进程排序
          ) {
            temp = Number.MAX_VALUE;
            for (j = 0; j < task_num; j++) {
              if (temp > temp_commit_time[j]) {
                temp = temp_commit_time[j];
                pos = j;
              }
            }
            temp_commit_time[pos] = Number.MAX_VALUE;
            operate_order_temp[i] = pos;
          }

          operate_order[0] = operate_order_temp[0]; //首先运行第一个到来的进程
          temp_task_time[operate_order[0]] = -1; //第一个到来的进程已经被计算
          total_operate_time = commit_time[operate_order[0]]; //到目前为止所经历的总时间
          format_result[operate_order[0]].startTime = parseFloat(
            commit_time[operate_order[0]].toFixed(2)
          );
          format_result[operate_order[0]].finishTime = parseFloat(
            (commit_time[operate_order[0]] + task_time[operate_order[0]]).toFixed(
              2
            )
          );
          format_result[operate_order[0]].turnOverTime = parseFloat(
            (
              format_result[operate_order[0]].finishTime -
              commit_time[operate_order[0]]
            ).toFixed(2)
          );
          format_result[operate_order[0]].weightedTurnOverTime = parseFloat(
            (
              format_result[operate_order[0]].turnOverTime /
              task_time[operate_order[0]]
            ).toFixed(2)
          );
          sjfObject.formatResult = format_result;
          sjfObject.operateTashNum = operate_order[0];
          if (clickFrequency == 1) return sjfObject;
          for (i = 1; i < task_num; i++) {
            time_one = total_operate_time + task_time[operate_order[i - 1]];
            time_two =
              commit_time[operate_order[i - 1]] + task_time[operate_order[i - 1]];
            total_operate_time = time_one < time_two ? time_two : time_one; //total_operate_time就是finishTime
            max_range = 0;
            for (j = 0; j < task_num; j++) {
              if (commit_time[operate_order_temp[j]] <= total_operate_time)
                max_range++;
              else break;
            }
            min = Number.MAX_VALUE;
            for (j = 1; j < max_range; j++) {
              if (temp_task_time[operate_order_temp[j]] == -1) continue;
              if (min > temp_task_time[operate_order_temp[j]]) {
                min = temp_task_time[operate_order_temp[j]];
                pos = j;
                flag = 1;
              }
            }
            if (flag == 0) {
              operate_order[i] = operate_order_temp[max_range];
              temp_task_time[operate_order[i]] = -1;
              total_operate_time = commit_time[operate_order[i]];
            } else {
              operate_order[i] = operate_order_temp[pos];
              temp_task_time[operate_order[i]] = -1;
            }
            flag = 0;
          }
          k = clickFrequency <= task_num ? clickFrequency : task_num;
          for (i = 1; i < k; i++) {
            format_result[operate_order[i]].startTime =
              format_result[operate_order[i - 1]].finishTime;
            if (
              format_result[operate_order[i]].startTime <
              commit_time[operate_order[i]]
            )
              format_result[operate_order[i]].startTime =
              commit_time[operate_order[i]];
            format_result[operate_order[i]].startTime = parseFloat(
              format_result[operate_order[i]].startTime.toFixed(2)
            );
            format_result[operate_order[i]].finishTime = parseFloat(
              (
                format_result[operate_order[i]].startTime +
                task_time[operate_order[i]]
              ).toFixed(2)
            );
            format_result[operate_order[i]].turnOverTime = parseFloat(
              (
                format_result[operate_order[i]].finishTime -
                commit_time[operate_order[i]]
              ).toFixed(2)
            );
            format_result[operate_order[i]].weightedTurnOverTime = parseFloat(
              (
                format_result[operate_order[i]].turnOverTime /
                task_time[operate_order[i]]
              ).toFixed(2)
            );
          }
          sjfObject.formatResult = format_result;
          sjfObject.operateTashNum = operate_order[k - 1];
          if (clickFrequency == task_num) {
            sjfObject.averageTurnOverTime = 0;
            sjfObject.averageweightedTurnOverTime = 0;
            for (i = 0; i < task_num; i++) {
              sjfObject.averageweightedTurnOverTime +=
                format_result[i].weightedTurnOverTime;
              sjfObject.averageTurnOverTime += format_result[i].turnOverTime;
            }
            sjfObject.averageTurnOverTime = parseFloat(
              (sjfObject.averageTurnOverTime / task_num).toFixed(2)
            );
            sjfObject.averageweightedTurnOverTime = parseFloat(
              (sjfObject.averageweightedTurnOverTime / task_num).toFixed(2)
            );
          }
        }

        return sjfObject;
      },
      //最短剩余时间优先算法
      SRTF(clickFrequency, task_num, commit_time, task_time) {
        var i, j;
        var flag = 0; //flag为0意为作业未全部完成，而当所有works的finish_time全不为""时，则将flag置为1，SRTF算法结束
        var temp = [0, 0]; //临时变量，用于存储当前剩余时间最短的作业的作业号和时间
        var works = [];
        var temp_2, temp_3; //用于给周转时间和带权周转时间求和
        var running_log = []; //运行记录，记录每一秒钟运行的作业id
        var fmtrst = []; //formatResult临时变量
        //对于clickFrequency为0的特殊情况，返回空对象
        if (clickFrequency === 0) {
          for (j = 0; j < task_num; j++) {
            fmtrst.push({
              startTime_1: '',
              startTime_2: '',
              startTime_3: '',
              finishTime: '',
              turnOverTime: '',
              weightedTurnOverTime: '',
              remainTime: ''
            })
          }
          running_log.push({
            formatResult: fmtrst.slice(0),
            averageTurnOverTime: '',
            averageweightedTurnOverTime: '',
            operateTashNum: '',
            currentTime: ''
          });
          return running_log[clickFrequency]
        }
        //初始化
        for (j = 0; j < task_num; j++) //设置初始值
        {
          works.push({
            work_id: j,
            commitTime: commit_time[j],
            run_time: task_time[j],
            remain_time: task_time[j],
            startTime_1: "",
            startTime_2: "",
            startTime_3: "",
            finish_time: "",
            turnOverTime: "",
            weightedTurnOverTime: ""
          });
        }
        //封装返回的对象（初始化的情况）
        for (j = 0; j < task_num; j++) {
          fmtrst.push({
            startTime_1: works[j].startTime_1,
            startTime_2: works[j].startTime_2,
            startTime_3: works[j].startTime_3,
            finishTime: works[j].finish_time,
            turnOverTime: works[j].turnOverTime,
            weightedTurnOverTime: works[j].weightedTurnOverTime,
            remainTime: works[j].remain_time
          })
        }
        running_log.push({
          formatResult: fmtrst.slice(0),
          averageTurnOverTime: '',
          averageweightedTurnOverTime: '',
          operateTashNum: '',
          currentTime: ''
        });
        //开始SRTF计算
        for (i = 0; flag == 0; i++) //每次循环模拟系统运行的一个单位时间
        {
          fmtrst = [] //每个“新的一单位时间”，清空临时变量
          temp[0] = ""; //每个“新的一单位时间”，将temp作业号初始化为""
          temp[1] = 10000; //每个“新的一单位时间”，将temp的剩余时间初始化为10000（一个极大值）

          for (j = 0; j < task_num; j++) //选择这一单位时间运行的作业（寻找剩余时间最短的作业执行）
          {
            if ((works[j].finish_time === "") && (i >= works[j].commitTime)) //如果works[j].finish_time为""，则说明j作业仍未完成。同时要保证当前系统时间i>=作业提交时间
            {
              if (works[j].remain_time < temp[1]) //选取目前遇到的最小的剩余时间的作业作为temp，当j循环全部结束，temp中保存的就是最小剩余时间的作业的信息
              {
                temp[0] = j;
                temp[1] = works[j].remain_time;
              }
            }
          }

          if (temp[0] !== "") {
            if (works[temp[0]].startTime_1 === "") {
              works[temp[0]].startTime_1 = i; //如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间
            } else if (running_log[running_log.length - 1].operateTashNum !== temp[0]) {
              if (works[temp[0]].startTime_2 === "") {
                works[temp[0]].startTime_2 = i;
              } else if (works[temp[0]].startTime_3 === "") {
                works[temp[0]].startTime_3 = i;
              }
            }
            works[temp[0]].remain_time = works[temp[0]].remain_time - 1; //该作业剩余时间减1
            if (works[temp[0]].remain_time == 0) {
              works[temp[0]].finish_time = i + 1; //如果该作业运行完这一秒后剩余时间为0，则将下一秒设为该作业的结束时间
              works[temp[0]].turnOverTime = parseFloat((works[temp[0]].finish_time - works[temp[0]].commitTime).toFixed(
                2));
              works[temp[0]].weightedTurnOverTime = parseFloat((works[temp[0]].turnOverTime / works[temp[0]].run_time).toFixed(
                2));
            }
            // console.log("present_time: " + (i+1) + ", running_id: " + (temp[0]+1));
            //封装返回的对象
            for (j = 0; j < task_num; j++) {
              fmtrst.push({
                startTime_1: works[j].startTime_1,
                startTime_2: works[j].startTime_2,
                startTime_3: works[j].startTime_3,
                finishTime: works[j].finish_time,
                turnOverTime: works[j].turnOverTime,
                weightedTurnOverTime: works[j].weightedTurnOverTime,
                remainTime: works[j].remain_time
              })
            }
            running_log.push({
              formatResult: fmtrst.slice(0),
              averageTurnOverTime: '',
              averageweightedTurnOverTime: '',
              operateTashNum: temp[0],
              currentTime: (i + 1).toString()
            });
          }

          flag = 1; //先假设全部作业均运行完成
          for (j = 0; j < task_num; j++) //循环全部作业，确认是否全部运行完成（找出是否有作业仍未完成）
          {
            if (works[j].finish_time === "") {
              flag = 0;
              break;
            }
          }
          if (flag == 1) {
            fmtrst = [] //由于后面要重新装载fmtrst，故先清空之前插入的值
            temp_2 = 0;
            temp_3 = 0;
            for (j = 0; j < task_num; j++) //计算平均周转时间和平均带权周转时间
            {
              temp_2 += works[j].turnOverTime;
              temp_3 += works[j].weightedTurnOverTime;
            }
            running_log[running_log.length - 1].averageTurnOverTime = parseFloat((temp_2 / task_num).toFixed(2));
            running_log[running_log.length - 1].averageweightedTurnOverTime = parseFloat((temp_3 / task_num).toFixed(2));
          }
        }
        //根据clickFrequency返回运行结果
        if (clickFrequency <= running_log.length - 1) {
          return running_log[clickFrequency]
        } else {
          return false; //如果clickFrequency超出范围，则返回false
        }
      },
      //最高响应比优先算法
      HRRF(clickFrequency, task_num, commit_time, task_time) {
        var i = 0,
          j = 0,
          temp = 0,
          k = 0,
          pos = 0;
        var temp_commit_time = []; //临时存储提交时间
        var operate_order_temp = []; //对提交的进程按时间顺序排序
        var operate_order = []; //求得最终的运行顺序
        var format_result = []; //输出结果到数组
        var response_ratio = []; //比例
        var response_ratio_to_fill = []; //每次用来填充的相应比
        var need_operate = [];
        var total_operate_time = 0; //到目前为止所经历的总时间
        var time_one = 0,
          time_two = 0; //辅助计算到目前位置所经历的总时间
        var max_range = 0; //当前时间内到达的进程个数
        var max = 0;
        var flag = 0; //是否找到进程
        var hrrfObject = [];

        if (clickFrequency == 0) {
          //第一次调用，初始化，不进行计算
          for (i = 0; i < task_num; i++) {
            format_result.push({
              startTime: "",
              finishTime: "",
              turnOverTime: "",
              weightedTurnOverTime: "",
              responseRatio: ""
            });
          }
          hrrfObject.push({
            formatResult: "",
            averageTurnOverTime: "",
            averageweightedTurnOverTime: "",
            operateTashNum: ""
          });
          hrrfObject.formatResult = format_result;

          return hrrfObject;
        } else {
          for (
            i = 0; i < task_num; i++ //初始化
          ) {
            format_result.push({
              startTime: "",
              finishTime: "",
              turnOverTime: "",
              weightedTurnOverTime: "",
              responseRatio: ""
            });
          }
          hrrfObject.push({
            formatResult: "",
            averageTurnOverTime: "",
            averageweightedTurnOverTime: "",
            operateTashNum: ""
          });
          for (i = 0; i < task_num; i++) {
            temp_commit_time.push(commit_time[i]); //拷贝提交的时间副本
            operate_order_temp.push(0); //初始化
            operate_order.push(-1);
            need_operate.push(0);
            response_ratio.push();
            response_ratio_to_fill.push(0);
          }

          for (
            i = 0; i < task_num; i++ //按时间顺序对进程排序
          ) {
            temp = Number.MAX_VALUE;
            for (j = 0; j < task_num; j++) {
              if (temp > temp_commit_time[j]) {
                temp = temp_commit_time[j];
                pos = j;
              }
            }
            temp_commit_time[pos] = Number.MAX_VALUE;
            operate_order_temp[i] = pos;
          }

          operate_order[0] = operate_order_temp[0]; //首先运行第一个到来的进程
          need_operate[0] = -1; //第一个到来的进程已经被计算
          total_operate_time = commit_time[operate_order[0]]; //到目前为止所经历的总时间
          response_ratio[0] = 1; //第一个到达的进程相应比为1
          format_result[operate_order[0]].startTime = parseFloat(
            commit_time[operate_order[0]].toFixed(2)
          );
          format_result[operate_order[0]].finishTime = parseFloat(
            (commit_time[operate_order[0]] + task_time[operate_order[0]]).toFixed(
              2
            )
          );
          format_result[operate_order[0]].turnOverTime = parseFloat(
            (
              format_result[operate_order[0]].finishTime -
              commit_time[operate_order[0]]
            ).toFixed(2)
          );
          format_result[operate_order[0]].weightedTurnOverTime = parseFloat(
            (
              format_result[operate_order[0]].turnOverTime /
              task_time[operate_order[0]]
            ).toFixed(2)
          );
          format_result[operate_order[0]].responseRatio = parseFloat(
            response_ratio[0].toFixed(2)
          );
          hrrfObject.formatResult = format_result;
          hrrfObject.operateTashNum = operate_order[0];
          if (clickFrequency == 1) return hrrfObject;
          for (i = 1; i < task_num; i++) {
            time_one = total_operate_time + task_time[operate_order[i - 1]];
            time_two =
              commit_time[operate_order[i - 1]] + task_time[operate_order[i - 1]];
            total_operate_time = time_one < time_two ? time_two : time_one; //total_operate_time就是finishTime
            max_range = 0;
            for (j = 0; j < task_num; j++) {
              if (commit_time[operate_order_temp[j]] <= total_operate_time)
                max_range++;
              else break;
            }
            for (j = 1; j < max_range; j++) {
              if (need_operate[j] == -1) continue;
              else
                response_ratio[j] = Number(
                  1 + Number(
                    (total_operate_time - commit_time[operate_order_temp[j]]) /
                    task_time[operate_order_temp[j]]
                  )
                ).toFixed(2); //响应比=1+等待时间/要求服务的时间
            }
            max = Number.MIN_VALUE;
            for (j = 1; j < max_range; j++) {
              if (need_operate[j] == -1) continue;
              if (max < response_ratio[j]) {
                max = response_ratio[j];
                pos = j;
                flag = 1;
              }
            }
            if (flag == 0) {
              operate_order[i] = operate_order_temp[max_range];
              need_operate[max_range] = -1;
              total_operate_time = commit_time[operate_order[i]];

              response_ratio[max_range] = 1;
              format_result[operate_order[i]].responseRatio = 1;
            } else {
              operate_order[i] = operate_order_temp[pos];
              need_operate[pos] = -1;
            }
            flag = 0;
            if (i + 1 == clickFrequency) {
              //保存第i次的相应比
              for (j = 0; j < max_range; j++) {
                response_ratio_to_fill[j] = parseFloat(response_ratio[j]);
              }
              temp = max_range;
            }
          }

          k = clickFrequency <= task_num ? clickFrequency : task_num;
          for (i = 1; i < k; i++) {
            format_result[operate_order[i]].startTime = parseFloat(
              format_result[operate_order[i - 1]].finishTime.toFixed(2)
            );
            if (
              format_result[operate_order[i]].startTime <
              commit_time[operate_order[i]]
            )
              format_result[operate_order[i]].startTime =
              commit_time[operate_order[i]];
            format_result[operate_order[i]].startTime = parseFloat(
              format_result[operate_order[i]].startTime.toFixed(2)
            );
            format_result[operate_order[i]].finishTime = parseFloat(
              (
                format_result[operate_order[i]].startTime +
                task_time[operate_order[i]]
              ).toFixed(2)
            );
            format_result[operate_order[i]].turnOverTime = parseFloat(
              (
                format_result[operate_order[i]].finishTime -
                commit_time[operate_order[i]]
              ).toFixed(2)
            );
            format_result[operate_order[i]].weightedTurnOverTime = parseFloat(
              (
                format_result[operate_order[i]].turnOverTime /
                task_time[operate_order[i]]
              ).toFixed(2)
            );
          }
          for (i = 1; i < (temp < task_num ? temp : task_num); i++) {
            format_result[operate_order_temp[i]].responseRatio = parseFloat(
              response_ratio_to_fill[i].toFixed(2)
            );
          }
          hrrfObject.formatResult = format_result;
          hrrfObject.operateTashNum = operate_order[k - 1];
          if (clickFrequency == task_num) {
            hrrfObject.averageTurnOverTime = 0;
            hrrfObject.averageweightedTurnOverTime = 0;
            for (i = 0; i < task_num; i++) {
              hrrfObject.averageweightedTurnOverTime +=
                format_result[i].weightedTurnOverTime;
              hrrfObject.averageTurnOverTime += format_result[i].turnOverTime;
            }
            hrrfObject.averageTurnOverTime = parseFloat(
              (hrrfObject.averageTurnOverTime / task_num).toFixed(2)
            );
            hrrfObject.averageweightedTurnOverTime = parseFloat(
              (hrrfObject.averageweightedTurnOverTime / task_num).toFixed(2)
            );
          }
        }

        return hrrfObject;
      },
      //时间片轮转算法
      RR(clickFrequency, task_num, commit_time, task_time, time_block) {
        var i, j, k;
        var flag_1 = 0; //flag_1为0意为作业未全部完成，而当所有works的finish_time全不为""时，则将flag_1置为1，SRTF算法结束
        var flag_2 = 0; //flag_2为0意味着未找到当前时间符合运行条件的作业，则时间需向前推进1秒（再次寻找）
        var temp_2, temp_3; //用于给周转时间和带权周转时间求和
        var temp_4; //用于临时记录操作的行号
        var works = [];
        var running_log = []; //运行记录，记录每一秒钟运行的作业id
        var fmtrst = []; //formatResult临时变量
        var averageTurnOverTime = "";
        var averageweightedTurnOverTime = "";
        //对于clickFrequency为0的特殊情况，返回空对象
        if (clickFrequency === 0) {
          for (k = 0; k < task_num; k++) {
            fmtrst.push({
              startTime: "",
              finishTime: "",
              turnOverTime: "",
              weightedTurnOverTime: ""
            });
          }
          running_log.push({
            formatResult: fmtrst.slice(0),
            averageTurnOverTime: "",
            averageweightedTurnOverTime: "",
            operateTashNum: ""
          });
          return running_log[clickFrequency];
        }
        //初始化
        for (
          i = 0; i < task_num; i++ //设置初始值
        ) {
          works.push({
            work_id: i,
            commitTime: commit_time[i],
            run_time: task_time[i],
            remain_time: task_time[i],
            start_time: "",
            finish_time: "",
            turnOverTime: "",
            weightedTurnOverTime: ""
          });
        }
        //封装返回的对象（初始化的情况）
        for (k = 0; k < task_num; k++) {
          fmtrst.push({
            startTime: works[k].start_time,
            finishTime: works[k].finish_time,
            turnOverTime: works[k].turnOverTime,
            weightedTurnOverTime: works[k].weightedTurnOverTime
          });
        }
        running_log.push({
          formatResult: fmtrst.slice(0),
          averageTurnOverTime: "",
          averageweightedTurnOverTime: "",
          operateTashNum: ""
        });
        //开始RR计算
        i = 0;
        while (flag_1 == 0) {
          flag_2 = 0;
          for (j = 0; j < task_num; j++) {
            fmtrst = []; //每一次新的运行前，清空临时变量
            if (works[j].remain_time && i >= works[j].commitTime) {
              //如果works[j].remain_time不为0，则说明j作业仍未完成。同时要保证当前系统时间i>=作业提交时间
              flag_2 = 1; //找到符合要求的作业，则将flag_2置为1
              if (works[j].remain_time <= time_block) {
                // 由于剩余时间小于等于时间片长度，则本次运行时间为该作业剩余时间
                // console.log("present_time: " + i + ", running_id: " + (j+1) + ", running_time:" + works[j].remain_time + "\n");
                if (works[j].start_time === "") works[j].start_time = i; //如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间
                i += works[j].remain_time; // 当前时间需加上本次运行的时间
                works[j].remain_time -= works[j].remain_time; //剩余时间需减去本次运行的时间
                works[j].finish_time = i; //作业运行完成，设置该作业的结束时间
                works[j].turnOverTime = parseFloat(
                  (works[j].finish_time - works[j].commitTime).toFixed(2)
                );
                works[j].weightedTurnOverTime = parseFloat(
                  (works[j].turnOverTime / works[j].run_time).toFixed(2)
                );
              } else {
                // 由于剩余时间大于时间片长度，则本次运行时间为时间片长度
                // console.log("present_time: " + i + ", running_id: " + (j+1) + ", running_time:" + time_block + "\n");
                if (works[j].start_time === "") works[j].start_time = i; //如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间
                i += time_block; // 当前时间需加上本次运行的时间
                works[j].remain_time -= time_block; //剩余时间需减去本次运行的时间
              }
              //封装返回的对象（初始化的情况）
              for (k = 0; k < task_num; k++) {
                fmtrst.push({
                  startTime: works[k].start_time,
                  finishTime: works[k].finish_time,
                  turnOverTime: works[k].turnOverTime,
                  weightedTurnOverTime: works[k].weightedTurnOverTime
                });
              }
              running_log.push({
                formatResult: fmtrst.slice(0),
                averageTurnOverTime: "",
                averageweightedTurnOverTime: "",
                operateTashNum: j
              });
            }
          }

          if (flag_2 == 0) {
            //flag_1_2为0意味着未找到当前时间符合运行条件的作业，则时间需向前推进1秒（可能是当前时间点已无作业可进行，而有的作业尚未提交，故向前推进1秒并再次寻找）
            i++;
          }

          flag_1 = 1; //先假设全部作业均运行完成
          for (
            j = 0; j < task_num; j++ //循环全部作业，确认是否全部运行完成（找出是否有作业仍未完成）
          ) {
            if (works[j].finish_time === "") {
              flag_1 = 0;
              break;
            }
          }
          if (flag_1 == 1) {
            temp_2 = 0;
            temp_3 = 0;
            for (
              j = 0; j < task_num; j++ //计算平均周转时间和平均带权周转时间
            ) {
              temp_2 += works[j].turnOverTime;
              temp_3 += works[j].weightedTurnOverTime;
            }
            running_log[running_log.length - 1].averageTurnOverTime = parseFloat(
              (temp_2 / task_num).toFixed(2)
            );
            running_log[
              running_log.length - 1
            ].averageweightedTurnOverTime = parseFloat(
              (temp_3 / task_num).toFixed(2)
            );
          }
        }
        //根据clickFrequency返回运行结果
        if (clickFrequency <= running_log.length - 1) {
          return running_log[clickFrequency];
        } else {
          return false; //如果clickFrequency超出范围，则返回false
        }
      }
    },
    components: {
      demoCode,
      algorithmFCFS,
      algorithmSJF,
      algorithmSRTF,
      algorithmHRRF,
      algorithmRR
    },
    mounted() {
      this.changeChildAlgorithm();
    },
    destroyed() {
      this.closeNotify();
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .processor-schedule-right {
    height: 100%;
    width: 100%;
    .data-input {
      width: 450px;
      height: 250px;
      padding: 60px 60px 30px 40px;
      margin: auto;
      .tips {
        font-size: 0.9em;
        box-sizing: border-box;
        margin: 0 0 10px;
        width: 400px;
        padding-left: 140px;
        color: $color-white;
        line-height: 1.5;
      }
      .input-buttons {
        .confirm-input-button {
          margin: 0 15px 0 104px;
        }
      }
    }

    .result-table {
      margin: auto;
      .selected-child-algorithm {
        margin: 0 0 20px 1px;
        color: $color-theme;
        font-weight: 800;
        font-size: 1.3em;
      }
      .demo-table {
        border-radius: 15px;
        .progress {
          display: inline-block;
          background-color: #409EFF;
          height: 15px;
          border-radius: 1000px;
        }
        .not-arrived {
          background-color: #ddd;
        }
      }
      .suspended-balls {
        > :nth-child(1) {
          z-index: 2;
        }
        .collapsed-ball {
          opacity: 1;
        }
        .random-ball {
          transform: translateY(-18em);
        }
        .edit-ball {
          transform: translateY(-13.5em);
        }
        .calculate-ball {
          transform: translateY(-9em);
        }
        .clear-ball {
          transform: translateY(-4.5em);
        }
      }
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .processor-schedule-right {
    .data-input {
      .el-input__inner {
        width: 250px;
      }
    }
    .result-table {
      .el-input__inner {
        height: 2.5em;
        border: 2px solid #DCDCDC;
      }
      .el-table--group,
      .el-table--border {
        border: 1px solid $color-dividingLine;
      }
      .el-table__body tr.current-row>td {
        background-color: rgba(90, 140, 180, 0.4);
        transition: .3s ease-in-out;
      }
    }
  }
</style>
