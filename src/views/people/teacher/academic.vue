<template>
  <div class="academic" v-loading="loading" element-loading-text="正在加载中">
    <div class="academicList" v-loading="exportLoading" element-loading-text="正在生成excel">
      <el-collapse v-model="defaultCollapse" accordion>
        <el-collapse-item v-for="(algo, algoIndex) in academicList" :key="algo.index" :title="`${algo.algorithmText}`" :name="algoIndex">
          <div class="overall">
            <div class="academic-overall">{{`总计已做${algo.overall.all_times}道, 其中做对${algo.overall.right_times}道, 总正确率为${algo.overall.correct_rate}`}}</div>
            <el-button size="medium" type="primary" plain class="view-algoType" @click="academic(algo.overall, algoIndex);algo.viewPies = !algo.viewPies">
              {{algo.viewPies ? '点击收起' : '按题型查看'}}
            </el-button>
          </div>

          <div v-show="algo.viewPies" class="academicPies">
            <div v-for="queType in 3" :key="queType" :id="`academicPie${algoIndex * 3 + queType}`" class="academicPie"></div>
          </div>

          <div v-for="(topic, topicIndex) in algo.details" :key="topicIndex">
            <p>{{`${topicIndex+1}、 ${topic.dry}（该题正确率为${topic.correct_rate}）`}}
              <el-button v-if="topic.flag !== 'fill'" type="text" @click="topic.viewPies = !topic.viewPies; makeTopicPie(algoIndex, topic, topicIndex)">
                {{topic.viewPies ? '点击收起' : '查看更多'}}
              </el-button>
            </p>

            <div v-show="topic.viewPies" ref="topicPie" :id="`topicPie${algoIndex * 1000 + topicIndex}`" class="topicPie">
            </div>

            <el-radio-group :value="topic.correctAnswer" class="radios">
              <el-radio v-for="(option, optionIndex) in topic.options" :key="optionIndex" :label="String.fromCharCode(optionIndex+65)"
                class="radio">
                <span>{{`${String.fromCharCode(optionIndex+65)}. ${option.optionText}`}}</span>
              </el-radio>
            </el-radio-group>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="suspended-balls">
      <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" type="primary" icon="el-icon-star-on"></el-button>
      <div class="suspended-ball" :class="{'export-ball':ballsStatus, 'disable-click': disableExport}" @click="exportAcademic">
        <span>导出数据</span>
      </div>
    </div>
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  // 引入柱状图
  require('echarts/lib/chart/pie');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  import api_exercise from '@/api/exercise'
  import mixin from '@/mixins/mixin'
  export default {
    mixins: [mixin],
    data() {
      return {
        loading: true,
        exportLoading: false,
        defaultCollapse: '',
        academicList: [],
        academicPiesShow: false,
        disableExport: false
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        return new Promise((resolve, reject) => {
          let params = {
            user_name: this.$store.getters.account,
            password: this.$store.getters.password,
            user_type: this.$store.getters.accountIdentity,
            option_type: 'web'
          }
          api_exercise.academic(params)
            .then(data => {
              this.academicList = data;
              for (const academic of this.academicList) {
                this.$set(academic, 'viewPies', false)
                for (const topic of academic.details) {
                  this.$set(topic, 'viewPies', false)
                }
              }
              this.loading = false;
            })
        })
      },
      academic(overall, algoIndex) {
        let select = echarts.init(document.getElementById(`academicPie${algoIndex * 3 + 1}`));
        select.setOption({
          title: {
            text: '选择题统计',
            textStyle: {
              color: '#537791'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '选择题',
            type: 'pie',
            radius: '45%',
            data: [{
              name: '做对',
              value: overall.right_times_select
            }, {
              name: '做错',
              value: overall.all_times_select - overall.right_times_select
            }]
          }],
          grid: {
            left: 50,
            right: 20,
            bottom: 20,
            top: 30,
          },
        });
        let judge = echarts.init(document.getElementById(`academicPie${algoIndex * 3 + 2}`));
        judge.setOption({
          title: {
            text: '判断题统计',
            textStyle: {
              color: '#537791'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '判断题',
            type: 'pie',
            radius: '45%',
            data: [{
              name: '做对',
              value: overall.right_times_judge
            }, {
              name: '做错',
              value: overall.all_times_judge - overall.right_times_judge
            }]
          }]
        });
        let fill = echarts.init(document.getElementById(`academicPie${algoIndex * 3 + 3}`));
        fill.setOption({
          title: {
            text: '填空题统计',
            textStyle: {
              color: '#537791'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '填空题',
            type: 'pie',
            radius: '45%',
            data: [{
              name: '做对',
              value: overall.right_times_fill
            }, {
              name: '做错',
              value: overall.all_times_fill - overall.right_times_fill
            }]
          }]
        });
      },
      makeTopicPie(algoIndex, topic, topicIndex) {
        const options = this.academicList[algoIndex]["details"][topicIndex].options_info
        let topicPie = echarts.init(document.getElementById(`topicPie${algoIndex * 1000 + topicIndex}`))
        let times = []
        if (topic.flag == 'select') {
          for (let i = 0; i < 4; i++) {
            times[i] = options[topic.order[i]]["times"]
          }
          times[4] = options["NULL"]["times"]
          topicPie.setOption({
            title: {
              text: '选项分布情况图',
              textStyle: {
                color: '#537791'
              },
              left: 60
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : ({d}%)"
            },
            series: [{
              name: '选项分布',
              type: 'pie',
              radius: '45%',
              data: [{
                name: `A(${times[0]}次)`,
                value: times[0]
              }, {
                name: `B(${times[1]}次)`,
                value: times[1]
              }, {
                name: `C(${times[2]}次)`,
                value: times[2]
              }, {
                name: `D(${times[3]}次)`,
                value: times[3]
              }, {
                name: `未选(${times[4]}次)`,
                value: times[4]
              }]
            }]
          });
        } else {
          times[0] = options["A"]["times"]
          times[1] = options["B"]["times"]
          times[2] = options["NULL"]["times"]
          topicPie.setOption({
            title: {
              text: '选项分布情况图',
              textStyle: {
                color: '#537791'
              },
              left: 60
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : ({d}%)"
            },
            series: [{
              name: '选项分布',
              type: 'pie',
              radius: '45%',
              data: [{
                name: `正确(${times[0]}次)`,
                value: times[0]
              }, {
                name: `错误(${times[1]}次)`,
                value: times[1]
              }, {
                name: `未选(${times[2]}次)`,
                value: times[2]
              }]
            }]
          });
        }
      },
      exportAcademic() {
        this.disableExport = true;
        this.defaultCollapse = '';
        this.exportLoading = true;
        let params = {
          user_name: this.$store.getters.account,
          password: this.$store.getters.password,
          user_type: this.$store.getters.accountIdentity,
          option_type: 'excel'
        }
        api_exercise.exportAcademic(params)
          .then(data => {
            window.open(data)
            this.exportLoading = false;
            this.disableExport = false;
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .academic {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: auto;
    .academicList {
      height: 100%;
      max-width: 750px;
      margin-top: 15px;
      .overall {
        display: flex;
        align-items: center;
        .academic-overall {
          font-size: 1.1em;
          margin-right: 20px;
          color: $color-theme;
        }
      }
      .academicPies {
        display: flex;
        justify-content: space-around;
        .academicPie {
          width: 220px;
          height: 220px;
        }
      }
      .radios {
        width: 100%;
        .radio {
          display: block;
          margin: 6px 0 0 20px;
          padding: 10px 0;
          width: 100%;
        }
      }
    }
    .suspended-balls {
      > :nth-child(1) {
        z-index: 2;
      }
      .collapsed-ball {
        opacity: 1;
      }
      .export-ball {
        transform: translateY(-4.5em);
      }
      .disable-click {
        pointer-events: none;
        cursor: default;
        opacity: 0.4;
      }
    }
    .topicPie {
      width: 300px;
      height: 300px;
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .academic {
    .el-collapse {
      background: $color-navbg;
      min-width: 750px;
    }
    .el-collapse-item__header {
      font-size: 1.1em;
      padding-left: 10px;
      color: $color-theme;
      background-color: $color-navbg;
    }
    .el-collapse-item__wrap {
      padding: 5px 0 0 15px;
      background-color: $color-mainArea;
    }
    .el-collapse-item__content {
      padding: 20px;
      font-size: 1em;
      line-height: 1.2em;
    }
  }
</style>
