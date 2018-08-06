<template>
  <section class="page-replace-right">
    <demo-code :codeAreaShow="codeAreaShow" @page-return="returnPage" @expand-code="expandCodeSelf" @shrink-code="shrinkCode">
      <el-steps :active="active" align-center finish-status="success" class="steps" :class="{'input-slideup':inputSlideUp}">
        <el-step title="输入参数" description="选择物理块数;输入页面号引用串,用0-9整数表示,以空格分隔"></el-step>
        <el-step title="计算缺页率" description="点击右下角的“计算缺页率”可计算缺页率"></el-step>
        <el-step title="查看代码" description="点击右侧的“查看代码”可查看算法实现"></el-step>
      </el-steps>

      <div class="input-area" :class="{'input-slideup':inputSlideUp}">
        <div class="selected-child-algorithm">当前子算法:{{selectedAlgorithmText}}</div>
        <el-form :inline="true" :model="dataInputForm" ref="dataInputForm" :rules="dataInputRules">
          <el-form-item prop="physicalBlockNum">
            <el-select v-model="dataInputForm.physicalBlockNum" class="physical-block-num-select" placeholder="请选择物理块数">
              <el-option v-for="item in generateTaskNumOptions()" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="referenceString">
            <el-input class="input-box" placeholder="请输入由0-9组成的页面号引用串,以空格分隔" prefix-icon="el-icon-edit" v-model="dataInputForm.referenceString"
              @textInput.native="checkInput" clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <transition-group name="blockTransition" tag="div" class="animate">
        <div class="block" v-for="col in blockArray.length" :key="col" v-show="blockArray[col-1].replaceIndex!=-1">
          <transition-group name="itemTransition" tag="div">
            <!-- 当前三个页面要显示在一个块里，要加下边的v-show，表示最少输入了一个数字，否则无数据输入也有一个块在那里，因为，如果无数据输入，referenceArray第一项是''，有数据输入则为对应数字，但均为字符串类型。无数据输入时要判断一下，且无法根据数据类型判断。绑定的class逻辑用来判断当前页面是否缺页 -->
            <div class="item" :class="{pageLack:item-1==blockArray[col-1].replaceIndex}" v-for="item in dataInputForm.physicalBlockNum"
              :key="item" v-show="referenceArray[0]!=''">{{blockArray[col-1].inUse[item-1] + (item-1==blockArray[col-1].replaceIndex?'+':'')}}</div>
          </transition-group>
        </div>
      </transition-group>

      <el-popover ref="popover" title="缺页率f为:" placement="left" width="100" trigger="click" :content="pageLackRate">
      </el-popover>
      <div v-show="buttonsShow" class="suspended-balls">
        <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" icon="el-icon-star-on"></el-button>
        <div class="suspended-ball" :class="{'calculate-ball':ballsStatus}" @click="calculateRate" v-popover:popover>
          <span>计算缺页率</span>
        </div>
      </div>
      <div slot="code">
        <algorithmOPT v-if="selectedAlgorithmIndex=='OPT'"></algorithmOPT>
        <algorithmFIFO v-if="selectedAlgorithmIndex=='FIFO'"></algorithmFIFO>
        <algorithmLRU v-if="selectedAlgorithmIndex=='LRU'"></algorithmLRU>
      </div>
    </demo-code>
  </section>
</template>

