<template>
  <section class="encrypt-decode-right">
    <demo-code :codeAreaShow="codeAreaShow" @page-return="returnPage" @expand-code="expandCode" @shrink-code="shrinkCode">
      <div class="content">
        <div class="selected-child-algorithm">当前子算法:{{selectedAlgorithmText}}</div>
        <div class="data-input">
          <el-form ref="dataInputForm" :model="dataInputForm" :rules="dataInputFormRules" label-width="120px">
            <el-form-item prop="encryptDecodeSwitch">
              <el-switch active-color="#DCDFE6" v-model="dataInputForm.encryptDecodeSwitch" @change="encryptDecodeSwitch" active-text="解密"
                inactive-text="加密">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="selectedAlgorithmIndex!='letterDown'" prop="key" label="密钥">
              <el-input v-model="dataInputForm.key" :placeholder="generateKeyPlaceholder()">
              </el-input>
            </el-form-item>
            <el-form-item v-if="selectedAlgorithmIndex=='convert'" prop="convertSelect" label="请选择">
              <el-select v-model.number="dataInputForm.convertSelect" placeholder="密钥如果是数字，请选择此项" prefix-icon="el-icon-edit" :disabled="convertSelectDisable"
                clearable>
                <el-option v-for="item in generateConvertSelect()" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="plainText" label="明文" class="encopyable">
              <el-input v-model="dataInputForm.plainText" :placeholder="dataInputForm.encryptDecodeSwitch?computedPlainText:'请输入明文字符串(英文字母组成)'"
                :disabled="dataInputForm.encryptDecodeSwitch" clearable>
              </el-input>
              <el-button type="primary" class="copy-button" @click='handleCopy(dataInputForm.plainText,$event)'>复制</el-button>
            </el-form-item>
            <el-form-item prop="cipherText" label="密文" class="encopyable">
              <el-input v-model="dataInputForm.cipherText" :placeholder="dataInputForm.encryptDecodeSwitch?'请输入密文字符串(英文字母组成)':computedCipherText"
                :disabled="!dataInputForm.encryptDecodeSwitch" clearable>
              </el-input>
              <el-button type="primary" class="copy-button" @click='handleCopy(dataInputForm.cipherText,$event)'>复制</el-button>
            </el-form-item>
          </el-form>

          <div class="input-buttons">
            <el-button type="primary" class="confirm-input-button" @click="confirmInput" plain round>确定</el-button>
            <el-button type="primary" class="reset-button" @click="clearForm('dataInputForm')" plain round>重置</el-button>
          </div>
        </div>
      </div>

      <div slot="code">
        <caesar v-if="selectedAlgorithmIndex=='caesar'"></caesar>
        <letterDown v-if="selectedAlgorithmIndex=='letterDown'"></letterDown>
        <singleTable v-if="selectedAlgorithmIndex=='singleTable'"></singleTable>
        <virginias v-if="selectedAlgorithmIndex=='virginias'"></virginias>
        <convert v-if="selectedAlgorithmIndex=='convert'"></convert>
      </div>
    </demo-code>
  </section>
</template>

