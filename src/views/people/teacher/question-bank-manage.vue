<template>
  <div class="management-exercise">
    <div v-if="dataInput" class="data-input">
      <el-form ref="dataInputForm" :model="dataInputForm" :rules="dataInputFormRules" label-width="140px">
        <el-form-item prop="algorithmType" label="算法">
          <el-select v-model="dataInputForm.algorithmType" placeholder="请选择算法" prefix-icon="el-icon-edit" clearable>
            <el-option v-for="item in generateAlgorithmTypeOptions()" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="questionType" label="题目类型">
          <el-select v-model="dataInputForm.questionType" placeholder="请选择题目类型" prefix-icon="el-icon-edit" clearable>
            <el-option v-for="item in generateQuestionTypeOptions()" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="input-buttons">
        <el-button type="primary" class="confirm-input-button" @click="confirmInput" plain round>确定</el-button>
        <el-button type="primary" class="reset-button" @click="resetInputForm('dataInputForm')" plain round>重置</el-button>
      </div>

      <div class="suspended-balls">
        <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" type="primary" icon="el-icon-star-on"></el-button>
        <div class="suspended-ball" :class="{'download-ball':ballsStatus}" @click="setDownloadFormVisible">
          <span>下载模板</span>
        </div>
        <div class="suspended-ball" :class="{'batch-import-ball':ballsStatus}" @click="setImportFormVisible">
          <span>批量导入</span>
        </div>
      </div>

      <!-- 下载模板时选择题目类型 -->
      <el-dialog title="选择模板类型" :visible.sync="downloadFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="downloadForm" :model="downloadForm" :rules="downloadFormRules" label-width="140px">
          <el-form-item label="模板类型" prop="type">
            <el-select v-model="downloadForm.type" placeholder="请选择题目类型" prefix-icon="el-icon-edit" clearable>
              <el-option label="选择题" value="select">
              </el-option>
              <el-option label="判断题" value="judge">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="downloadFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="downloadTemplate">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 导入题库时选择题目类型 -->
      <el-dialog title="选择算法类型" :visible.sync="importFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="importForm" :model="importForm" :rules="importFormRules" label-width="140px">
          <el-form-item label="算法类型" prop="type">
            <el-select v-model="importForm.type" placeholder="请选择题目类型" prefix-icon="el-icon-edit" clearable>
              <el-option label="选择题" value="select">
              </el-option>
              <el-option label="判断题" value="judge">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="file" label="选择文件">
            <el-upload ref="upload" class="upload" drag action="" :before-upload="beforeUpload" :limit=1 :auto-upload="false" multiple method="post" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv,text/plain">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="importFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="importTemplate">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div v-else class="management-page" v-loading="loading">
      <m-return @page-return="returnPage"></m-return>
      <div class="toUpdated-exercise">
        <div v-for="(exercise, index) in newestExercise" :key="exercise.index">
          <p>{{(index+1) + '、'+ exercise.dry}}</p>
          <el-radio-group :value="correctAnswer(exercise)" class="radios">
            <el-radio v-for="(option,index) in exercise.options" :key="option.index" :label="String.fromCharCode(index+65)" class="radio">
              <span>{{String.fromCharCode(index+65) + '. ' + option.optionText}}</span>
            </el-radio>
          </el-radio-group>

          <el-button type="primary" class="update-exercise" round @click="setUpdateFormVisible(exercise)">编辑该题</el-button>
          <el-button type="primary" class="delete-exercise" round @click="deleteExercise(exercise.question_id)">删除该题</el-button>
        </div>
      </div>

      <div class="suspended-balls">
        <el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" type="primary" icon="el-icon-star-on"></el-button>
        <div class="suspended-ball" :class="{'add-exercise-ball':ballsStatus}" @click="setAddFormVisible">
          <span>增加题目</span>
        </div>
      </div>

      <!-- 增加或编辑选择题 -->
      <el-dialog v-if="dataInputForm.questionType == 'select'" :title="selectFormTitle" :visible.sync="selectFormVisible" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :model="selectForm" ref="selectForm" class="add-dialog-form" :rules="selectFormRules" label-width="75px">
          <el-form-item prop="question" label="题干">
            <el-input v-model="selectForm.question" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" auto-complete="off" :placeholder="`请输入题干内容`">
            </el-input>
          </el-form-item>
          <el-form-item v-for="(item,index) in selectForm.options" :key="item.key" :prop="'options.' + index + '.option'" :label="`选项${String.fromCharCode(index  + 65)}`"
            :rules="optionRule">
            <el-input v-model="item.option" auto-complete="off" :placeholder="`请输入选项${String.fromCharCode(index + 65)}内容${index == 0 ? '，请将正确答案设置在此处' : ''}`">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddSelect">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 增加或编辑判断题 -->
      <el-dialog v-if="dataInputForm.questionType == 'judge'" :title="judgeFormTitle" :visible.sync="judgeFormVisible" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :model="judgeForm" ref="judgeForm" class="add-dialog-form" :rules="judgeRules" label-width="75px">
          <el-form-item prop="question" label="题干">
            <el-input v-model="judgeForm.question" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" auto-complete="off" :placeholder="`请输入题干内容`"
              @keyup.enter.native="confirmAddJudge">
            </el-input>
          </el-form-item>
          <el-form-item prop="answer" label="答案">
            <el-radio v-model="judgeForm.answer" label="A">正确</el-radio>
            <el-radio v-model="judgeForm.answer" label="B">错误</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="judgeFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddJudge">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import api_exercise from '@/api/exercise'
  import mixin from '@/mixins/mixin'
  import account from '@/mixins/account'
  import {
    algorithmMap
  } from '@/assets/textData/algorithmMap'
  import notify from '@/mixins/notify'
  export default {
    mixins: [mixin, notify, account],
    data() {
      return {
        dataInput: true,
        dataInputForm: {
          algorithmType: '',
          questionType: ''
        },
        dataInputFormRules: {
          algorithmType: [{
            required: true,
            message: '请选择算法',
            trigger: 'blur'
          }],
          questionType: [{
            required: true,
            message: '请选择题目类型',
            trigger: 'blur'
          }]
        },
        newestExercise: [],
        selectFormVisible: false,
        selectFormTitle: '',
        selectForm: {
          question: '',
          options: [{
            option: ''
          }, {
            option: ''
          }, {
            option: ''
          }, {
            option: ''
          }]
        },
        selectFormRules: {
          question: [{
            required: true,
            message: '题干不能为空',
            trigger: 'blur'
          }]
        },
        optionRule: {
          required: true,
          message: '选项内容不能为空',
          trigger: 'blur'
        },
        judgeFormVisible: false,
        judgeFormTitle: '',
        judgeForm: {
          question: '',
          answer: ''
        },
        judgeRules: {
          question: [{
            required: true,
            message: '题干不能为空',
            trigger: 'blur'
          }],
          answer: [{
            required: true,
            message: '还未选择正确答案',
            trigger: 'blur'
          }]
        },
        // 下载模板
        downloadFormVisible: false,
        downloadForm: {
          type: ''
        },
        downloadFormRules: {
          type: [{
            required: true,
            message: '请选择算法类型'
          }]
        },
        // 导入模板
        importFormVisible: false,
        importForm: {
          type: ''
        },
        importFormRules: {
          type: [{
            required: true,
            message: '请选择算法类型'
          }]
        },
        loading: false,
        questionId: ''
      }
    },
    computed: {
      updatedData: function () {
        return {
          "user_name": this.$store.getters.account,
          "password": this.$store.getters.password,
          "option_type": '',
          "algorithm_type": this.dataInputForm.algorithmType,
          "question_type": this.dataInputForm.questionType,
          "question": "",
          "op_1": "",
          "op_2": "",
          "op_3": "",
          "op_4": "",
          "answer": "",
          "question_id": ""
        }
      },
    },
    methods: {
      setDownloadFormVisible() {
        this.downloadFormVisible = true
      },
      setImportFormVisible() {
        this.importFormVisible = true
      },
      downloadTemplate() {
        this.$refs.downloadForm.validate(valid => {
          if (valid) {
            if (this.downloadForm.type === 'select') {
              window.open('http://119.23.239.27:8087/static/template_file/选择题模板.xlsx')
            } else {
              window.open('http://119.23.239.27:8087/static/template_file/判断题模板.xlsx')
            }
            this.downloadFormVisible = false
          }
        })
      },
      beforeUpload(file) {
        let reader = new FileReader()
        const _this = this
        reader.onload = function (e) {
          let text = reader.result;
          let param = {
            user_name: _this.$store.getters.account,
            password: _this.$store.getters.password,
            user_type: _this.$store.getters.accountIdentity,
            option_type: 'batch_import_question',
            question_type: _this.importForm.type,
            file: text
          }
          api_exercise.importExercise(param)
            .then(data => {
              if (data == 'disallow') {
                _this.accountExpire();
              } else {
                _this.notify('导入成功', 'success');
                _this.importFormVisible = false;
              }
            })
            .catch(error => {
              console.log(error);
              _this.notify('导入失败', 'error');
            })
        }
        reader.readAsDataURL(file);
        return false
      },
      importTemplate() {
        this.$refs.importForm.validate(valid => {
          if (valid) {
            this.$refs.upload.submit();
          }
        })
      },
      returnPage() {
        this.dataInput = true;
        this.dataInputForm.algorithmType = '';
        this.dataInputForm.questionType = '';
      },
      generateAlgorithmTypeOptions() {
        var resultArray = [];
        for (const [key, value] of Object.entries(algorithmMap)) {
          resultArray.push({
            value: key,
            label: value
          });
        }
        return resultArray;
      },
      generateQuestionTypeOptions() {
        var resultArray = [];
        resultArray.push({
          value: 'select',
          label: '选择题'
        });
        resultArray.push({
          value: 'judge',
          label: '判断题'
        });
        return resultArray;
      },
      getData() {
        this.loading = true;
        return new Promise((resolve, reject) => {
          api_exercise.updateExercise(this.updatedData)
            .then(exercise => {
              this.newestExercise = exercise;
              this.loading = false;
              resolve(1)
            })
            .catch(error => {
              reject(error)
            })
        })
      },
      confirmInput() {
        this.$refs.dataInputForm.validate(valid => {
          if (valid) {
            this.dataInput = false;
            this.getData();
          }
        })
      },
      correctAnswer(exercise) {
        return exercise.correctAnswer != undefined ? exercise.correctAnswer : String.fromCharCode(65);
      },
      setUpdateFormVisible(exercise) {
        this.questionId = exercise.question_id;
        if (this.dataInputForm.questionType == 'select') {
          this.selectFormVisible = true;
          this.selectFormTitle = '编辑选择题'
          this.selectForm.question = exercise.dry;
          for (let i = 0; i < 4; i++) {
            this.selectForm.options[i].option = exercise.options[i].optionText
          }
        } else if (this.dataInputForm.questionType == 'judge') {
          this.judgeFormVisible = true;
          this.judgeFormTitle = '编辑判断题'
          this.judgeForm.question = exercise.dry;
          this.judgeForm.answer = exercise.correctAnswer;
        }
      },
      deleteExercise(id) {
        this.$confirm("您确认删除该题目吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false
          })
          .then(() => {
            this.loading = true;
            this.updatedData.option_type = 'delete_question';
            this.updatedData.question_id = id.toString();
            this.getData()
              .then(data => {
                if (data == 1) {
                  this.loading = false;
                  this.notify('已删除，题库已更新', 'success');
                }
              })
          })
          .catch(() => {
            this.notify('取消删除', 'info');
          });
      },
      setAddFormVisible() {
        if (this.dataInputForm.questionType == 'select') {
          this.selectFormVisible = true;
          this.selectFormTitle = '增加选择题'
          this.resetInputForm('selectForm');
          this.selectForm.question = '';
          for (let i = 0; i < 4; i++) {
            this.selectForm.options[i].option = ''
          }
        } else if (this.dataInputForm.questionType == 'judge') {
          this.judgeFormVisible = true;
          this.judgeFormTitle = '增加判断题'
          this.resetInputForm('judgeForm');
          this.judgeForm.question = '';
          this.judgeForm.answer = '';
        }
      },
      confirmAddSelect() {
        this.$refs.selectForm.validate(valid => {
          if (valid) {
            this.$confirm(this.selectFormTitle == '增加选择题' ? '您确认添加该题目吗?' : '您确认修改该题目吗?', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
              })
              .then(() => {
                this.updatedData.option_type = this.selectFormTitle == '增加选择题' ? 'create_question' :
                  'update_question';
                this.updatedData.question = this.selectForm.question;
                this.updatedData.question_id = this.questionId;
                this.updatedData.op_1 = this.selectForm.options[0].option;
                this.updatedData.op_2 = this.selectForm.options[1].option;
                this.updatedData.op_3 = this.selectForm.options[2].option;
                this.updatedData.op_4 = this.selectForm.options[3].option;
                this.getData()
                  .then(data => {
                    if (data == 1) {
                      if (this.selectFormTitle == '增加选择题') {
                        this.notify('添加成功，题库已更新', 'success');
                      } else {
                        this.notify('修改成功，题库已更新', 'success');
                      }
                      this.selectFormVisible = false;
                    }
                  })
              })
              .catch(() => {
                this.notify('已取消', 'info');
              });
          }
        })
      },
      confirmAddJudge() {
        this.$refs.judgeForm.validate(valid => {
          if (valid) {
            this.$confirm(this.judgeFormTitle == '增加判断题' ? '您确认添加该题目吗?' : '您确认修改该题目吗?', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
              })
              .then(() => {
                this.updatedData.option_type = this.judgeFormTitle == '增加判断题' ? 'create_question' :
                  'update_question';
                this.updatedData.question = this.judgeForm.question;
                this.updatedData.question_id = this.questionId;
                if (this.judgeForm.answer == 'A') {
                  this.updatedData.answer = '1';
                } else {
                  this.updatedData.answer = '0';
                }
                this.updatedData.op_3 = '';
                this.updatedData.op_4 = '';
                this.getData()
                  .then(data => {
                    if (data == 1) {
                      if (this.judgeFormTitle == '增加判断题') {
                        this.notify('添加成功，题库已更新', 'success');
                      } else {
                        this.notify('修改成功，题库已更新', 'success');
                      }
                      this.judgeFormVisible = false;
                    }
                  })
              })
              .catch(() => {
                this.notify('已取消', 'info');
              });
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .management-exercise {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    .data-input {
      width: 400px;
      height: 200px;
      padding: 70px 50px 40px 15px;
      margin: auto;
      .input-buttons {
        .confirm-input-button {
          margin: 0 20px 0 115px;
        }
      }
      .suspended-balls {
        > :nth-child(1) {
          z-index: 2;
        }
        .collapsed-ball {
          opacity: 1;
        }
        .download-ball {
          transform: translateY(-9em);
        }
        .batch-import-ball {
          transform: translateY(-4.5em);
        }
      }
    }
    .management-page {
      position: relative;
      width: 100%;
      height: 100%;
      .page-return {
        margin-left: -10px;
      }
      .toUpdated-exercise {
        width: 100%;
        margin: 50px auto;
        .radios {
          width: 100%;
          .radio {
            display: block;
            margin: 6px 0 0 20px;
            padding: 10px 0;
            width: 100%;
          }
        }
        .update-exercise {
          margin-left: 20px;
        }
        .delete-exercise {
          margin-left: 30px;
        }
      }
      .suspended-balls {
        > :nth-child(1) {
          z-index: 2;
        }
        .collapsed-ball {
          opacity: 1;
        }
        .add-exercise-ball {
          transform: translateY(-4.5em);
        }
      }
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .management-exercise {
    .el-dialog {
      width: 600px;
      .el-form-item__label {
        color: #000;
        font-size: 1em;
      }
      .el-form-item__error {
        color: $color-theme;
      }
    }
  }
</style>
