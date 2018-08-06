<template>
  <section class="disk-schedule-right">
    <demo-code :codeAreaShow="codeAreaShow" @page-return="returnPage" @expand-code="expandCode" @shrink-code="shrinkCode">
      <div v-show="!displayResultTable" class="data-input">
        <el-form label-width="140px" :model="dataInputForm" ref="dataInputForm" :rules="dataInputFormRules">
          <el-form-item prop="initialTrack" label="初始磁道号">
            <el-input placeholder="请输入0-200的整数" prefix-icon="el-icon-edit" v-model.number="dataInputForm.initialTrack" @keyup.enter.native="confirmInput"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item prop="trackString" label="需访问的磁道号">
            <el-input placeholder="请输入0-200的整数，以空格分隔" prefix-icon="el-icon-edit" v-model="dataInputForm.trackString" @keyup.enter.native="confirmInput"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item v-if="selectedAlgorithmIndex==='SCAN'||selectedAlgorithmIndex==='CSCAN'" prop="scanInitialDirection" label="磁头扫描方向">
            <el-select v-model.number="dataInputForm.scanInitialDirection" placeholder="请选择磁头扫描初始移动方向" prefix-icon="el-icon-edit" clearable>
              <el-option v-for="item in generateDirectionOptions()" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="input-buttons">
          <el-button type="primary" class="confirm-input-button" @click="confirmInput" plain round>确定</el-button>
          <el-button type="primary" class="random-input-button" @click="randomInput" plain round>随机填值</el-button>
          <el-button type="primary" class="reset-button" @click="resetInputForm('dataInputForm')" plain round>重置</el-button>
        </div>
      </div>

      <div v-show="displayResultTable" class="result-table">
        <div class="disk-simulation">
          <canvas ref="canvas" :width="width" :height="height"></canvas>
        </div>
        <div class="data-display">
          <div class="selected-child-algorithm">当前子算法:{{selectedAlgorithmText}}</div>
          <el-table class="table" :data="showListTable" border>
            <el-table-column prop="showList" :label="showListName" align="center" class="table-column">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="bottom">
                  <p>蓝色表示未被访问，灰色表示已被访问过</p>
                  <div slot="reference">
                    <span v-for="item in showList" :key="item.index" :class="[item[1] ? 'not-accessed' : accessed, 'num']">
                      {{item[0]}}&nbsp;
                    </span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <el-table class="table" :data="tableData" border>
            <el-table-column type="index" :label="`从${dataInputForm.initialTrack}号磁道开始`">
              <el-table-column prop="nextPosition" label="被访问的下一个磁道号" width="200" align="center">
              </el-table-column>
              <el-table-column prop="movingDistance" label="移动距离(磁道数)" width="200" align="center">
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>

        <div class="suspended-balls">
          <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" type="primary" icon="el-icon-star-on"></el-button>
          <div class="suspended-ball" :class="{'calculate-ball':ballsStatus, 'disable-click': disableCalculate}" @click="stepCalculate">
            <span>逐步计算</span>
          </div>
          <div class="suspended-ball" :class="{'clear-ball':ballsStatus, 'disable-click': disableRestart}" @click="restart">
            <span>重新开始</span>
          </div>
        </div>
      </div>
      <div slot="code">
        <algorithmFCFS v-if="selectedAlgorithmIndex=='FCFS'"></algorithmFCFS>
        <algorithmSSTF v-if="selectedAlgorithmIndex=='SSTF'"></algorithmSSTF>
        <algorithmSCAN v-if="selectedAlgorithmIndex=='SCAN'"></algorithmSCAN>
        <algorithmCSCAN v-if="selectedAlgorithmIndex=='CSCAN'"></algorithmCSCAN>
      </div>
    </demo-code>
  </section>
</template>

