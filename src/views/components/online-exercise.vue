<template>
  <div class="online-exercise" ref="container">
    <div v-loading="exerciseLoading" class="exercise">
      <el-collapse>
        <el-collapse-item title="过往测试" name="1">
          <div class="tips">
            <span>温馨提示：</span>
            {{$store.getters.accountIdentity? '您已登录，可开始新的 “在线测试” 或在下方查看 “过往测试” ': '您当前处于未登录状态，本次测试数据不会保存；登录后可以查看所有在线测试数据'}}
          </div>

          <!-- 过往测验 -->
          <div v-if="$store.getters.accountIdentity" class="past-exercise-list">
            <el-table :data="pastExerciseList" border>
              <el-table-column type="index" label="编号" align="center" width="80">
              </el-table-column>
              <el-table-column prop="commitTime" label="提交时间" align="center" width="433">
                <template slot-scope="scope">
                  <span>{{pastExerciseList[scope.$index].commitTime}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="grade" label="得分" align="center" width="150">
                <template slot-scope="scope">
                  <span>{{pastExerciseList[scope.$index].score}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="operate" label="操作" align="center" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewPastPaper(scope.$index)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog :title="`${$store.getters.selectedAlgorithm ? '' : '自我测评——'}过往测试`" :visible.sync="paperDialogVisible" :close-on-click-modal="false"
              :close-on-press-escape="false">
              <div class="past-paper">

                <!-- 选择题过往测试 -->
                <div v-for="(exercise, exrciseIndex) in pastExerciseListSelectAndJudge" :key="exercise.index">
                  <p>{{(exrciseIndex + 1) + '、'+ exercise.dry}}</p>
                  <el-radio-group v-model="exercise.selectedAnswer" class="radios">
                    <el-radio v-for="(option,index) in exercise.options" :key="option.index" :label="String.fromCharCode(index+65)" class="radio"
                      :class="{'correct-answer-bg':correctAnswer(exercise, index), 'incorrect-answer-bg':incorrectAnswer(exercise, index)}"
                      disabled>
                      <span :class="{'incorrect-answer-text':incorrectAnswer(exercise, index)}">{{String.fromCharCode(index+65) + '. ' + option.optionText}}</span>
                    </el-radio>
                  </el-radio-group>
                  <div class="answer-evaluation">
                    <span v-if="exercise.selectedAnswer == ''" class="evaluation-empty">正确答案为{{exercise.correctAnswer}}, 您没有作答</span>
                    <span v-else-if="exercise.correctAnswer == exercise.selectedAnswer" class="evaluation-correct">正确答案为{{exercise.correctAnswer}}, 恭喜您选对了</span>
                    <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错选为{{exercise.selectedAnswer}}</span>
                  </div>
                </div>

                <!-- 处理机过往测试 -->
                <div v-if="$store.getters.selectedAlgorithm == 'processorSchedule' || $store.getters.selectedAlgorithm == ''" class="processorSchedule-fill"
                  v-for="(exercise, index) in prPastExerciseFill" :key="exercise.index">
                  <p>{{(index + 1 + exerciseSelectAndJudge.length) + '、'+ exercise.dry}}</p>

                  <el-table class="demo-table" ref="resultTable" :data="exercise.correctAnswer" border>
                    <el-table-column type="index" label="作业" width="68">
                    </el-table-column>

                    <el-table-column prop="commitTime" label="提交时间" width="125">
                      <template slot-scope="scope">
                        <span>{{exercise.correctAnswer[scope.$index].commitTime}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="runTime" label="运行时间" width="125">
                      <template slot-scope="scope">
                        <span>{{exercise.correctAnswer[scope.$index].runTime}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column v-for="column in columns" :key="column.index" :prop="column.prop" :label="column.description" :width="column.width">
                      <template slot-scope="scope">
                        {{exercise.inputtedAnswer[scope.$index][column.prop]}}
                      </template>
                    </el-table-column>
                  </el-table>

                  <div class="answer-evaluation">
                    <div v-if="isProFillRight(index)" class="evaluation-correct">
                      恭喜您答对了
                    </div>
                    <div v-else class="evaluation-incorrect">
                      您未完全答对，
                      <el-button type="text" @click="vieEmbeddedProFillAnswer(index)">点击</el-button>查看正确答案
                    </div>
                  </div>

                  <el-dialog title="正确答案" :visible.sync="embeddedAnswerTableVisible" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
                    <el-table class="demo-table" ref="resultTable" :data="answerTable" border>
                      <el-table-column type="index" label="作业" width="68">
                      </el-table-column>

                      <el-table-column v-for="column in answerColumns" :key="column.index" :prop="column.prop" :label="column.description" :width="column.width">
                      </el-table-column>
                    </el-table>
                  </el-dialog>
                </div>

                <!-- 银行家过往测试 -->
                <div v-if="$store.getters.selectedAlgorithm == 'banker' || $store.getters.selectedAlgorithm == ''" class="banker-fill"
                  v-for="(exercise, index) in baPastExerciseFill" :key="exercise.index">
                  <p>{{(index + 1 + exerciseSelectAndJudge.length + prPastExerciseFill.length) + '、'+ exercise.dry}}</p>
                  <el-input v-for="item in 4" :key="item" v-model.number="exercise.inputtedAnswer[item - 1]" class="fill-input" placeholder="请输入进程号" :disabled="true"></el-input>
                  <div class="answer-evaluation">
                    <span v-if='isBaFillRight() === -1' class="evaluation-empty">正确答案为：{{`安全序列为${exercise.correctAnswer}`}}, 您没有作答</span>
                    <span v-else-if="isBaFillRight() === 1" class="evaluation-correct">正确答案：{{`安全序列为${exercise.correctAnswer}`}}, 恭喜您答对了</span>
                    <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错答为{{exercise.inputtedAnswer}}</span>
                  </div>
                </div>

                <!-- 内存过往测试 -->
                <div v-if="$store.getters.selectedAlgorithm == 'memoryPartition' || $store.getters.selectedAlgorithm == ''" class="memoryPartition-fill"
                  v-for="(exercise, index) in mePastExerciseFill" :key="exercise.index">
                  <p>{{(index + 1 + exerciseSelectAndJudge.length + prPastExerciseFill.length + baPastExerciseFill.length) + '、'+ exercise.dry}}</p>
                  <el-form :inline="true" ref="meFillForm" :model="meFillForm[index]">
                    <el-form-item prop="startAddress" label="空间起始地址">
                      <el-input placeholder="请输入该空间起始地址" prefix-icon="el-icon-edit" v-model.number="meFillForm[index].startAddress" disabled>
                      </el-input>
                    </el-form-item>

                    <el-form-item prop="size" label="空间地址大小">
                      <el-input placeholder="请输入该空间地址大小" prefix-icon="el-icon-edit" v-model.number="meFillForm[index].size" disabled>
                      </el-input>
                    </el-form-item>

                    <el-form-item prop="state" label="空间状态">
                      <el-select v-model="meFillForm[index].state" placeholder="请选择该空间状态" prefix-icon="el-icon-edit" disabled clearable>
                        <el-option v-for="item in generateStateOptions()" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div class="answer-evaluation">
                    <span v-if="isMeFillRight(index)" class="evaluation-correct">{{`正确答案为${`内存起始地址为${mePastExerciseFill[index].correctAnswer.startAddress}，内存空间大小为${mePastExerciseFill[index].correctAnswer.Size}，该内存块为${mePastExerciseFill[index].correctAnswer.State?'占用':'空闲'}状态`}恭喜您答对了`}}</span>
                    <span v-else class="evaluation-incorrect">{{`您答错了，正确答案为${`内存起始地址为${mePastExerciseFill[index].correctAnswer.startAddress}，内存空间大小为${mePastExerciseFill[index].correctAnswer.Size}，该内存块为${mePastExerciseFill[index].correctAnswer.State?'占用':'空闲'}状态`}`}}</span>
                  </div>
                </div>

                <!-- 页面置换算法 -->
                <div v-if="$store.getters.selectedAlgorithm == 'pageReplace' || $store.getters.selectedAlgorithm == ''" class="pageReplace-fill"
                  v-for="(exercise, index) in paPastExerciseFill" :key="exercise.index">
                  <p>{{(index + 1 + exerciseSelectAndJudge.length + prPastExerciseFill.length + baPastExerciseFill.length + mePastExerciseFill.length) + '、'+ exercise.dry}}</p>
                  <el-input v-model="exercise.inputtedAnswer" class="fill-input" placeholder="请输入您的答案" :disabled="true"></el-input>
                  <div class="answer-evaluation">
                    <span v-if="exercise.inputtedAnswer == ''" class="evaluation-empty">正确答案为{{exercise.correctAnswer}}, 您没有作答</span>
                    <span v-else-if="exercise.correctAnswer == exercise.inputtedAnswer" class="evaluation-correct">正确答案为{{exercise.correctAnswer}}, 恭喜您答对了</span>
                    <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错答为{{exercise.inputtedAnswer}}</span>
                  </div>
                </div>

                <!-- 磁盘调度填空题 -->
                <div v-if="$store.getters.selectedAlgorithm == 'diskSchedule' || $store.getters.selectedAlgorithm == ''" class="diskSchedule-fill"
                  v-for="(exercise, index) in diPastExerciseFill" :key="exercise.index">
                  <p>{{(index + 1 + exerciseSelectAndJudge.length + prPastExerciseFill.length + baPastExerciseFill.length + mePastExerciseFill.length + paPastExerciseFill.length) + '、'+ exercise.dry}}</p>
                  <el-input v-model="exercise.inputtedAnswer" class="fill-input" placeholder="请输入您的答案" :disabled="true"></el-input>
                  <div class="answer-evaluation">
                    <span v-if="exercise.inputtedAnswer == ''" class="evaluation-empty">正确答案为{{exercise.correctAnswer}}, 您没有作答</span>
                    <span v-else-if="exercise.correctAnswer == exercise.inputtedAnswer" class="evaluation-correct">正确答案为{{exercise.correctAnswer}}, 恭喜您答对了</span>
                    <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错答为{{exercise.inputtedAnswer}}</span>
                  </div>
                </div>

                <!-- 加密解密过往测试 -->
                <div v-if="$store.getters.selectedAlgorithm == 'encryptDecode' || $store.getters.selectedAlgorithm == ''"
                  v-for="(exercise, index) in enPastExerciseFill" :key="exercise.index">
                  <p>{{(index + 1 + exerciseSelectAndJudge.length + prPastExerciseFill.length + baPastExerciseFill.length + mePastExerciseFill.length + paPastExerciseFill.length + diPastExerciseFill.length) + '、'+ exercise.dry}}</p>
                  <el-input v-model="exercise.inputtedAnswer" class="fill-input" placeholder="请输入您的答案" disabled></el-input>
                  <div class="answer-evaluation">
                    <span v-if="exercise.inputtedAnswer == ''" class="evaluation-empty">正确答案为{{exercise.correctAnswer}}, 您没有作答</span>
                    <span v-else-if="exercise.correctAnswer == exercise.inputtedAnswer" class="evaluation-correct">正确答案为{{exercise.correctAnswer}}, 恭喜您答对了</span>
                    <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错答为{{exercise.inputtedAnswer}}</span>
                  </div>
                </div>
              </div>
            </el-dialog>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="new-exercise">在线测试</div>

      <!-- 选择题 -->
      <div v-for="(exercise, exrciseIndex) in exerciseSelectAndJudge" :key="exercise.index">
        <p>{{(exrciseIndex + 1) + '、'+ exercise.dry}}</p>
        <el-radio-group v-model="exercise.selectedAnswer" class="radios">
          <el-radio v-for="(option,index) in exercise.options" :key="option.index" :label="String.fromCharCode(index+65)" class="radio"
            :class="{'correct-answer-bg':hasSubmitted && correctAnswer(exercise, index), 'incorrect-answer-bg':hasSubmitted && incorrectAnswer(exercise, index)}"
            :disabled="hasSubmitted">
            <span :class="{'incorrect-answer-text':hasSubmitted && incorrectAnswer(exercise, index)}">{{String.fromCharCode(index+65) + '. ' + option.optionText}}</span>
          </el-radio>
        </el-radio-group>

        <div v-show="hasSubmitted" class="answer-evaluation">
          <span v-if="exercise.selectedAnswer == ''" class="evaluation-empty">正确答案为{{exercise.correctAnswer}}, 您没有作答</span>
          <span v-else-if="exercise.correctAnswer == exercise.selectedAnswer" class="evaluation-correct">正确答案为{{exercise.correctAnswer}}, 恭喜您选对了</span>
          <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错选为{{exercise.selectedAnswer}}</span>
        </div>
      </div>

      <!-- 处理机填空题 -->
      <div v-if="$store.getters.selectedAlgorithm == 'processorSchedule' || $store.getters.selectedAlgorithm == ''" class="processorSchedule-fill"
        v-for="(exercise, index) in prExerciseFill" :key="exercise.index">
        <p>{{(index + 1 + exerciseSelectAndJudge.length) + '、'+ exercise.dry}}</p>

        <el-table class="demo-table" ref="resultTable" :data="exercise.correctAnswer" border>
          <el-table-column type="index" label="作业" width="68">
          </el-table-column>

          <el-table-column prop="commitTime" label="提交时间" width="125">
            <template slot-scope="scope">
              <span>{{exercise.correctAnswer[scope.$index].commitTime}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="runTime" label="运行时间" width="125">
            <template slot-scope="scope">
              <span>{{exercise.correctAnswer[scope.$index].runTime}}</span>
            </template>
          </el-table-column>

          <el-table-column v-for="column in columns" :key="column.index" :prop="column.prop" :label="column.description" :width="column.width">
            <template slot-scope="scope">
              <el-input v-if="!hasSubmitted" size="small" v-model.number="exercise.inputtedAnswer[scope.$index][column.prop]"></el-input>
              <span v-else>{{exercise.inputtedAnswer[scope.$index][column.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>

        <dir v-show="hasSubmitted" class="answer-evaluation">
          <div v-if="isProFillRight(index)" class="evaluation-correct">
            恭喜您答对了
          </div>
          <div v-else class="evaluation-incorrect">
            您未完全答对，
            <el-button type="text" @click="viewProFillAnswer(index)">点击</el-button>查看正确答案
          </div>
        </dir>
      </div>

      <!-- 银行家填空题 -->
      <div v-if="$store.getters.selectedAlgorithm == 'banker' || $store.getters.selectedAlgorithm == ''" class="banker-fill"
        v-for="(exercise, index) in baExerciseFill" :key="exercise.index">
        <p>{{(index + 1 + exerciseSelectAndJudge.length + prExerciseFill.length) + '、'+ exercise.dry}}</p>
        <el-input v-for="item in 4" :key="item" v-model.number="exercise.inputtedAnswer[item - 1]" class="fill-input" placeholder="请输入进程号" :disabled="hasSubmitted"></el-input>
        <div v-show="hasSubmitted" class="answer-evaluation">
          <span v-if='isBaFillRight() === -1' class="evaluation-empty">正确答案为：{{`安全序列为${exercise.correctAnswer}`}}, 您没有作答</span>
          <span v-else-if="isBaFillRight() === 1" class="evaluation-correct">正确答案：{{`安全序列为${exercise.correctAnswer}`}}, 恭喜您答对了</span>
          <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错答为{{exercise.inputtedAnswer}}</span>
        </div>
      </div>

      <!-- 内存分配填空题 -->
      <div v-if="$store.getters.selectedAlgorithm == 'memoryPartition' || $store.getters.selectedAlgorithm == ''" class="memoryPartition-fill"
        v-for="(exercise, index) in meExerciseFill" :key="exercise.index">
        <p>{{(index + 1 + exerciseSelectAndJudge.length + prExerciseFill.length + baExerciseFill.length) + '、'+ exercise.dry}}</p>
        <el-form :inline="true" ref="meFillForm" :model="meFillForm[index]">
          <el-form-item prop="startAddress" label="空间起始地址">
            <el-input placeholder="请输入该空间起始地址" prefix-icon="el-icon-edit" v-model.number="meFillForm[index].startAddress" :disabled="hasSubmitted">
            </el-input>
          </el-form-item>

          <el-form-item prop="size" label="空间地址大小">
            <el-input placeholder="请输入该空间地址大小" prefix-icon="el-icon-edit" v-model.number="meFillForm[index].size" :disabled="hasSubmitted">
            </el-input>
          </el-form-item>

          <el-form-item prop="state" label="空间状态">
            <el-select v-model="meFillForm[index].state" placeholder="请选择该空间状态" prefix-icon="el-icon-edit" :disabled="hasSubmitted" clearable>
              <el-option v-for="item in generateStateOptions()" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div v-show="hasSubmitted" class="answer-evaluation">
          <span v-if="isMeFillRight(index)" class="evaluation-correct">{{`正确答案为${`内存起始地址为${meExerciseFill[index].correctAnswer.startAddress}，内存空间大小为${meExerciseFill[index].correctAnswer.Size}，该内存块为${meExerciseFill[index].correctAnswer.State?'占用':'空闲'}状态`}恭喜您答对了`}}</span>
          <span v-else class="evaluation-incorrect">{{`您答错了，正确答案为${`内存起始地址为${meExerciseFill[index].correctAnswer.startAddress}，内存空间大小为${meExerciseFill[index].correctAnswer.Size}，该内存块为${meExerciseFill[index].correctAnswer.State?'占用':'空闲'}状态`}`}}</span>
        </div>
      </div>

      <!-- 页面置换算法 -->
      <div v-if="$store.getters.selectedAlgorithm == 'pageReplace' || $store.getters.selectedAlgorithm == ''" class="pageReplace-fill"
        v-for="(exercise, index) in paExerciseFill" :key="exercise.index">
        <p>{{(index + 1 + exerciseSelectAndJudge.length + prExerciseFill.length + baExerciseFill.length + meExerciseFill.length) + '、'+ exercise.dry}}</p>
        <el-input v-model="exercise.inputtedAnswer" class="fill-input" placeholder="请输入您的答案" :disabled="hasSubmitted"></el-input>
        <div v-show="hasSubmitted" class="answer-evaluation">
          <span v-if="exercise.inputtedAnswer == ''" class="evaluation-empty">正确答案为{{exercise.correctAnswer}}, 您没有作答</span>
          <span v-else-if="exercise.correctAnswer == exercise.inputtedAnswer" class="evaluation-correct">正确答案为{{exercise.correctAnswer}}, 恭喜您答对了</span>
          <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错答为{{exercise.inputtedAnswer}}</span>
        </div>
      </div>

      <!-- 磁盘调度填空题 -->
      <div v-if="$store.getters.selectedAlgorithm == 'diskSchedule' || $store.getters.selectedAlgorithm == ''" class="diskSchedule-fill"
        v-for="(exercise, index) in diExerciseFill" :key="exercise.index">
        <p>{{(index + 1 + exerciseSelectAndJudge.length + prExerciseFill.length + baExerciseFill.length + meExerciseFill.length + paExerciseFill.length) + '、'+ exercise.dry}}</p>
        <el-input v-model="exercise.inputtedAnswer" class="fill-input" placeholder="请输入您的答案" :disabled="hasSubmitted"></el-input>
        <div v-show="hasSubmitted" class="answer-evaluation">
          <span v-if="exercise.inputtedAnswer == ''" class="evaluation-empty">正确答案为{{exercise.correctAnswer}}, 您没有作答</span>
          <span v-else-if="exercise.correctAnswer == exercise.inputtedAnswer" class="evaluation-correct">正确答案为{{exercise.correctAnswer}}, 恭喜您答对了</span>
          <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错答为{{exercise.inputtedAnswer}}</span>
        </div>
      </div>

      <!-- 加密解密填空题 -->
      <div v-if="$store.getters.selectedAlgorithm == 'encryptDecode' || $store.getters.selectedAlgorithm == ''" v-for="(exercise, index) in enExerciseFill" :key="exercise.index">
        <p>{{(index + 1 + exerciseSelectAndJudge.length + prExerciseFill.length + baExerciseFill.length + meExerciseFill.length + paExerciseFill.length + diExerciseFill.length) + '、'+ exercise.dry}}</p>
        <el-input v-model="exercise.inputtedAnswer" class="fill-input" placeholder="请输入您的答案" :disabled="hasSubmitted"></el-input>
        <div v-show="hasSubmitted" class="answer-evaluation">
          <span v-if="exercise.inputtedAnswer == ''" class="evaluation-empty">正确答案为{{exercise.correctAnswer}}, 您没有作答</span>
          <span v-else-if="exercise.correctAnswer == exercise.inputtedAnswer" class="evaluation-correct">正确答案为{{exercise.correctAnswer}}, 恭喜您答对了</span>
          <span v-else class="evaluation-incorrect">正确答案为{{exercise.correctAnswer}}, 您错答为{{exercise.inputtedAnswer}}</span>
        </div>
      </div>

    </div>

    <!-- 处理机正确答案 -->
    <el-dialog title="正确答案" :visible.sync="answerTableVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table class="demo-table" ref="resultTable" :data="answerTable" border>
        <el-table-column type="index" label="作业" width="68">
        </el-table-column>

        <el-table-column v-for="column in answerColumns" :key="column.index" :prop="column.prop" :label="column.description" :width="column.width">
        </el-table-column>
      </el-table>
    </el-dialog>

    <div class="suspended-balls">
      <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" type="primary" icon="el-icon-star-on"></el-button>
      <div class="suspended-ball" :class="{'submit-exercise-ball':ballsStatus, 'disable-click': !exerciseSelectAndJudge.length}"
        @click='submitExercise'>
        <span>提交</span>
      </div>
      <div class="suspended-ball" :class="{'reset-exercise-ball':ballsStatus, 'disable-click': !exerciseSelectAndJudge.length}"
        @click='resetExercise'>
        <span>清空</span>
      </div>
      <div class="suspended-ball" :class="{'change-exercise-ball':ballsStatus, 'disable-click': !exerciseSelectAndJudge.length}"
        @click="changeExercise">
        <span>换题</span>
      </div>
    </div>
  </div>
</template>

<script>
  import api_exercise from '@/api/exercise'
  import mixin from '@/mixins/mixin'
  import notify from '@/mixins/notify'
  import account from '@/mixins/account'
  import {
    scrollTo
  } from '@/utils'
  export default {
    name: 'exercise',
    mixins: [mixin, notify, account],
    data() {
      return {
        exerciseLoading: false,
        pastExerciseList: [],
        paperDialogVisible: false,
        exerciseSelectAndJudge: [],
        pastExerciseListSelectAndJudge: [],

        baPastExerciseFill: [],
        prPastExerciseFill: [],
        mePastExerciseFill: [],
        paPastExerciseFill: [],
        diPastExerciseFill: [],
        enPastExerciseFill: [],

        baExerciseFill: [],
        prExerciseFill: [],
        meExerciseFill: [],
        paExerciseFill: [],
        diExerciseFill: [],
        enExerciseFill: [],

        commitTime: '',
        meFillForm: [{
          startAddress: '',
          size: '',
          state: ''
        }, {
          startAddress: '',
          size: '',
          state: ''
        }],
        columns: [],
        proFillTable: [],
        pastPaper: [],
        newPaper: [],
        hasSubmitted: false,
        answerTableVisible: false,
        embeddedAnswerTableVisible: false,
        answerTable: []
      };
    },
    mounted() {
      this.generateProFillCol();
      if (this.$route.path !== '/semester-test') {
        this.$store.commit('changeAlgorithm', this.$route.path.substring(1, this.$route.path.indexOf('/', 1)));
      }
      this.getExercise();
    },
    computed: {
      answerColumns() {
        return [{
          prop: "commitTime",
          description: "提交时间",
          width: '140'
        }, {
          prop: "runTime",
          description: "运行时间",
          width: '140'
        }, {
          prop: "startTime",
          description: "开始时间",
          width: '140'
        }, {
          prop: "finishTime",
          description: "完成时间",
          width: '140'
        }, {
          prop: "turn_over_time",
          description: "周转时间",
          width: '140'
        }, {
          prop: "weigth_turn_over_time",
          description: "带权周转时间",
          width: '140'
        }];
      }
    },
    methods: {
      scrollTo: scrollTo,
      goTop() {
        let top = this.$refs.container.scrollTop
        if (top > 0) {
          this.scrollTo(this.$refs.container)
        }
      },
      correctAnswer(exercise, index) {
        return String.fromCharCode(index + 65) == exercise.correctAnswer && exercise.selectedAnswer == exercise.correctAnswer
      },
      incorrectAnswer(exercise, index) {
        return String.fromCharCode(index + 65) == exercise.selectedAnswer && exercise.selectedAnswer && exercise.selectedAnswer !=
          exercise.correctAnswer
      },
      generateStateOptions() {
        let resultArray = [];
        resultArray.push({
          value: 1,
          label: "占用"
        });
        resultArray.push({
          value: 0,
          label: "空闲"
        });
        return resultArray;
      },
      getExercise() {
        this.exerciseLoading = true;
        if (this.$store.getters.accountIdentity) {
          let exerciseObj = {
            user_name: this.$store.getters.account,
            password: this.$store.getters.password,
            user_type: this.$store.getters.accountIdentity,
            option_type: 'get_paper',
            algorithm_type: this.$store.getters.selectedAlgorithm || 'semesterTest',
            commit_time: '',
            paper_data: ''
          };
          this.pastExerciseList = [];
          api_exercise.onlineExerciseWithLogin(exerciseObj)
            .then(data => {
              if (data == 'disallow') {
                this.accountExpire();
                this.exerciseLoading = false;
              } else {
                const exercise = data;
                if (exercise.all_paper_id.length) {
                  for (let i = 0; i < exercise.all_paper_id.length; i++) {
                    this.pastExerciseList.push({
                      commitTime: exercise.all_paper_time[i],
                      score: exercise.all_paper_score[i]
                    })
                    this.pastPaper[i] = exercise[exercise.all_paper_id[i]].slice();
                  }
                }
                if (!this.hasSubmitted) {
                  for (const item of exercise.new_paper) {
                    if (item.flag !== "fill") {
                      this.exerciseSelectAndJudge.push(item);
                    } else {
                      if (item.algorithm === 'processorSchedule') {
                        this.prExerciseFill.push(item);
                      }
                      if (item.algorithm === 'banker') {
                        this.baExerciseFill.push(item);
                      }
                      if (item.algorithm === 'memoryPartition') {
                        this.meExerciseFill.push(item);
                      }
                      if (item.algorithm === 'pageReplace') {
                        this.paExerciseFill.push(item);
                      }
                      if (item.algorithm === 'diskSchedule') {
                        this.diExerciseFill.push(item);
                      }
                      if (item.algorithm === 'encryptDecode') {
                        this.enExerciseFill.push(item);
                      }
                    }
                  }
                  this.exerciseLoading = false;
                  this.closeNotify();
                  this.promptMessage = this.notify('获取题目成功', 'success');
                }
              }
            })
            .catch(error => {
              console.log(error);
              this.closeNotify();
              this.promptMessage = this.notify('无网络连接或者服务器出错了', 'error');
              this.exerciseLoading = false;
            })
        } else {
          let params = {
            algorithm_type: this.$store.getters.selectedAlgorithm || 'semesterTest'
          }
          api_exercise.onlineExercise(params)
            .then(exercise => {
              for (const item of exercise) {
                if (item.flag != "fill") {
                  this.exerciseSelectAndJudge.push(item);
                } else {
                  if (item.algorithm === 'processorSchedule') {
                    this.prExerciseFill.push(item);
                  }
                  if (item.algorithm === 'banker') {
                    this.baExerciseFill.push(item);
                  }
                  if (item.algorithm === 'memoryPartition') {
                    this.meExerciseFill.push(item);
                  }
                  if (item.algorithm === 'pageReplace') {
                    this.paExerciseFill.push(item);
                  }
                  if (item.algorithm === 'diskSchedule') {
                    this.diExerciseFill.push(item);
                  }
                  if (item.algorithm === 'encryptDecode') {
                    this.enExerciseFill.push(item);
                  }
                }
              }
              this.exerciseLoading = false;
              this.closeNotify();
              this.promptMessage = this.notify('获取题目成功', 'success');
            });
        }
      },
      viewPastPaper(index) {
        this.paperDialogVisible = true;
        this.pastExerciseListSelectAndJudge = [];

        this.mePastExerciseFill = [];
        this.prPastExerciseFill = [];
        this.diPastExerciseFill = [];
        this.enPastExerciseFill = [];

        for (const item of this.pastPaper[index]) {
          if (item.flag != "fill") {
            this.pastExerciseListSelectAndJudge.push(item);
          } else {
            if (item.algorithm === 'processorSchedule') {
              this.prPastExerciseFill.push(item);
            }
            if (item.algorithm === 'banker') {
              this.baPastExerciseFill.push(item);
            }
            if (item.algorithm === 'memoryPartition') {
              this.mePastExerciseFill.push(item);
            }
            if (item.algorithm === 'pageReplace') {
              this.paPastExerciseFill.push(item);
            }
            if (item.algorithm === 'diskSchedule') {
              this.diPastExerciseFill.push(item);
            }
            if (item.algorithm === 'encryptDecode') {
              this.enPastExerciseFill.push(item);
            }
          }
        }
      },
      formatTime() {
        let date = new Date()
        let nowMonth = date.getMonth() + 1;
        let strDate = date.getDate();
        let strHour = date.getHours();
        let strMinute = date.getMinutes();
        let strSecond = date.getSeconds();
        this.commitTime =
          `${date.getFullYear()}-${nowMonth <= 9? '0': ''}${nowMonth}-${strDate <= 9? '0': ''}${strDate} ${strHour <= 9? '0': ''}${strHour}:${strMinute <= 9? '0': ''}${strMinute}:${strSecond <= 9? '0': ''}${strSecond}`;
      },
      submitExercise() {
        if (this.hasSubmitted) {
          this.closeNotify();
          this.promptMessage = this.notify('您已提交，可换题重新测试', 'warning');
          return;
        }
        //有待做题目
        for (let exercise of this.exerciseSelectAndJudge) {
          if (exercise.selectedAnswer == "") {
            this.$confirm("您还有待做题目，且只能提交一次，确认提交吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
              })
              .then(() => {
                this.confirmSubmit();
              })
              .catch(() => {
                this.cancelSubmit();
              });
            return;
          }
        }
        //题目全部做完
        this.$confirm("您将提交试卷, 且只能提交一次，是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false
          })
          .then(() => {
            this.confirmSubmit();
          })
          .catch(() => {
            this.cancelSubmit();
          });
      },
      isBaFillRight() {
        var correctAnswer = this.baExerciseFill[0].correctAnswer
        var inputtedAnswer = this.baExerciseFill[0].inputtedAnswer
        for (const item of inputtedAnswer.values()) {
          if (item !== "") {
            for (let i = 0; i < correctAnswer.length; i++) {
              if (correctAnswer[i] !== inputtedAnswer[i]) {
                return 0;
              }
            }
            return 1;
          }
        }
        return -1;
      },
      isProFillRight(index) {
        var correctAnswer = this.prExerciseFill[index].correctAnswer
        var inputtedAnswer = this.prExerciseFill[index].inputtedAnswer
        for (let i = 0; i < correctAnswer.length; i++) {
          for (const item in correctAnswer[i]) {
            if (correctAnswer[i][item] !== inputtedAnswer[i][item]) {
              return false;
            }
          }
        }
        return true;
      },
      isMeFillRight(index) {
        if (this.meExerciseFill[index].correctAnswer.startAddress == this.meFillForm[index].startAddress && this.meExerciseFill[
            index].correctAnswer.Size == this.meFillForm[index].size && this.meExerciseFill[index].correctAnswer.State ==
          this.meFillForm[index].state
        ) {
          return true;
        } else {
          return false;
        }
      },
      generateProFillCol() {
        this.columns = [{
          prop: "startTime",
          description: "开始时间",
          width: '110'
        }, {
          prop: "finishTime",
          description: "完成时间",
          width: '110'
        }, {
          prop: "turn_over_time",
          description: "周转时间",
          width: '110'
        }, {
          prop: "weigth_turn_over_time",
          description: "带权周转时间",
          width: '150'
        }];
      },
      //确认提交试卷
      confirmSubmit() {
        if (this.$store.getters.accountIdentity) {
          this.formatTime();
          let paperData = [];
          if (this.$store.getters.selectedAlgorithm === 'memoryPartition') {
            for (let i = 0; i < this.meExerciseFill.length; i++) {
              this.meExerciseFill[i].inputtedAnswer.Size = this.meFillForm[i].size;
              this.meExerciseFill[i].inputtedAnswer.State = this.meFillForm[i].state;
              this.meExerciseFill[i].inputtedAnswer.startAddress = this.meFillForm[i].startAddress;
            }
          }
          for (const item of this.exerciseSelectAndJudge) {
            paperData.push(item);
          }
          if (this.$store.getters.selectedAlgorithm === 'processorSchedule') {
            for (const item of this.prExerciseFill) {
              paperData.push(item);
            }
          }
          if (this.$store.getters.selectedAlgorithm === 'banker') {
            for (const item of this.baExerciseFill) {
              paperData.push(item);
            }
          }
          if (this.$store.getters.selectedAlgorithm === 'memoryPartition') {
            for (const item of this.meExerciseFill) {
              paperData.push(item);
            }
          }
          if (this.$store.getters.selectedAlgorithm === 'pageReplace') {
            for (const item of this.paExerciseFill) {
              paperData.push(item);
            }
          }
          if (this.$store.getters.selectedAlgorithm === 'diskSchedule') {
            for (const item of this.diExerciseFill) {
              paperData.push(item);
            }
          }
          if (this.$store.getters.selectedAlgorithm === 'encryptDecode') {
            for (const item of this.enExerciseFill) {
              paperData.push(item);
            }
          }

          if (this.$store.getters.selectedAlgorithm === '') {
            for (const item of this.prExerciseFill) {
              paperData.push(item);
            }
            for (const item of this.baExerciseFill) {
              paperData.push(item);
            }
            for (const item of this.meExerciseFill) {
              paperData.push(item);
            }
            for (const item of this.paExerciseFill) {
              paperData.push(item);
            }
            for (const item of this.diExerciseFill) {
              paperData.push(item);
            }
            for (const item of this.enExerciseFill) {
              paperData.push(item);
            }
          }

          let exerciseObj = {
            user_name: this.$store.getters.account,
            password: this.$store.getters.password,
            user_type: this.$store.getters.accountIdentity,
            option_type: 'insert_paper',
            algorithm_type: this.$store.getters.selectedAlgorithm || 'semesterTest',
            commit_time: this.commitTime,
            paper_data: paperData
          };
          api_exercise.onlineExerciseWithLogin(exerciseObj)
            .then(data => {
              if (data == 'disallow') {
                this.accountExpire();
              } else if (data == 'True') {
                this.hasSubmitted = true;
                this.closeNotify();
                this.promptMessage = this.notify('提交成功，已为您阅卷', 'success');
                this.getExercise();
                this.goTop();
                this.exerciseLoading = false;
              }
            });
        } else {
          this.$confirm("由于您未登录，测试结果不会被保存，确定提交吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false
          }).then(() => {
            this.closeNotify();
            this.promptMessage = this.notify('已为您阅卷', 'success');
            this.hasSubmitted = true;
          })
        }
      },
      //取消提交试卷
      cancelSubmit() {
        this.closeNotify();
        this.promptMessage = this.notify('已取消提交,您可继续作答', 'info');
      },
      resetExercise() {
        if (this.hasSubmitted) {
          this.closeNotify();
          this.promptMessage = this.notify('您已提交，无法清空', 'error');
          return;
        }
        this.$confirm("您将清空已做题目, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false
          })
          .then(() => {
            for (let exercise of this.exerciseSelectAndJudge) {
              exercise.selectedAnswer = "";
            }
            if (this.$store.getters.selectedAlgorithm === 'memoryPartition') {
              for (let exercise of this.meExerciseFill) {
                exercise.inputtedAnswer = "";
              }
            }

            for (const item of this.meFillForm) {
              for (const key of Object.keys(item)) {
                item[key] = ''
              }
            }
            this.closeNotify();
            this.promptMessage = this.notify('已帮您清空，请重新作答', 'info');
          })
          .catch(() => {
            if (!this.hasSubmitted) {
              this.closeNotify();
              this.promptMessage = this.notify('已取消,您可继续作答', 'info');
            }
          });
      },
      changeExercise() {
        this.hasSubmitted = false;
        this.exerciseSelectAndJudge = [];
        this.meExerciseFill = [];
        this.prExerciseFill = [];
        this.diExerciseFill = [];
        this.enExerciseFill = [];
        this.getExercise();
      },
      viewProFillAnswer(index) {
        this.answerTableVisible = true;
        this.answerTable = this.prExerciseFill[index].correctAnswer.slice()
      },
      vieEmbeddedProFillAnswer(index) {
        this.embeddedAnswerTableVisible = true;
        this.answerTable = this.prExerciseFill[index].correctAnswer.slice()
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .online-exercise {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 30px 0 0;
    overflow: auto;
    .exercise {
      width: 800px;
      height: 100%;
      margin: 0 auto;
      .tips {
        padding: 10px 0;
      }
      .past-exercise-list {
        margin-top: 10px;
        .past-paper {
          width: 85%;
          margin: 0 auto;
        }
      }
      .new-exercise {
        color: $color-theme;
        box-sizing: border-box;
        width: 100%;
        font-size: 1.1em;
        padding: 15px 0 15px 10px;
        background-color: $color-navbg;
      }
      .radios {
        width: 100%;
        .radio {
          display: block;
          margin: 6px 0 0 20px;
          padding: 8px 0;
        }
        .correct-answer-bg {
          background-color: #F0F0F0;
        }
        .incorrect-answer-bg {
          background-color: $color-error;
        }
        .incorrect-answer-text {
          color: #fff;
        }
      }
      .answer-evaluation {
        background-color: #F0F0F0;
        border: 1px solid $color-dividingLine;
        box-sizing: border-box;
        width: 100%;
        margin: 10px 0 0 0;
        padding: 10px;
        .evaluation-empty,
        .evaluation-incorrect {
          color: $color-error;
          .el-button {
            font-size: 1em;
          }
        }
        .evaluation-correct {
          color: $color-lightBlue;
        }
        .el-button {
          padding: 0;
        }
      }
      .banker-fill {
        .fill-input {
          width: 150px;
          margin-right: 30px;
        }
      }
      .memoryPartition-fill {
        .remove-answers {
          position: relative;
          top: 15px;
          font-size: 1.2em;
        }
      }
      .processorSchedule-fill {
        margin: auto;
      }
    }
    .suspended-balls {
      .suspended-ball {
        right: 2em;
        >span {
          padding: 1.3em 1em;
        }
      }
      > :nth-child(1) {
        z-index: 2;
      }
      .collapsed-ball {
        opacity: 1;
      }
      .submit-exercise-ball {
        transform: translateY(-13.5em);
      }
      .reset-exercise-ball {
        transform: translateY(-9em);
      }
      .change-exercise-ball {
        transform: translateY(-4.5em);
      }
      .disable-click {
        pointer-events: none;
        cursor: default;
        opacity: 0.4;
      }
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .online-exercise {
    .past-exercise-list {
      .el-table th,
      .el-table td {
        padding: 5px 0;
      }
    }
    .el-dialog {
      margin-top: 10vh !important;
      margin-bottom: 0;
      width: 1000px;
      background: $color-mainArea;
      .el-dialog__body {
        padding-top: 0;
        overflow: auto;
        height: calc(77vh);
      }
    }
    .el-collapse {
      min-width: 800px;
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
      font-size: 1em;
      padding-bottom: 10px;
      line-height: 1.2em;
    }
    .el-radio__input.is-disabled+span.el-radio__label {
      color: #606266;
    }
    .el-radio__label {
      font-size: 1.1em;
      line-height: 1.2;
    }
    .memoryPartition-fill {
      .el-form-item {
        margin-bottom: 10px;
      }
      .el-form-item__label {
        display: none;
      }
      .el-form-item__content {
        width: 250px;
        display: flex;
        margin-left: 0 !important;
      }
    }
  }
</style>
