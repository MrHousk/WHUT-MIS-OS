<template>
  <div class="profile">
    <div class="personal-info">
      <div class="item">
        <div class="key">
          <div>头像：</div>
          <div class="change-avatar">（点击可更换）</div>
        </div>
        <div class="value">
          <img class="avatar" :src="$store.getters.avatar||'static/pic/avatar.png'" alt="" @click="changeAvatarDialogVisible = true">
        </div>
      </div>
      <div class="item">
        <div class="key">用户名：</div>
        <div class="value">{{$store.getters.account}}</div>
      </div>
      <div class="item">
        <div class="key">真实姓名：</div>
        <div class="value">{{$store.getters.realName}}</div>
      </div>
      <div class="item">
        <div class="key">密码：</div>
        <div class="value">
          <el-button size="small" @click="updataPasswordDialogVisible = true" type="primary" plain>修改密码</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="修改密码" :visible.sync="updataPasswordDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="updataPasswordForm" ref="updataPasswordForm" class="update-password-form" :rules="updataPasswordFormRules"
        label-width="120px">
        <el-form-item prop="oldPassword" label="旧密码">
          <el-input v-model="updataPasswordForm.oldPassword" type="password" auto-complete="off" placeholder="请输入您的旧密码" autofocus>
          </el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码">
          <el-input v-model="updataPasswordForm.newPassword" type="password" auto-complete="off" placeholder="请输入您的新密码" autofocus>
          </el-input>
        </el-form-item>
        <el-form-item prop="reNewPassword" label="重复新密码">
          <el-input v-model="updataPasswordForm.reNewPassword" type="password" auto-complete="off" placeholder="再次输入您的新密码" autofocus>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataPassword">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="更换头像" :visible.sync="changeAvatarDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="changeAvatarForm" :model="changeAvatarForm" :rules="changeAvatarRules" label-width="80px">
        <el-form-item prop="file" label="选择文件">
          <el-upload ref="upload" action="" :limit=1 multiple method="post" :before-upload="beforeUpload" :auto-upload="false" drag
            accept="image/jpeg, image/png" :file-list="changeAvatarForm.fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip">
              <span class="upload-tip">(支持上传jpg/png文件,要求大小不超过500kb)</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="changeAvatarDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChange">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api_account from '@/api/account'
  import notify from '@/mixins/notify'
  export default {
    mixins: [notify],
    data() {
      const checkPassword = (rule, value, callback) => {
        if (/^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/.test(value)) {
          callback();
        } else {
          callback(new Error("密码应至少包含数字、字母、特殊字符中的两种"))
        }
      }
      return {
        updataPasswordDialogVisible: false,
        updataPasswordForm: {
          oldPassword: '',
          newPassword: '',
          reNewPassword: ''
        },
        updataPasswordFormRules: {
          oldPassword: [{
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur'
          }],
          newPassword: [{
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          }, {
            min: 6,
            max: 18,
            message: '密码长度需要在6-18',
            trigger: 'blur'
          }, {
            validator: checkPassword,
            trigger: 'blur'
          }],
          reNewPassword: [{
            required: true,
            message: '请再次输入新密码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (value == this.updataPasswordForm.newPassword) {
                callback();
              } else {
                callback(new Error("两次输入不一致"))
              }
            },
            trigger: 'blur'
          }]
        },
        changeAvatarDialogVisible: false,
        changeAvatarForm: {
          fileList: []
        },
        changeAvatarRules: {
          fileList: [{
            required: true,
            message: '请先选择文件',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      updataPassword() {
        this.$refs.updataPasswordForm.validate(valid => {
          if (valid) {
            let update_password = {
              user_name: this.$store.getters.account,
              password: this.updataPasswordForm.oldPassword,
              user_type: this.$store.getters.accountIdentity,
              option_type: 'update_password',
              the_password: this.updataPasswordForm.newPassword,
            };
            api_account.manageAccount(update_password).then(isSuccess => {
              if (isSuccess == 'True') {
                this.$router.push('/login');
                this.notify('修改成功，请重新登录', 'success');
                this.$store.commit('loginOut');
              } else if (isSuccess == 'disallow') {
                this.$notify.closeAll()
                this.notify('旧密码错误', 'error');
              } else {
                this.notify('服务器错误', 'error');
              }
            })
          }
        })
      },
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
      beforeUpload(file) {
        const isFormatOk = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt500K = file.size / 1024 < 500;

        if (!isFormatOk) {
          this.$notify.closeAll()
          this.notify('上传头像图片只能是 jpg/png 格式', 'error');
          return;
        }
        if (!isLt500K) {
          this.$notify.closeAll()
          this.notify('上传头像图片大小不能超过 500kb', 'error');
          return;
        }
        let reader = new FileReader();
        const _this = this;
        reader.onload = function (event) {
          const imageData = reader.result;
          let param = {
            user_name: _this.$store.getters.account,
            password: _this.$store.getters.password,
            user_type: _this.$store.getters.accountIdentity,
            option_type: 'upload_profile_picture',
            file_name: file.name,
            file: imageData
          }
          api_account.changeAvatar(param)
            .then(data => {
              if (data == 'disallow') {
                _this.accountExpire();
              } else {
                _this.changeAvatarDialogVisible = false;
                _this.notify('更换成功', 'success');
                let param = {
                  user_name: _this.$store.getters.account,
                  option_type: 'profile_picture',
                }
                api_account.getAvatar(param)
                  .then(avatarUrl => {
                    _this.$store.commit("setAvatar", avatarUrl);
                  })
              }
            })
            .catch(error => {
              console.log(error);
              _this.notify('更换头像失败，请稍后重试', 'error');
            })
        }
        reader.readAsDataURL(file);
        return false;
      },
      submitChange() {
        this.$refs.changeAvatarForm.validate(valid => {
          if (valid) {
            this.$refs.upload.submit();
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/vars.scss";
  .profile {
    height: 100%;
    width: 100%;
    overflow: auto;
    .personal-info {
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
          .change-avatar {
            font-size: 0.8em;
          }
        }
        .value {
          .avatar {
            height: 5em;
            width: 5em;
            border-radius: 50%;
            cursor: pointer;
          }
          &>>>.el-button {
            line-height: 0.7;
            position: relative;
            top: 0.125em;
          }
        }
      }
    }
    .upload-tip {
      font-size: 1em;
    }
  }
</style>

<style lang="scss">
  @import "~@/styles/vars.scss";
  .profile {
    .el-dialog {
      width: 500px;
      .el-input,
      .el-form-item__label {
        font-size: 1em;
      }
      .el-form-item__label {
        color: #000;
      }
      .el-input__inner {
        width: 250px;
      }
      .el-form-item__error {
        color: $color-theme;
      }
    }
  }
</style>