<script>
  import demoCode from "@/views/components/demo-code.vue"
  import algorithmFCFS from "./algorithm/algorithmFCFS.vue"
  import algorithmSSTF from "./algorithm/algorithmSSTF.vue"
  import algorithmSCAN from "./algorithm/algorithmSCAN.vue"
  import algorithmCSCAN from "./algorithm/algorithmCSCAN.vue"
  import mixin from '@/mixins/mixin'
  import notify from '@/mixins/notify'
  import {
    isArrayDuplicate
  } from '@/utils'

  export default {
    mixins: [mixin, notify],
    props: ['selectedAlgorithmIndex', 'selectedAlgorithmText'],
    data() {
      return {
        displayResultTable: false,
        dataInputForm: {
          initialTrack: "",
          trackString: "",
          scanInitialDirection: ""
        },
        dataInputFormRules: {
          initialTrack: [{
            required: true,
            message: "请输入初始磁道号位置",
            trigger: "blur"
          }, {
            validator: (rule, value, callback) => {
              if (/^([1-9]?\d|1\d{2}|200)$/.test(value)) {
                callback();
              } else {
                callback(new Error("请输入0-200的整数"))
              }
            },
            trigger: 'blur'
          }],
          trackString: [{
            required: true,
            message: "请输入需访问的磁道号",
            trigger: "blur"
          }, {
            validator: (rule, value, callback) => {
              if (/^\s*([1-9]?\d|1\d{2}|200)(\s+([1-9]?\d|1\d{2}|200))*\s*$/.test(value)) {
                callback();
              } else {
                callback(new Error("请输入0-200的整数，以空格分隔"))
              }
            },
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              var trackArray = value.trim().split(/\s+/);
              for (let i = 0; i < trackArray.length; i++) {
                trackArray[i] = parseInt(trackArray[i]);
              }
              if (isArrayDuplicate(trackArray)) {
                callback(new Error("请勿输入相同的磁道号"));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }],
          scanInitialDirection: [{
            required: true,
            message: "请选择磁头扫描初始移动方向",
            trigger: "blur"
          }]
        },
        trackArray: [],
        showListTable: [],
        tableData: [],
        averageTime: "",
        disableCalculate: false,
        disableRestart: true,
        clickFrequency: 0,
        width: 500,
        height: 500,
        ctx: null,
        diskList: [],
        radius: 0,
        showListName: '',
        showList: [],
        timer: null
      };
    },
    methods: {
      returnPage() {
        if (this.displayResultTable) {
          this.displayResultTable = false;
          this.dataInputForm.initialTrack = '';
          this.dataInputForm.trackString = '';
          this.dataInputForm.scanInitialDirection = '';

          this.diskList = []
          this.tableData = [];
          this.showListTable = []
          this.averageTime = '';
          this.clickFrequency = 0;
          this.disableCalculate = false;
          clearInterval(this.timer)
          this.ctx.clearRect(-this.width / 2, -this.width / 2, this.width, this.width);
          this.generateDisc();
        } else {
          this.$emit('page-return');
        }
        this.$notify.closeAll()
      },
      generateDirectionOptions() {
        let resultArray = [];
        resultArray.push({
          value: 1,
          label: "正方向(磁道号增大方向)"
        });
        resultArray.push({
          value: 0,
          label: "反方向(磁道号减小方向)"
        });
        return resultArray;
      },
      confirmInput() {
        this.$refs.dataInputForm.validate(valid => {
          if (valid) {
            this.trackArray = this.dataInputForm.trackString.trim().split(/\s+/);
            for (let i = 0; i < this.trackArray.length; i++) {
              this.trackArray[i] = parseInt(this.trackArray[i]);
            }
            this.tableData = [];
            this.averageTime = '';
            this.clickFrequency = 0;
            this.displayResultTable = true;

            this.radius = this.dataInputForm.initialTrack
            this.generateInitialTrack()
            this.generateShowList()
          }
        });
      },
      randomInput() {
        this.dataInputForm.initialTrack = 100;
        this.dataInputForm.trackString = '';
        var random_num_list = [];
        var flag = 0;
        var upper_limit = 190;
        var lower_limit = 10;
        do {
          flag = 1;
          var new_random_int = parseInt(Math.random() * (upper_limit - lower_limit - 2) + lower_limit + 1).toString();
          for (var num of random_num_list) {
            if (Math.abs(num - new_random_int) < 10) {
              flag = 0;
            }
          }
          if (Math.abs(this.dataInputForm.initialTrack - new_random_int) < 10) {
            flag = 0;
          }
          if (flag == 1) {
            random_num_list.push(new_random_int)
          }
        } while (random_num_list.length < 8);

        for (let i = 0; i < 8; i++) {
          this.dataInputForm.trackString = this.dataInputForm.trackString + random_num_list[i].toString() +
            ' ';
        }
      },
      publicAlgorithmFunction() {
        switch (this.selectedAlgorithmIndex) {
          case "FCFS":
            return this.FCFS(
              this.trackArray,
              this.trackArray.length,
              this.dataInputForm.initialTrack,
              this.clickFrequency
            );
          case "SSTF":
            return this.SSTF(
              this.trackArray,
              this.trackArray.length,
              this.dataInputForm.initialTrack,
              this.clickFrequency
            );
          case "SCAN":
            return this.SCAN(
              this.trackArray,
              this.trackArray.length,
              this.dataInputForm.initialTrack,
              this.dataInputForm.scanInitialDirection,
              this.clickFrequency
            );
          case "CSCAN":
            return this.CSCAN(
              this.trackArray,
              this.trackArray.length,
              this.dataInputForm.initialTrack,
              this.dataInputForm.scanInitialDirection,
              this.clickFrequency
            );
        }
      },
      generateShowList() {
        let returnValue = this.publicAlgorithmFunction();
        this.showListName = returnValue.showListName
        this.showList = returnValue.showList
        this.showListTable = []
        this.showListTable.push({
          showList: returnValue.showList
        })
      },
      stepCalculate() {
        this.disableCalculate = true;
        if (this.tableData.length >= this.trackArray.length) {
          this.$notify({
            message: `计算完成，平均寻道长度为 ${this.averageTime}`,
            type: 'success',
            offset: 50,
            showClose: true
          })
          this.radius = this.dataInputForm.initialTrack
          this.disableRestart = false;
          return;
        }
        this.clickFrequency = this.clickFrequency + 1;
        this.generateShowList();
        let returnValue = this.publicAlgorithmFunction();
        this.diskList.push(returnValue.nextPosition);
        this.draw();
        if (returnValue) {
          this.tableData.push(returnValue);
          this.averageTime = returnValue.averageTime;
        }
      },
      //生成画布及初始化
      generateCanvas() {
        var canvas = this.$refs.canvas;
        this.ctx = canvas.getContext("2d");

        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 2;

        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillRect(0, 0, this.width, this.width);

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'rgba(83,119,145,1)';
        this.ctx.translate(this.width / 2, this.width / 2);

        this.generateDisc();
      },
      //绘制网状磁盘
      generateDisc() {
        this.ctx.lineWidth = 1;
        //先绘制中间颜色较浅的圆环和半径
        this.ctx.strokeStyle = '#ddd';
        for (let i = 1; i < 5; i++) {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 20 + i * 40, this.degToRad(0), this.degToRad(360));
          this.ctx.stroke();
        }
        for (let i = 0; i < 12; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, 0)
          this.ctx.lineTo(220 * Math.cos(this.degToRad(i * 30)), 220 * Math.sin(this.degToRad(i * 30)))
          this.ctx.stroke();
        }

        //后绘制最里圈和最外圈颜色较深的，不至于被覆盖
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#aaa';
        this.ctx.font = "15px Helvetica";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 20, this.degToRad(0), this.degToRad(360));
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, 220, this.degToRad(0), this.degToRad(360));
        this.ctx.fillText(200, 220, 0);
        this.ctx.stroke();

        //绘制文字说明
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#537791';
        this.ctx.font = "600 25px Helvetica";
        this.ctx.fillText('磁盘模拟图', -180, -230)
        this.ctx.font = "16px Helvetica";
        this.ctx.fillText('磁道', 255 * Math.cos(this.degToRad(-45)), 250 * Math.sin(this.degToRad(-43)));
        this.ctx.moveTo(230 * Math.cos(this.degToRad(-45)), 230 * Math.sin(this.degToRad(-45)))
        this.ctx.lineTo(170 * Math.cos(this.degToRad(-45)), 170 * Math.sin(this.degToRad(-45)))
        this.ctx.lineTo(178 * Math.cos(this.degToRad(-47)), 178 * Math.sin(this.degToRad(-47)))
        this.ctx.lineTo(170 * Math.cos(this.degToRad(-45)), 170 * Math.sin(this.degToRad(-45)))
        this.ctx.lineTo(178 * Math.cos(this.degToRad(-43)), 178 * Math.sin(this.degToRad(-43)))
        this.ctx.stroke();
      },
      //绘制初始磁道号圈
      generateInitialTrack() {
        this.ctx.font = "15px Helvetica";
        this.ctx.beginPath();
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = '#C1ECE8';
        this.ctx.shadowColor = '#f0fdff';
        this.ctx.arc(0, 0, (this.dataInputForm.initialTrack + 20), this.degToRad(0), this.degToRad(360));
        this.ctx.fillText(this.dataInputForm.initialTrack, (this.dataInputForm.initialTrack + 20), 0);
        this.ctx.stroke();
      },
      draw() {
        this.timer = setInterval(() => {
          let isLast = false;
          let difference = this.diskList[this.clickFrequency - 1] - (this.clickFrequency > 1 ? this.diskList[this.clickFrequency -
            2] : this.dataInputForm.initialTrack)
          this.radius = this.radius + difference / Math.abs(difference);
          if (this.radius === this.diskList[this.clickFrequency - 1]) {
            isLast = true;
          }
          this.paintTrack(isLast)
          if (this.radius === this.diskList[this.clickFrequency - 1]) {
            clearInterval(this.timer)
          }
        }, 20);
      },
      paintTrack(isLast) {
        this.ctx.clearRect(-this.width / 2, -this.width / 2, this.width, this.width);
        this.generateDisc();
        this.generateInitialTrack();

        for (let i = 0; i < this.clickFrequency - 1; i++) {
          this.ctx.beginPath();
          let val = this.diskList[i]
          let deg = (i + 1) * 10
          this.ctx.arc(0, 0, (val + 20), this.degToRad(0), this.degToRad(360));
          this.ctx.fillText(val, (val + 20) * Math.cos(this.degToRad(deg)), (val + 20) * Math.sin(this.degToRad(deg)));
          this.ctx.stroke();
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#67A6C0';
        this.ctx.arc(0, 0, (this.radius + 20), this.degToRad(0), this.degToRad(360));
        if (isLast) {
          let deg = this.clickFrequency * 10
          this.ctx.fillText(this.diskList[this.clickFrequency - 1], (this.radius + 20) * Math.cos(this.degToRad(deg)),
            (this.radius + 20) * Math.sin(this.degToRad(deg)));
          this.disableCalculate = false;
        }
        this.ctx.stroke();
      },
      degToRad(degree) {
        var factor = Math.PI / 180;
        return degree * factor;
      },
      restart() {
        this.disableRestart = true;
        this.tableData = [];
        this.clickFrequency = 0;
        this.diskList = []
        this.generateShowList();
        this.ctx.clearRect(-this.width / 2, -this.width / 2, this.width, this.width);
        this.generateDisc();
        this.generateInitialTrack();
        this.radius = this.dataInputForm.initialTrack
        this.disableCalculate = false;
      },
      //先来先服务算法
      FCFS(input, list_size, initial_position, clickFrequency) {
        var i, k;
        var position = initial_position;
        var total_moving = 0;
        var moving_distance = 0;
        var sort_list = [];
        var running_log = [];
        sort_list = input.slice(0);
        sort_list.sort(function sortNumber(a, b) {
          return a - b
        });

        var show_list = [];
        for (var item of input) {
          show_list.push([item, true])
        }

        running_log.push({
          showListName: '输入的磁道号序列',
          showList: JSON.parse(JSON.stringify(show_list)),
          sortList: sort_list.slice(0),
          nextPosition: '',
          movingDistance: '',
          averageTime: ''
        });

        for (i = 0; i < list_size; i++) {
          moving_distance = Math.abs(input[i] - position);
          total_moving += moving_distance;
          position = input[i];
          // 修改show_list中的值
          for (k = 0; k < show_list.length; k++) {
            if (show_list[k][0] == position) {
              show_list[k][1] = false;
              break;
            }
          }

          running_log.push({
            showListName: '输入的磁道号序列',
            showList: JSON.parse(JSON.stringify(show_list)),
            sortList: sort_list.slice(0),
            nextPosition: position,
            movingDistance: moving_distance,
            averageTime: ''
          });
        }
        running_log[list_size].averageTime = parseFloat((total_moving / list_size).toFixed(2));

        //根据clickFrequency返回运行结果
        if (clickFrequency <= running_log.length - 1) {
          return running_log[clickFrequency]
        } else {
          return false; //如果clickFrequency超出范围，则返回false
        }
      },
      //最短寻道时间优先
      SSTF(input, list_size, initial_position, clickFrequency) {
        var i, j, k;
        var position = initial_position;
        var total_moving = 0;
        var moving_distance = 0;
        var sort_list = [];
        var sort_list_cp = [];
        var running_log = [];
        sort_list = input.slice(0);
        sort_list.sort(function sortNumber(a, b) {
          return a - b
        });
        sort_list_cp = sort_list.slice(0);

        var show_list = [];
        for (var item of sort_list) {
          show_list.push([item, true])
        }

        running_log.push({
          showListName: '排序后的磁道号序列',
          showList: JSON.parse(JSON.stringify(show_list)),
          sortList: sort_list.slice(0),
          nextPosition: '',
          movingDistance: '',
          averageTime: ''
        });

        for (i = 0; i < list_size; i++) {
          j = 0;
          for (j = 0; j < sort_list_cp.length; j++) {
            if (sort_list_cp[j] >= position) {
              if (j >= 1) {
                if (Math.abs(sort_list_cp[j] - position) <= Math.abs(sort_list_cp[j - 1] - position)) {
                  moving_distance = Math.abs(sort_list_cp[j] - position);
                  total_moving += moving_distance;
                  position = sort_list_cp[j];
                  sort_list_cp.splice(j, 1);
                  break;
                } else {
                  moving_distance = Math.abs(sort_list_cp[j - 1] - position);
                  total_moving += moving_distance;
                  position = sort_list_cp[j - 1];
                  sort_list_cp.splice(j - 1, 1);
                  break;
                }
              } else {
                moving_distance = Math.abs(sort_list_cp[j] - position);
                total_moving += moving_distance;
                position = sort_list_cp[j];
                sort_list_cp.splice(j, 1);
                break;
              }
            } else if ((j + 1) == sort_list_cp.length) {
              moving_distance = Math.abs(sort_list_cp[j] - position);
              total_moving += moving_distance;
              position = sort_list_cp[j];
              sort_list_cp.splice(j, 1);
              break;
            }
          }
          // 修改show_list中的值
          for (k = 0; k < show_list.length; k++) {
            if (show_list[k][0] == position) {
              show_list[k][1] = false;
              break;
            }
          }
          running_log.push({
            showListName: '排序后的磁道号序列',
            showList: JSON.parse(JSON.stringify(show_list)),
            sortList: sort_list.slice(0),
            nextPosition: position,
            movingDistance: moving_distance,
            averageTime: ''
          });
        }
        running_log[list_size].averageTime = parseFloat((total_moving / list_size).toFixed(2));

        //根据clickFrequency返回运行结果
        if (clickFrequency <= running_log.length - 1) {
          return running_log[clickFrequency]
        } else {
          return false; //如果clickFrequency超出范围，则返回false
        }
      },
      //扫描(SCAN)算法
      SCAN(input, list_size, initial_position, initial_direction, clickFrequency) {
        var i, j, k;
        var position = initial_position;
        var direction = initial_direction;
        var total_moving = 0;
        var moving_distance = 0;
        var sort_list = [];
        var sort_list_cp = [];
        var running_log = [];
        sort_list = input.slice(0);
        sort_list.sort(function sortNumber(a, b) {
          return a - b
        });
        sort_list_cp = sort_list.slice(0);

        var show_list = [];
        for (var item of sort_list) {
          show_list.push([item, true])
        }

        running_log.push({
          showListName: '排序后的磁道号序列',
          showList: JSON.parse(JSON.stringify(show_list)),
          sortList: sort_list.slice(0),
          nextPosition: '',
          movingDistance: '',
          averageTime: ''
        });

        for (i = 0; i < list_size; i++) {
          j = 0;
          for (j = 0; j < sort_list_cp.length; j++) {
            if (sort_list_cp[j] >= position) {
              if (j >= 1) {
                if ((direction == 1) || (sort_list_cp[j] == position)) {
                  moving_distance = Math.abs(sort_list_cp[j] - position);
                  total_moving += moving_distance;
                  position = sort_list_cp[j];
                  sort_list_cp.splice(j, 1);
                  break;
                } else {
                  moving_distance = Math.abs(sort_list_cp[j - 1] - position);
                  total_moving += moving_distance;
                  position = sort_list_cp[j - 1];
                  sort_list_cp.splice(j - 1, 1);
                  break;
                }
              } else {
                if (direction == 0)
                  direction = 1;
                moving_distance = Math.abs(sort_list_cp[j] - position);
                total_moving += moving_distance;
                position = sort_list_cp[j];
                sort_list_cp.splice(j, 1);
                break;
              }
            } else if ((j + 1) == sort_list_cp.length) {
              if (direction == 1)
                direction = 0;
              moving_distance = Math.abs(sort_list_cp[j] - position);
              total_moving += moving_distance;
              position = sort_list_cp[j];
              sort_list_cp.splice(j, 1);
              break;
            }
          }
          // 修改show_list中的值
          for (k = 0; k < show_list.length; k++) {
            if (show_list[k][0] == position) {
              show_list[k][1] = false;
              break;
            }
          }
          running_log.push({
            showListName: '排序后的磁道号序列',
            showList: JSON.parse(JSON.stringify(show_list)),
            sortList: sort_list.slice(0),
            nextPosition: position,
            movingDistance: moving_distance,
            averageTime: ''
          });
        }
        running_log[list_size].averageTime = parseFloat((total_moving / list_size).toFixed(2));

        //根据clickFrequency返回运行结果
        if (clickFrequency <= running_log.length - 1) {
          return running_log[clickFrequency]
        } else {
          return false; //如果clickFrequency超出范围，则返回false
        }
      },
      //循环扫描(CSCAN)算法
      CSCAN(input, list_size, initial_position, initial_direction, clickFrequency) {
        var i, j, k;
        var position = initial_position;
        var total_moving = 0;
        var moving_distance = 0;
        var sort_list = [];
        var sort_list_cp = [];
        var running_log = [];
        sort_list = input.slice(0);
        sort_list.sort(function sortNumber(a, b) {
          return a - b
        });
        sort_list_cp = sort_list.slice(0);

        var show_list = [];
        for (var item of sort_list) {
          show_list.push([item, true])
        }

        running_log.push({
          showListName: '排序后的磁道号序列',
          showList: JSON.parse(JSON.stringify(show_list)),
          sortList: sort_list.slice(0),
          nextPosition: '',
          movingDistance: '',
          averageTime: ''
        });

        for (i = 0; i < list_size; i++) {
          j = 0;
          for (j = 0; j < sort_list_cp.length; j++) {
            if (sort_list_cp[j] >= position) {
              if (j >= 1) {
                if ((initial_direction == 1) || (sort_list_cp[j] == position)) {
                  moving_distance = Math.abs(sort_list_cp[j] - position);
                  total_moving += moving_distance;
                  position = sort_list_cp[j];
                  sort_list_cp.splice(j, 1);
                  break;
                } else {
                  moving_distance = Math.abs(sort_list_cp[j - 1] - position);
                  total_moving += moving_distance;
                  position = sort_list_cp[j - 1];
                  sort_list_cp.splice(j - 1, 1);
                  break;
                }
              } else {
                if (initial_direction == 0) {
                  moving_distance = Math.abs(sort_list_cp[sort_list_cp.length - 1] - position);
                  total_moving += Math.abs(sort_list_cp[sort_list_cp.length - 1] - position);
                  position = sort_list_cp[sort_list_cp.length - 1];
                  sort_list_cp.splice(sort_list_cp.length - 1, 1);
                  break;
                } else {
                  moving_distance = Math.abs(sort_list_cp[j] - position);
                  total_moving += moving_distance;
                  position = sort_list_cp[j];
                  sort_list_cp.splice(j, 1);
                  break;
                }
              }
            } else if ((j + 1) == sort_list_cp.length) {
              if (initial_direction == 1) {
                moving_distance = Math.abs(sort_list_cp[0] - position);
                total_moving += moving_distance;
                position = sort_list_cp[0];
                sort_list_cp.splice(0, 1);
                break;
              } else {
                moving_distance = Math.abs(sort_list_cp[j] - position);
                total_moving += moving_distance;
                position = sort_list_cp[j];
                sort_list_cp.splice(j, 1);
                break;
              }
            }
          }
          // 修改show_list中的值
          for (k = 0; k < show_list.length; k++) {
            if (show_list[k][0] == position) {
              show_list[k][1] = false;
              break;
            }
          }
          running_log.push({
            showListName: '排序后的磁道号序列',
            showList: JSON.parse(JSON.stringify(show_list)),
            sortList: sort_list.slice(0),
            nextPosition: position,
            movingDistance: moving_distance,
            averageTime: ''
          });
        }
        running_log[list_size].averageTime = parseFloat((total_moving / list_size).toFixed(2));

        //根据clickFrequency返回运行结果
        if (clickFrequency <= running_log.length - 1) {
          return running_log[clickFrequency]
        } else {
          return false; //如果clickFrequency超出范围，则返回false
        }
      }
    },
    components: {
      demoCode,
      algorithmFCFS,
      algorithmSSTF,
      algorithmSCAN,
      algorithmCSCAN
    },
    mounted() {
      this.generateCanvas();
    },
    destroyed() {
      this.$notify.closeAll()
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .disk-schedule-right {
    height: 100%;
    .data-input {
      width: 550px;
      height: 280px;
      padding: 60px 60px 30px 40px;
      margin: auto;
      .input-buttons {
        .confirm-input-button {
          margin: 0 10px 0 120px;
        }
        .random-input-button {
          width: 110px;
          font-size: 1rem;
          margin-right: 10px;
        }
      }
    }

    .result-table {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .data-display {
        box-sizing: border-box;
        height: 100%;
        padding-top: 20px;
        .selected-child-algorithm {
          margin: 0 0 10px 1px;
          color: $color-theme;
          font-weight: 600;
          font-size: 1.4em;
        }
        .table {
          border-radius: 10px;
          margin-bottom: 15px;
          .not-accessed {
            color: #67A6C0;
            font-weight: 600;
          }
          .accessed {
            color: #C1ECE8;
            font-weight: 600;
          }
          .num {
            font-size: 17px;
          }
        }
      }
      .suspended-balls {
        >:nth-child(1) {
          z-index: 2;
        }
        .collapsed-ball {
          opacity: 1;
        }
        .calculate-ball {
          transform: translateY(-9em);
        }
        .clear-ball {
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
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .disk-schedule-right {
    .data-input {
      .el-form-item__label {
        width: 180px !important;
      }
      .el-form-item__content {
        margin-left: 180px !important;
      }
      .el-input__inner {
        width: 400px;
      }
    }
    .el-table--border th:first-child .cell,
    .el-table--border td:first-child .cell {
      word-break: keep-all;
    }
  }
</style>