<script>
  import demoCode from "@/views/components/demo-code"
  import mixin from '@/mixins/mixin'
  import caesar from "./algorithm/caesar"
  import letterDown from "./algorithm/letterDown"
  import singleTable from "./algorithm/singleTable"
  import virginias from "./algorithm/virginias"
  import convert from "./algorithm/convert"
  import clip from '@/utils/clipboard' // use clipboard directly
  export default {
    mixins: [mixin],
    props: ['selectedAlgorithmIndex', 'selectedAlgorithmText'],
    data() {
      return {
        dataInputForm: {
          encryptDecodeSwitch: false, //加密解密状态的切换，初始为加密
          key: '', //密钥
          convertSelect: '',
          plainText: '', //明文
          cipherText: ' ' //密文
        },
        dataInputFormRules: {
          key: [{
            required: true,
            message: '请输入密钥'
          }, {
            validator: (rule, value, callback) => {
              if (this.selectedAlgorithmIndex == 'caesar') {
                if (/^-?[0-9]\d*$/.test(value) == false) {
                  callback(new Error('请输入整数'));
                } else {
                  callback();
                }
              } else {
                if (this.selectedAlgorithmIndex == 'singleTable' || this.selectedAlgorithmIndex == 'virginias') {
                  if (/^[A-Za-z]+$/.test(value) == false) {
                    callback(new Error('只能输入英文字母'));
                  } else {
                    callback();
                  }
                }
                if (this.selectedAlgorithmIndex == 'convert') {
                  if (/^[A-Za-z0-9]+$/g.test(value)) {
                    if (/^[A-Za-z]+$/.test(value) || /^[1-9]\d*$/.test(value)) {
                      callback();
                    } else {
                      callback(new Error('不可同时输入英文字母和数字'));
                    }
                  } else {
                    callback(new Error('只能单独输入字母或数字'));
                  }
                }
              }
            }
          }],
          convertSelect: [{
            validator: (rule, value, callback) => {
              if (/^[1-9]\d*$/g.test(this.dataInputForm.key) && value === '') {
                callback(new Error('请选择加密方式'));
              } else {
                callback();
              }
            }
          }],
          plainText: [{
            required: true,
            message: '请输入明文',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (!this.dataInputForm.encryptDecodeSwitch) {
                if (/^[A-Za-z\s]+$/.test(value) == false) {
                  callback(new Error('只能输入英文字母或空格'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }],
          cipherText: [{
            required: true,
            message: '请输入密文',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (this.dataInputForm.encryptDecodeSwitch) {
                if (/^[A-Za-z\s]+$/.test(value) == false) {
                  callback(new Error('只能输入英文字母或空格'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }]
        },
        computedPlainText: '', //计算返回的明文
        computedCipherText: '', //计算返回的密文
      }
    },
    computed: {
      convertSelectDisable: function () {
        if (this.selectedAlgorithmIndex == 'convert') {
          if (/^[0-9]\d*$/.test(this.dataInputForm.key) == false) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    methods: {
      changeChildAlgorithm() {
        this.dataInputForm.encryptDecodeSwitch = false
        this.dataInputForm.key = ''
        this.dataInputForm.plainText = ''
        this.dataInputForm.cipherText = ' '
      },
      returnPage() {
        this.$emit('page-return');
      },
      encryptDecodeSwitch() {
        if (this.dataInputForm.encryptDecodeSwitch) {
          this.dataInputForm.plainText = ' ';
          this.dataInputForm.cipherText = '';
        } else {
          this.dataInputForm.plainText = '';
          this.dataInputForm.cipherText = ' ';
        }
      },
      generateKeyPlaceholder() {
        if (this.selectedAlgorithmIndex == 'caesar') {
          return '请输入整数'
        } else {
          if (this.selectedAlgorithmIndex == 'convert') {
            return '请输入密钥字符串或数字'
          } else {
            return '请输入密钥字符串(需由英文字母组成)'
          }
        }
      },
      generateConvertSelect() {
        let resultArray = [];
        resultArray.push({
          value: 0,
          label: "按先列后行的顺序加密"
        });
        resultArray.push({
          value: 1,
          label: "按行将每一组的字母倒排加密"
        });
        return resultArray;
      },
      publicAlgorithmFunction() {
        switch (this.selectedAlgorithmIndex) {
          case 'caesar':
            return this.caesar(this.dataInputForm.plainText, parseInt(this.dataInputForm.key),
              this.dataInputForm.encryptDecodeSwitch);
          case 'letterDown':
            return this.letterDown(this.dataInputForm.plainText,
              this.dataInputForm.encryptDecodeSwitch);
          case 'singleTable':
            return this.singleTable(this.dataInputForm.plainText, this.dataInputForm.key,
              this.dataInputForm.encryptDecodeSwitch);
          case 'virginias':
            return this.virginias(this.dataInputForm.plainText, this.dataInputForm.key,
              this.dataInputForm.encryptDecodeSwitch);
          case 'convert':
            if (/\d/.test(this.dataInputForm.key)) {
              let key = [];
              key.push(parseInt(this.dataInputForm.key));
              key.push(parseInt(this.dataInputForm.convertSelect));
              return this.convert(this.dataInputForm.plainText, key,
                this.dataInputForm.encryptDecodeSwitch);
            } else {
              return this.convert(this.dataInputForm.plainText, this.dataInputForm.key,
                this.dataInputForm.encryptDecodeSwitch);
            }
        }
      },
      handleCopy(text, event) {
        if (text == '') {
          this.$notify({
            message: '请输入内容再进行复制',
            type: 'info',
            offset: 50
          })
        }
        clip(text, event)
      },
      confirmInput() {
        this.$refs.dataInputForm.validate(valid => {
          if (valid) {
            if (this.dataInputForm.encryptDecodeSwitch) { //解密
              this.dataInputForm.plainText = this.dataInputForm.cipherText;
              this.dataInputForm.plainText = this.publicAlgorithmFunction();
            } else {
              this.dataInputForm.cipherText = this.publicAlgorithmFunction();
            }
          }
        });
      },
      clearForm(formName) {
        this.resetInputForm(formName);
        this.encryptDecodeSwitch();
        this.dataInputForm.key = '';
      },
      //凯撒加密
      caesar(text, key, isEncrypt) {
        if (isEncrypt === false) //加密
        {
          var computedCipherText = [];
          var i = 0;
          var code = 0;
          var pattern = new RegExp("[A-Za-z]+");

          for (i = 0; i < text.length; i++) {
            if (key >= 0) {
              key = key % 26;
              if (pattern.test(text[i])) {
                code = ((text[i]).toUpperCase()).charCodeAt();
                code = ((code - 65) + key) % 26 + 65;
                computedCipherText.push(String.fromCharCode(code))
              } else {
                computedCipherText.push(text[i]);
              }
            } else {
              key = (-key) % 26;
              for (i = 0; i < text.length; i++) {
                if (pattern.test(text[i])) {
                  code = ((text[i]).toUpperCase()).charCodeAt();
                  code = code - key;
                  if (code < 65)
                    code = 26 + code; //code=(90+(code-64))
                  computedCipherText.push(String.fromCharCode(code))
                } else {
                  computedCipherText.push(text[i]);
                }
              }
            }

          }
          computedCipherText = computedCipherText.join("");
          return computedCipherText;
        } else //解密
        {
          var computedPlainText = [];
          var i = 0;
          var code = 0;
          var pattern = new RegExp("[A-Za-z]+");

          if (key >= 0) {
            key = key % 26;
            for (i = 0; i < text.length; i++) {
              if (pattern.test(text[i])) {
                code = ((text[i]).toUpperCase()).charCodeAt();
                code = code - key;
                if (code < 65)
                  code = 26 + code; //code=(90+(code-64))
                computedPlainText.push(String.fromCharCode(code))
              } else {
                computedPlainText.push(text[i]);
              }
            }
          } else {
            key = (-key) % 26;
            for (i = 0; i < text.length; i++) {
              if (pattern.test(text[i])) {
                code = ((text[i]).toUpperCase()).charCodeAt();
                code = ((code - 65) + key) % 26 + 65;
                computedPlainText.push(String.fromCharCode(code))
              } else {
                computedPlainText.push(text[i]);
              }
            }
          }
          computedPlainText = computedPlainText.join("");
          return computedPlainText;
        }
      },
      //字母倒排序
      letterDown(text, isEncrypt) {
        var computedCipherText = [];
        var computedPlainText = [];
        var i = 0;
        var code = 0;
        var pattern = new RegExp("[A-Za-z]+");

        for (i = 0; i < text.length; i++) {
          if (pattern.test(text[i])) {
            code = ((text[i]).toUpperCase()).charCodeAt();
            code = 155 - code;
            computedCipherText.push(String.fromCharCode(code))
          } else {
            computedCipherText.push(text[i]);
          }
        }
        if (isEncrypt === false) //加密
        {
          computedCipherText = computedCipherText.join("");
          return computedCipherText;
        } else {
          computedPlainText = computedCipherText.join("");
          return computedPlainText;
        }
      },
      //单表置换
      singleTable(text, key, isEncrypt) {
        var clearKey = "";
        var plainCharacters = [];
        var cipherCharactrs = [];
        var pattern = new RegExp("[A-Za-z]+");
        for (var i = 0; i < key.length; i++) {
          if (pattern.test(key[i].toUpperCase()) && clearKey.indexOf(key[i].toUpperCase()) === -1)
            clearKey += key[i].toUpperCase();
        }
        for (var i = 97; i <= 122; i++)
          plainCharacters.push(String.fromCharCode(i));
        for (var i = 0; i < clearKey.length; i++)
          cipherCharactrs.push(clearKey[i]);
        for (var i = 65; i <= 90; i++) {
          if (cipherCharactrs.indexOf(String.fromCharCode(i)) === -1)
            cipherCharactrs.push(String.fromCharCode(i));
        }

        if (isEncrypt === false) //加密
        {
          var computedCipherText = [];
          var pattern = new RegExp("[A-Za-z]+");
          for (i = 0; i < text.length; i++) {
            if (pattern.test(text[i]))
              computedCipherText.push(cipherCharactrs[plainCharacters.indexOf(text[i].toLowerCase())]);
            else
              computedCipherText.push(text[i]);
          }
          computedCipherText = computedCipherText.join("");
          return computedCipherText;
        } else //解密
        {
          var computedPlainText = [];
          var pattern = new RegExp("[A-Za-z]+");

          for (i = 0; i < text.length; i++) {
            if (pattern.test(text[i]))
              computedPlainText.push(plainCharacters[cipherCharactrs.indexOf(text[i].toUpperCase())]);
            else
              computedPlainText.push(text[i]);
          }
          computedPlainText = computedPlainText.join("");
          return computedPlainText;
        }
      },
      //维吉利亚密码
      virginias(text, key, isEncrypt) {
        var clearKey = "";
        var plainCharacters = [];
        var pattern = new RegExp("[A-Za-z]+");
        var code = 0;
        for (var i = 0; i < key.length; i++) {
          if (pattern.test(key[i].toUpperCase()))
            clearKey += key[i].toUpperCase();
        }
        for (var i = 97; i <= 122; i++) //小写
          plainCharacters.push(String.fromCharCode(i));

        if (isEncrypt === false) //加密
        {
          var computedCipherText = [];
          var pattern = new RegExp("[A-Za-z]+");
          var notenglish = 0;
          for (var i = 0; i < text.length; i++) {
            if (pattern.test(text[i]))
              computedCipherText.push(plainCharacters[(plainCharacters.indexOf(clearKey[(i - notenglish) % clearKey.length]
                  .toLowerCase()) +
                plainCharacters.indexOf(text[i].toLowerCase())) % 26].toUpperCase());
            else {
              computedCipherText.push(text[i]);
              notenglish += 1;
            }

          }
          computedCipherText = computedCipherText.join("");
          return computedCipherText;
        } else //解密
        {
          var computedPlainText = [];
          var notenglish = 0;
          var pattern = new RegExp("[A-Za-z]+");
          for (var i = 0; i < text.length; i++) {
            if (pattern.test(text[i])) {
              code = plainCharacters.indexOf(text[i].toLowerCase()) - plainCharacters.indexOf(clearKey[(i - notenglish) %
                  clearKey.length]
                .toLowerCase());
              if (code < 0)
                code += 26;
              computedPlainText.push(plainCharacters[code]);
            } else {
              computedPlainText.push(text[i]);
              notenglish += 1;
            }

          }
          computedPlainText = computedPlainText.join("");
          return computedPlainText;
        }
      },
      //转换加密算法
      convert(text, key, isEncrypt) {
        var clearKey = [];
        var pattern = new RegExp("[A-Za-z]+");
        var outPutOrder = [];
        var length = 0;
        var pos = 0;

        if (isNaN(key[0])) {
          for (var i = 0; i < key.length; i++) {
            if (pattern.test(key[i].toUpperCase()))
              clearKey.push(key[i].toUpperCase());
          }
          var clearKeyInOrder = [];
          for (var i = 0; i < clearKey.length; i++)
            clearKeyInOrder.push(clearKey[i]);
          clearKeyInOrder.sort();
          for (var i = 0; i < clearKey.length; i++) {
            outPutOrder.push(clearKey.indexOf(clearKeyInOrder[i]));
            clearKey[outPutOrder[i]] = "-1";
          }
          length = clearKey.length;
        } else {
          for (var i = 0; i < key[0]; i++)
            outPutOrder.push(i);
          length = key[0];
        }

        if (isEncrypt === false) //加密
        {
          if (isNaN(key[0]) || key[1] === 0) // 按列加密
          {
            var computedCipherText = [];
            for (var i = 0; i < length; i++) {
              pos = outPutOrder[i];
              while (pos < text.length) {
                computedCipherText.push(text[pos]);
                pos += length;
              }
            }
          } else //按行加密
          {
            var computedCipherText = [];
            pos = length - 1;
            for (var i = 0; i < (text.length) / length; i++) {
              for (var j = pos; j > pos - length; j--)
                computedCipherText.push(text[j]);
              pos += length;
            }
            for (var i = text.length - 1; i > (text.length) / length * length - 1; i--)
              computedCipherText.push(text[i]);
          }
          computedCipherText = computedCipherText.join("");
          return computedCipherText;
        } else //解密
        {
          if (isNaN(key[0]) || key[1] === 0) // 按列解密
          {
            var count = 0;
            var computedPlainText = [text.length];
            for (i = 0; i < length; i++) {
              pos = outPutOrder[i];
              while (pos < text.length) {
                computedPlainText[pos] = text[count];
                count += 1;
                pos += length;
              }
            }
          } else {
            var count = 0;
            var computedPlainText = [text.length];
            pos = length - 1;
            for (var i = 0; i < text.length / length; i++) {
              for (var j = pos; j > pos - length; j--) {
                computedPlainText[j] = text[count];
                count += 1;
              }
              pos += length;
            }
            for (; count < text.length; count++) {
              computedPlainText[text.length - count - 1] = text[count];
            }
          }

          computedPlainText = computedPlainText.join("");
          return computedPlainText;
        }
      }
    },
    components: {
      demoCode,
      caesar,
      letterDown,
      singleTable,
      virginias,
      convert
    },
    mounted() {
      this.changeChildAlgorithm();
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .encrypt-decode-right {
    height: 100%;
    .content {
      margin: auto;
      .selected-child-algorithm {
        margin-bottom: 15px;
        color: $color-theme;
        font-weight: 600;
        font-size: 1.4em;
      }
      .data-input {
        width: 580px;
        height: 440px;
        padding: 10px 60px 10px 40px;
        .input-buttons {
          .confirm-input-button {
            margin: 0 20px 0 -65px;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .encrypt-decode-right {
    .el-switch {
      .el-switch__label {
        font-size: 1rem;
        color: #498290;
      }
      .el-switch__label.is-active {
        color: #fff;
      }
    }
    .data-input {
      .el-input__inner {
        width: 340px;
      }
      .encopyable {
        .el-form-item__content {
          display: flex;
          .copy-button {
            margin-left: 15px;
          }
        }
      }
    }
  }
</style>