<script>
  import demoCode from "@/views/components/demo-code.vue"
  import mixin from '@/mixins/mixin'
  import algorithmOPT from "./algorithm/algorithmOPT.vue"
  import algorithmFIFO from "./algorithm/algorithmFIFO.vue"
  import algorithmLRU from "./algorithm/algorithmLRU.vue"
  import notify from '@/mixins/notify'
  export default {
    mixins: [mixin, notify],
    props: ['selectedAlgorithmIndex', 'selectedAlgorithmText'],
    data() {
      return {
        copyBtn: null,
        active: 0, //步骤条当前状态，为0表示第一步进行中，为1表示第一步完成
        inputSlideUp: false, //输入数据后初始界面上移
        dataInputForm: {
          physicalBlockNum: "", //物理块数量，即行数
          referenceString: "" //用户输入的数字序列
        },
        dataInputRules: {
          physicalBlockNum: [{
            required: true,
            message: "请选择物理块数",
            trigger: "blur"
          }],
          referenceString: [{
            required: true,
            message: "请输入引用串",
            trigger: "blur"
          }, {
            validator: (rule, value, callback) => {
              if (/\d{2,}/.test(value)) {
                callback(new Error("请输入0-9的整数"));
                setTimeout(() => {
                  this.dataInputForm.referenceString = this.dataInputForm.referenceString.replace(/\d{2,}/g,
                    "");
                }, 800); //放计时器里可以保证上句执行
              } else {
                callback();
              }
            },
            trigger: "blur"
          }, {
            //控制输入的数字间只有一个空格
            validator: (rule, value, callback) => {
              if (/\s{2,}/.test(value)) {
                callback(new Error('请输入数字，如结束输入，可点击"计算缺页率"按钮'));
                this.dataInputForm.referenceString = this.dataInputForm.referenceString.replace(/\s+/g, " ");
              } else {
                callback();
              }
            },
            trigger: "blur"
          }]
        },
        taskNumOptions: [], //作业数下拉框选项数组
        referenceArray: [], //数字序列直接转换的数组
        blockArray: [], //算法返回的数组，包括缺页的
        buttonsShow: false, //控制按钮是否展示
        memoryNum: 0, //列数，即缺页数
      };
    },
    computed: {
      pageLackRate: function () {
        return `${this.memoryNum} / ${this.referenceArray.length} = ${( this.memoryNum / this.referenceArray.length * 100 ).toFixed(2)}%`;
      }
    },
    methods: {
      changeChildAlgorithm() {
        this.publicAlgorithmFunction(); //切换算法时更新结果
      },
      publicAlgorithmFunction() {
        switch (this.selectedAlgorithmIndex) {
          case "OPT":
            this.blockArray = this.OPT(
              this.dataInputForm.physicalBlockNum,
              this.referenceArray
            );
            break;
          case "FIFO":
            this.blockArray = this.FIFO(
              this.dataInputForm.physicalBlockNum,
              this.referenceArray
            );
            break;
          case "LRU":
            this.blockArray = this.LRU(
              this.dataInputForm.physicalBlockNum,
              this.referenceArray
            );
            break;
        }
      },
      returnPage() {
        this.codeAreaShow = false;
        this.$emit('page-return');
      },
      expandCodeSelf() {
        this.expandCode();
        this.active = 3;
      },
      generateTaskNumOptions() {
        var resultArray = [];
        for (let i = 2; i < 6; i++) {
          resultArray.push({
            value: i,
            label: i
          });
        }
        return resultArray;
      },
      checkInput(event) {
        //只能输入空格或数字
        if (/^32|4[8-9]|5[0-7]$/g.test(event.data.charCodeAt(0)) === false) {
          event.preventDefault();
          this.$notify.closeAll()
          this.notify('输入有误，请输入0-9的整数,并用空格分隔', 'error');
        }
      },
      //当物理块数和引用串发生改变时进行数据验证
      dataValidate() {
        this.$refs.dataInputForm.validate(valid => {
          if (valid) {
            this.inputSlideUp = true;
            this.referenceArray = this.dataInputForm.referenceString
              .trim()
              .split(" ");
            this.publicAlgorithmFunction();
            //通过验证并且输入了数字才显示按钮，例外是只输入了空格
            if (/\d/.test(this.dataInputForm.referenceString)) {
              this.buttonsShow = true;
            }
          } else {
            //输入非法不通过验证时，不显示按钮
            this.buttonsShow = false;
          }
        });
      },
      calculateRate() {
        if (this.active != 3) {
          this.active = 2;
        }
      },
      //最佳置换算法
      OPT(number, pageList) {
        let inUse = [];
        let replaceTable = [];
        let memoryNum = 0;

        // 缺页中断时寻找被替换的页面
        function findIndex(array, start) {
          let compare = inUse.slice();
          for (let i = start; compare.length > 1 && i < array.length; i++) {
            let index = compare.indexOf(array[i]);
            if (index >= 0) {
              compare.splice(index, 1);
            }
          }
          return inUse.indexOf(compare[0]);
        }

        pageList.forEach((item, index, array) => {
          if (inUse.indexOf(item) >= 0) {
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex: -1
            });
          } else if (inUse.length < number) {
            this.memoryNum = ++memoryNum;
            inUse.push(item);
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex: inUse.length - 1
            });
          } else {
            this.memoryNum = ++memoryNum;
            let replaceIndex = findIndex(array, index + 1);
            inUse.splice(replaceIndex, 1, item);
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex
            });
          }
          for (let i = replaceTable[index].inUse.length; i < number; i++) {
            replaceTable[index].inUse[i] = "-";
          }
        });
        return replaceTable;
      },
      //先进先出页面置换算法
      FIFO(number, pageList) {
        let inUse = [];
        let replaceTable = [];
        let replaceIndex = 0;
        let memoryNum = 0;

        pageList.forEach((item, index, array) => {
          if (inUse.indexOf(item) >= 0) {
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex: -1
            });
          } else if (inUse.length < number) {
            this.memoryNum = ++memoryNum; //不能对data中变量直接自增
            inUse.push(item);
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex: inUse.length - 1
            });
          } else {
            this.memoryNum = ++memoryNum;
            inUse.splice(replaceIndex, 1, item);
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex: replaceIndex
            });
            replaceIndex = (replaceIndex + 1) % number;
          }
          for (let i = replaceTable[index].inUse.length; i < number; i++) {
            replaceTable[index].inUse[i] = "-";
          }
        });

        return replaceTable;
      },
      //最近最久未使用置换算法
      LRU(number, pageList) {
        let inUse = [];
        let stack = [];
        let replaceTable = [];
        let memoryNum = 0;

        pageList.forEach((item, index, array) => {
          if (inUse.indexOf(item) >= 0) {
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex: -1
            });
            stack.push(stack.splice(stack.indexOf(inUse.indexOf(item)), 1)[0]);
          } else if (inUse.length < number) {
            this.memoryNum = ++memoryNum;
            inUse.push(item);
            stack.push(inUse.length - 1);
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex: inUse.length - 1
            });
          } else {
            this.memoryNum = ++memoryNum;
            let replaceIndex = stack[0];
            inUse.splice(replaceIndex, 1, item);
            stack.push(stack.shift());
            replaceTable.push({
              inUse: inUse.slice(),
              replaceIndex
            });
          }
          for (let i = replaceTable[index].inUse.length; i < number; i++) {
            replaceTable[index].inUse[i] = "-";
          }
        });
        return replaceTable;
      }
    },
    components: {
      demoCode,
      algorithmOPT,
      algorithmFIFO,
      algorithmLRU
    },
    watch: {
      selectedAlgorithmIndex: function () {
        this.active = 0;
      },
      "dataInputForm.physicalBlockNum": function () {
        if (this.dataInputForm.referenceString) {
          this.dataValidate();
        }
      },
      "dataInputForm.referenceString": function () {
        if (this.dataInputForm.referenceString == "") {
          this.active = 0;
          //referenceString为空时，调用dataValidate不会通过验证，不会更新referenceArray，会残留第一个页面，所以手动重新计算一次referenceArray
          this.referenceArray = this.dataInputForm.referenceString
            .trim()
            .split(" ");
          this.publicAlgorithmFunction();
        }
        if (this.dataInputForm.physicalBlockNum) {
          this.dataValidate();
        }
      }
    },
    mounted() {
      this.changeChildAlgorithm();
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .page-replace-right {
    height: 100%;
    .steps,
    .input-area {
      transition: 0.4s linear;
    }

    .input-slideup {
      transform: translateY(-80px);
    }

    .steps {
      margin: 120px 0 0 0;
      min-height: 135px;
    }

    .input-area {
      .selected-child-algorithm {
        margin-bottom: 10px;
        color: $color-theme;
        font-weight: 600;
        font-size: 1.3em;
      }
      .physical-block-num-select {
        width: 160px;
      }
      .input-box {
        width: 450px;
      }
    }

    .animate {
      @media only screen and (min-device-width: 1920px) {
        margin: -50px auto 0 360px;
      }
      @media only screen and (min-device-width:1024px)and (max-device-width:1359px) {
        margin: -100px auto 0 80px;
      }
      margin: -70px auto 0 150px;
      max-width: 80%;
      .block {
        display: inline-flex;
        margin: 0 20px 10px 0;
        .item {
          border: 0.5px solid #000;
          padding: 20px 13px;
          text-align: center;
          font-weight: 600;
        }
        .pageLack {
          color: $color-theme;
          font-weight: 600;
        }
      }
    }

    .suspended-balls {
      .suspended-ball {
        >span {
          padding: 0.8em 0.5em;
        }
      }
      >:nth-child(1) {
        z-index: 2;
      }
      .collapsed-ball {
        opacity: 1;
      }
      .calculate-ball {
        transform: translateY(-4.5em);
      }
    }
  }

  .el-button {
    padding: 0;
  }

  .blockTransition-enter-active,
  .itemTransition-enter-active {
    animation: fadeInLeft 1s;
  }

  .blockTransition-leave-active,
  .itemTransition-leave-active {
    animation: fadeOutLeft 1s;
  }
</style>

<style lang="scss">
  //不限制作用域的style是修改了elementUI的样式,放在上边的style中不会生效
  @import "~@/styles/vars.scss";
  .page-replace-right {
    .el-steps {
      height: 117px;
    }

    .el-step__head.is-success {
      color: $color-theme;
      border-color: $color-theme;
    }

    .el-step__title {
      font-size: 1.25em;
    }

    .el-step__title.is-success {
      color: $color-theme;
      font-weight: 700;
    }

    .el-step__description {
      font-size: 1.2em;
      line-height: 1.4em;
    }

    .el-step__description.is-success {
      color: $color-theme;
    }

    .el-input__inner {
      border: 1px solid $color-theme;
      height: 2.5em;
      font-size: 1.125em;
    }

    .el-form-item__error {
      color: $color-theme;
    }
  }
</style>
