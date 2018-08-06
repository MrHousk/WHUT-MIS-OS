<template>
	<div class="manage-resource" v-loading="loading">
		<el-table class="resource-table" :data="tableData" border :default-sort="{prop: 'upload_time', order: 'descending'}">
			<el-table-column fixed prop="file_name" label="文件名" width="170" align="center" sortable>
			</el-table-column>
			<el-table-column prop="algorithm" label="所属算法" width="125" align="center" :filters="fliterValues" :filter-method="filterChapter"
			  filter-placement="bottom-end">
				<template slot-scope="scope">
					<el-tag disable-transitions>{{tag(scope.row.algorithm)}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="file_description" label="文件描述" align="center" width="160">
			</el-table-column>
			<el-table-column prop="upload_time" label="上传时间" width="120" align="center" sortable>
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="viewFile(scope.row.url_path)">预览</el-button>
					<el-button type="text" @click="download(scope.row.url_path)">下载</el-button>
					<el-button type="text" size="small" @click="confirmDeleteFile(scope.row.file_id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="suspended-balls">
			<el-button class="suspended-ball" :class="{'collapsed-ball':!ballsStatus}" @click="changeBallsStatus" type="primary" icon="el-icon-star-on"></el-button>
			<div class="suspended-ball" :class="{'upload-ball':ballsStatus}" @click="uploadDialogVisible = true">
				<span>上传文件</span>
			</div>
		</div>

		<el-dialog title="上传文件" :visible.sync="uploadDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form ref="uploadForm" :model="uploadForm" :rules="uploadFormRules" label-width="110px">
				<el-form-item prop="algorithmType" label="算法类型">
					<el-select v-model="uploadForm.algorithmType" placeholder="请选择算法类型" prefix-icon="el-icon-edit" clearable>
						<el-option v-for="item in generateAlgorithmTypeOptions()" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item prop="description" label="文件描述">
					<el-input class="description" placeholder="请输入0-20个字" v-model="uploadForm.description"></el-input>
				</el-form-item>

				<el-form-item prop="file" label="选择文件">
					<el-upload ref="upload" action="" :limit=1 multiple method="post" :before-upload="beforeUpload" :auto-upload="false" drag
					  accept="application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或
							<em>点击上传</em>
						</div>
						<div slot="tip">
							<span class="upload-tip">(支持上传doc/docx/ppt/pptx/pdf/xls/xlsx/txt文件)</span>
						</div>
					</el-upload>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="uploadDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitUpload">上传</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import api_resource from '@/api/educationResource'
	import {
		algorithmMap
	} from '@/assets/textData/algorithmMap'
	import {
		map
	} from '@/utils'
	import mixin from '@/mixins/mixin'
  import notify from '@/mixins/notify'
	import account from '@/mixins/account'
	export default {
		mixins: [mixin, notify, account],
		data() {
			return {
				loading: true,
				tableData: [],
				uploadDialogVisible: false,
				uploadForm: {
					algorithmType: '',
					description: ''
				},
				uploadFormRules: {
					algorithmType: [{
						required: true,
						message: '请选择算法',
						trigger: 'blur'
					}],
					description: [{
						max: 20,
						message: '请将字数控制在20之内',
						trigger: 'blur'
					}]
				}
			}
		},
		mounted() {
			this.getAllResource();
		},
		computed: {
			fliterValues() {
				var resultArray = [];
				for (const [key, value] of Object.entries(algorithmMap)) {
					resultArray.push({
						text: value,
						value: key
					});
				}
				return resultArray;
			}
		},
		methods: {
			getAllResource() {
				return new Promise((resolve, reject) => {
					let param = {
						user_name: this.$store.getters.account,
						password: this.$store.getters.password,
						option_type: 'get_all_courseware'
					}
					this.tableData = []; //先清空再push
					api_resource.getAllResource(param)
						.then(data => {
              if (data == 'disallow') {
                this.accountExpire();
              } else {
                const files = data;
                for (const file of files) {
                  this.tableData.push(file);
                }
                this.loading = false;
                resolve(1)
              }
						})
						.catch(error => {
							console.log(error);
							reject(error)
						})
				})
			},
			tag(algorithm) {
				return map(algorithmMap, algorithm)
      },
      viewFile(url) {
        if (this.$store.getters.accountIdentity) {
          window.open(`http://ow365.cn/?i=16114&furl=${url}`);
        } else {
          this.notLogged("登录后才可预览，点击确定跳转到登录界面");
        }
      },
			download(url) {
				if (this.$store.getters.accountIdentity) {
					window.open(url);
				} else {
					this.notLogged("登录后才可下载，点击确定跳转到登录界面");
				}
			},
			confirmDeleteFile(id) {
				this.$confirm("您确认删除该文件吗?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						closeOnClickModal: false
					})
					.then(() => {
						this.loading = true;
						this.deleteFile(id);
					})
					.catch(() => {
						this.notify('已取消', 'info');
					});
			},
			deleteFile(id) {
				let param = {
					user_name: this.$store.getters.account,
					password: this.$store.getters.password,
					option_type: 'delete_courseware',
					file_id: id
				}
				api_resource.deleteResource(param)
					.then(data => {
            if (data == 'disallow') {
              this.accountExpire();
            } else if (data = 'True') {
							this.getAllResource()
								.then(data => {
									if (data == 1) {
										this.loading = false;
										this.notify('删除成功', 'success');
									}
								})
						}
					})
					.catch(error => {
						console.log(error);
						this.notify('删除失败', 'error');
					})
			},
			filterChapter(value, row) {
				return row.algorithm === value;
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
			submitUpload() {
				this.$refs.uploadForm.validate(valid => {
					if (valid) {
						this.$refs.upload.submit();
					}
				})
			},
			beforeUpload(file) {
				let reader = new FileReader();
				const _this = this;
				reader.onload = function (e) {
					let text = reader.result;
					let param = {
						user_name: _this.$store.getters.account,
						password: _this.$store.getters.password,
						option_type: 'upload_courseware',
						algorithm_type: _this.uploadForm.algorithmType,
						file_name: file.name,
						file: text,
						file_description: _this.uploadForm.description
					}
					api_resource.upload(param)
						.then(data => {
              if (data == 'disallow') {
                _this.accountExpire();
              } else if (data == 'True') {
								_this.uploadDialogVisible = false;
								_this.loading = true;
								_this.getAllResource()
									.then(data => {
										if (data == 1) {
											_this.loading = false;
											_this.notify('上传成功', 'success');
										}
									})
							} else if (data == 'False') {
								_this.notify('重复上传，如需更新请先删除原文件', 'warning');
							}
						})
						.catch(error => {
							console.log(error);
							_this.notify('上传失败', 'error');
						})
				}
				reader.readAsDataURL(file);
				return false
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/styles/vars.scss";
	.manage-resource {
		overflow: auto;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 20px 5px;
		.resource-table {
			a {
				font-size: 0.8em;
				color: $color-theme;
				text-decoration: none;
				cursor: pointer;
			}
		}
		.suspended-balls {
			> :nth-child(1) {
				z-index: 2;
			}
			.collapsed-ball {
				opacity: 1;
			}
			.upload-ball {
				transform: translateY(-4.5em);
			}
		}
		.upload-tip {
			font-size: 1em;
		}
	}
</style>

<style lang="scss">
	@import "~@/styles/vars.scss";

	.manage-resource {
		.el-dialog {
			width: 600px;
			margin: 0 auto;
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
			.description {
				.el-input__inner {
					width: 360px;
				}
			}
		}
	}
</style>
