<template>
  <div class="account-manage">
    <div class="operations">
      <div class="accountManage-manual item">
        <div class="key">添加账户：</div>
        <div class="value">
          <el-button size="small" @click="addAccountDialogVisible = true" type="primary" plain>手动添加</el-button>
        </div>
        <div class="description">（通过录入用户名、密码、姓名手动添加账户）</div>
      </div>
      <div class="accountManage-batch item">
        <div class="key">批量导入：</div>
        <div class="value">
          <el-upload ref="upload" class="upload" action="" :before-upload="beforeUpload" :limit=1 multiple method="post" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv,text/plain">
            <el-button size="small" class="batch-import" type="primary" plain>点击导入</el-button>
          </el-upload>
        </div>
        <div class="description">
          （请先下载模板，填写完毕上传导入；
          <el-button type="text" class="download-button" @click="downloadTemplate">点击下载</el-button>
        ）</div>
      </div>
      <div class="resetManage item">
        <div class="key">重置账户：</div>
        <div class="value">
          <el-button size="small" @click="resetAccountDialogVisible = true" type="primary" plain>点击重置</el-button>
        </div>
        <div class="description">（输入用户名即可重置账户密码为888888）</div>
      </div>
    </div>

    <el-dialog title="添加账户" :visible.sync="addAccountDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="addAccountForm" ref="addAccountForm" class="add-account-form" :rules="addAccountFormRules" label-width="120px">
        <el-form-item prop="accountType" label="账户类型">
          <el-select v-model="addAccountForm.accountType" placeholder="请选择账户类型" prefix-icon="el-icon-edit" clearable>
            <el-option v-for="item in generateAccountTypeOptions()" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="account" label="用户名">
          <el-input v-model="addAccountForm.account" auto-complete="off" placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="addAccountForm.password" type="password" auto-complete="off" placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="姓名">
          <el-input v-model="addAccountForm.realName" auto-complete="off" placeholder="请输入真实姓名">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAccountDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAccount">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置账户" :visible.sync="resetAccountDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="resetAccountForm" ref="resetAccountForm" class="reset-account-form" :rules="resetAccountFormRules" label-width="120px"
        @submit.native.prevent>
        <el-form-item prop="account" label="用户名">
          <el-input v-model="resetAccountForm.account" auto-complete="off" placeholder="请输入需重置的用户名" autofocus>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetAccountDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetAccount">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api_account from '@/api/account'
  import notify from '@/mixins/notify'
  import account from '@/mixins/account'
  export default {
    mixins: [notify, account],
    data() {
      return {
        addAccountDialogVisible: false,
        resetAccountDialogVisible: false,
        addAccountForm: {
          accountType: '',
          account: '',
          password: '',
          realName: ''
        },
        addAccountFormRules: {
          accountType: [{
            required: true,
            message: '请选择账户类型',
            trigger: 'blur'
          }],
          account: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          realName: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }],
        },
        resetAccountForm: {
          account: ''
        },
        resetAccountFormRules: {
          account: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      generateAccountTypeOptions() {
        let resultArray = [];
        resultArray.push({
          value: 'student',
          label: "学生"
        });
        resultArray.push({
          value: 'admin',
          label: "老师"
        });
        return resultArray;
      },
      addAccount() {
        this.$refs.addAccountForm.validate(valid => {
          if (valid) {
            let create_account = {
              user_name: this.$store.getters.account,
              password: this.$store.getters.password,
              user_type: this.$store.getters.accountIdentity,
              option_type: 'create_account',
              the_user_name: this.addAccountForm.account,
              the_password: this.addAccountForm.password,
              the_user_type: this.addAccountForm.accountType,
              the_real_name: this.addAccountForm.realName,
            };
            api_account.manageAccount(create_account).then(isSuccess => {
              if (isSuccess == 'True') {
                this.notify('添加成功', 'success');
                this.addAccountDialogVisible = false;
              }
              if (isSuccess == 'Error: Stuent user_name existed create_account') {
                this.$notify.closeAll()
                this.notify('账户已存在', 'warning');
              }
            })
          }
        })
      },
      downloadTemplate() {
        window.open('http://119.23.239.27:8087/static/template_file/ImportTemplate.xlsx')
      },
      beforeUpload(file) {
        let reader = new FileReader();
        const _this = this;
        reader.onload = function (e) {
          let text = reader.result;
          let param = {
            user_name: _this.$store.getters.account,
            password: _this.$store.getters.password,
            option_type: 'batch_import_users',
            file: text
          }
          api_account.batchImport(param)
            .then(data => {
              if (data == 'disallow') {
                _this.accountExpire();
              } else {
                _this.notify('导入成功', 'success');
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
      resetAccount() {
        this.$refs.resetAccountForm.validate(valid => {
          if (valid) {
            let init_password = {
              user_name: this.$store.getters.account,
              password: this.$store.getters.password,
              user_type: this.$store.getters.accountIdentity,
              option_type: 'init_password',
              the_user_name: this.resetAccountForm.account,
            };
            api_account.manageAccount(init_password).then(isSuccess => {
              if (isSuccess == 'True') {
                this.notify('重置成功', 'success');
                this.resetAccountDialogVisible = false;
              }
              if (isSuccess == 'Error: Stuent user_name not exist init_password') {
                this.$notify.closeAll()
                this.notify('账号不存在', 'warning');
              }
            }).catch(error => {
              console.log(error);
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .account-manage {
    height: 100%;
    width: 100%;
    overflow: auto;
    .operations {
      .item {
        padding: 20px 0;
        display: flex;
        align-items: center;
        &:not(:last-child) {
          border-bottom: 1px solid $color-greyLine;
        }
        .key {
          width: 110px;
          text-align: right;
          margin-right: 20px;
        }
        .value {
          margin-right: 10px;
          & .el-button {
            line-height: 0.8;
            position: relative;
            top: 0.125em;
          }
        }
        .description {
          font-size: 0.9em;
          color: $color-lightGrey;
          .download-button {
            text-decoration: underline;
          }
        }
      }
      .upload {
        width: 80px;
        .batch-import {
          line-height: 25px;
        }
        .icon {
          color: $color-theme;
          width: 1.8em;
          height: 1.8em;
          position: relative;
          top: 0.5em;
        }
      }
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .account-manage {
    .el-form {
      .el-form-item {
        margin-bottom: 25px;
      }
    }
    .account-manage-form {
      .el-form {
        :nth-child(2) {
          margin-bottom: 5px;
        }
      }
    }
    .el-form-item__content {
      line-height: 40px;
      width: 180px;
    }
    .el-upload-list {
      background: #eef1f4;
      width: 180px;
      .el-upload-list__item .el-icon-upload-success {
        color: $color-theme;
      }
    }
    .el-dialog {
      width: 500px;
      .add-account-form,
      .reset-account-form {
        .el-form-item__label,
        .el-input {
          font-size: 1em;
        }
        .el-input__inner {
          width: 250px;
        }
        .el-form-item__label {
          color: #000;
        }
        .el-form-item__error {
          color: $color-theme;
        }
      }
    }
  }
</style>
