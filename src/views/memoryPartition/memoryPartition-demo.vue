<template>
	<section class="memory-partition-right">
		<demo-code :codeAreaShow="codeAreaShow" @page-return="returnPage" @expand-code="expandCode" @shrink-code="shrinkCode">
			<div v-if="!displayResultTable" class="data-input">
				<el-form :model="dataInputForm" ref="dataInputForm" :rules="dataInputFormRules" label-width="200px">
					<el-form-item prop="systemSize" label="操作系统占用内存大小">
						<el-input placeholder="请输入0-300的整数" prefix-icon="el-icon-edit" v-model.number="dataInputForm.systemSize" @keyup.enter.native="confirmInput"
						  clearable>
						</el-input>
					</el-form-item>
					<el-form-item prop="freeSize" label="用户区可用空间大小">
						<el-input placeholder="请输入0-1000的整数" prefix-icon="el-icon-location" v-model.number="dataInputForm.freeSize" @keyup.enter.native="confirmInput"
						  clearable>
						</el-input>
					</el-form-item>
				</el-form>

				<div class="input-buttons">
					<el-button type="primary" class="confirm-input-button" @click="confirmInput" plain round>确定</el-button>
					<el-button type="primary" class="reset-button" @click="resetInputForm('dataInputForm')" plain round>重置</el-button>
				</div>
			</div>

			<div v-else class="memory-partition-result">
				<div class="selected-child-algorithm">当前子算法:{{selectedAlgorithmText}}</div>
				<div>
					<el-card class="result-card">
						<div slot="header" class="card-header">
							<div>
								<span class="card-title">内存空间分配表</span>
							</div>

							<div>
								<el-button class="request-button" type="text" @click="requestMemory">请求</el-button>
								<el-button class="release-button" type="text" @click="releaseMemory">释放</el-button>
							</div>

							<el-dialog title="内存请求" :visible.sync="requestDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
								<el-form :model="requestDialogForm" ref="requestDialogForm" class="request-dialog-form" :rules="requestDialogFormRules" label-width="120px"
								  @submit.native.prevent>
									<el-form-item prop="requestSize" label="请求">
										<el-input v-model.number="requestDialogForm.requestSize" auto-complete="off" :placeholder="`请输入1-${maxRequestSize}的整数`" class="request-dialog-input"
										  @keyup.enter.native="confirmRequest" autofocus></el-input>
										<span class="request-dialog-span">内存空间大小</span>
									</el-form-item>
								</el-form>
								<div slot="footer" class="dialog-footer">
									<el-button @click="requestDialogVisible = false">取 消</el-button>
									<el-button type="primary" @click="confirmRequest">确 定</el-button>
								</div>
							</el-dialog>

							<el-dialog title="内存释放" :visible.sync="releaseDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
								<el-form :model="releaseDialogForm" ref="releaseDialogForm" :rules="releaseDialogFormRules">
									<el-form-item prop="releaseSize">
										<el-select v-model="releaseDialogForm.releaseSize" placeholder="请选择需释放的内存空间" clearable>
											<el-option v-for="item in generateReleaseSizeOptions()" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-form>
								<div slot="footer" class="dialog-footer">
									<el-button @click="releaseDialogVisible = false">取 消</el-button>
									<el-button type="primary" @click="confirmRelease">确 定</el-button>
								</div>
							</el-dialog>

						</div>
						<div v-if="dataInputForm.systemSize!=0" class="system-area">操作系统
							<span class="system-size">{{'占用'+dataInputForm.systemSize}}</span>KB空间</div>
						<div class="user-area">
							<div v-if="tableData.length===1&&tableData[0].isFree">
								用户区可用空间大小为
								<span class="free-size">{{dataInputForm.freeSize}}</span> KB
							</div>
							<div v-else v-for="item in tableData" :key="item.index" class="user-area-item">
								{{'内存块'+(tableData.indexOf(item)+1)}}
								<span :class="[item.isFree?'user-area-item-free':'user-area-item-no-free']">{{item.isFree?'空闲':'被占用'}}</span>，大小为
								<span :class="[item.isFree?'user-area-item-free':'user-area-item-no-free']">{{item.size}}</span> KB，起始地址为
								<span :class="[item.isFree?'user-area-item-free':'user-area-item-no-free']">{{item.startAddress}}</span>
							</div>
						</div>
					</el-card>
					<div class="show">
						<div class="show-title"><span>内存分配情况模拟图</span></div>
						<el-tooltip class="item" effect="dark" :content="'操作系统占用'+ dataInputForm.systemSize +'KB'" placement="top">
							<div :style="{height: dataInputForm.systemSize / (dataInputForm.freeSize + dataInputForm.systemSize) * 420  + 'px'}" :class="{noBorderRight: tableData.length > 0 && !tableData[0].isFree}"></div>
						</el-tooltip>
						<el-tooltip v-for="(item ,index) in tableData" :key="index" class="item" effect="dark" :content="`内存块${tableData.indexOf(item)+1}${item.isFree?'空闲':'被占用'}：大小为${item.size}KB，起始地址为${item.startAddress}`"
						  placement="top">
							<div :style="{height: item.size / (dataInputForm.freeSize + dataInputForm.systemSize) * 420  + 'px', top: item.startAddress / (dataInputForm.freeSize + dataInputForm.systemSize) * 420 + 'px'}"
							  :class="{isFree: item.isFree, noBorderRight: index < tableData.length - 1 && !tableData[index + 1].isFree && tableData[index + 1].startAddress == item.startAddress + item.size }"></div>
						</el-tooltip>
					</div>
				</div>
			</div>

			<div slot="code">
				<algorithmBF v-if="selectedAlgorithmIndex=='BF'"></algorithmBF>
				<algorithmWF v-if="selectedAlgorithmIndex=='WF'"></algorithmWF>
				<algorithmFF v-if="selectedAlgorithmIndex=='FF'"></algorithmFF>
				<algorithmLFF v-if="selectedAlgorithmIndex=='LFF'"></algorithmLFF>
			</div>
		</demo-code>
	</section>
</template>

<script>
	import demoCode from "@/views/components/demo-code.vue"
	import mixin from '@/mixins/mixin'
	import algorithmBF from "./algorithm/algorithmBF.vue"
	import algorithmWF from "./algorithm/algorithmWF.vue"
	import algorithmFF from "./algorithm/algorithmFF.vue"
	import algorithmLFF from "./algorithm/algorithmLFF.vue"
	import notify from '@/mixins/notify'

	export default {
		mixins: [mixin, notify],
		props: ['selectedAlgorithmIndex', 'selectedAlgorithmText'],
		data() {
			return {
				displayResultTable: false,
				dataInputForm: {
					systemSize: "", //操作系统占用的内存大小
					freeSize: "" //用户区可用空间大小
				},
				dataInputFormRules: {
					systemSize: [{
						required: true,
						message: "请输入操作系统占用内存大小",
						trigger: "blur"
					}, {
						validator: (rule, value, callback) => {
							if (/^([1-9]?\d|[1-2]\d{2}|300)$/.test(value) === false) {
								callback(new Error("请输入0-300的整数"));
							} else {
								callback();
							}
						},
						trigger: "blur"
					}],
					freeSize: [{
						required: true,
						message: "请输入用户区可用空间大小",
						trigger: "blur"
					}, {
						validator: (rule, value, callback) => {
							if (/^([1-9]|[1-9]\d|[1-9]\d{2}|1000)$/.test(value) === false) {
								callback(new Error("请输入1-1000的整数"));
							} else {
								callback();
							}
						},
						trigger: "blur"
					}]
				},
				requestState: "", //0表示请求，1表示释放
				requestDialogVisible: false,
				releaseDialogVisible: false, //内存释放对话框是否可见，下同
				requestDialogForm: {
					requestSize: ""
				},
				requestDialogFormRules: {
					requestSize: [{
						required: true,
						message: "请输入需请求的内存大小",
						trigger: "blur"
					}, {
						validator: (rule, value, callback) => {
							if (Number.isInteger(value) && 1 <= value && value <= this.maxRequestSize) {
								callback();
							} else {
								callback(new Error(`请输入1-${this.maxRequestSize}的整数`));
							}
						},
						trigger: "blur"
					}]
				},
				releaseDialogForm: {
					releaseSize: ""
				},
				releaseDialogFormRules: {
					releaseSize: [{
						required: true,
						message: "请选择需释放的内存空间",
						trigger: "blur"
					}]
				},
				maxRequestSize: "",
				tableData: [],
			};
		},
		methods: {
			changeChildAlgorithm() {
				this.dataInputForm.systemSize = ""; //换新的算法把输入框的值清空，下同
				this.dataInputForm.freeSize = "";
			},
			returnPage() {
				if (this.displayResultTable) {
					this.displayResultTable = false;
					this.dataInputForm.systemSize = ""; //返回时把输入框的值清空，下同。否则这两个值改变了初始值，"重置"按钮便不会再次触发
					this.dataInputForm.freeSize = "";
				} else {
					this.$emit('page-return');
				}
			},
			publicAlgorithmFunction() {
				switch (this.selectedAlgorithmIndex) {
					case "BF":
						return this.BF(
							this.dataInputForm.systemSize,
							this.dataInputForm.freeSize,
							this.requestDialogForm.requestSize,
							this.requestState
						);
					case "WF":
						return this.WF(
							this.dataInputForm.systemSize,
							this.dataInputForm.freeSize,
							this.requestDialogForm.requestSize,
							this.requestState
						);
					case "FF":
						return this.FF(
							this.dataInputForm.systemSize,
							this.dataInputForm.freeSize,
							this.requestDialogForm.requestSize,
							this.requestState
						);
					case "LFF":
						return this.LFF(
							this.dataInputForm.systemSize,
							this.dataInputForm.freeSize,
							this.requestDialogForm.requestSize,
							this.requestState
						);
				}
			},
			confirmInput() {
				this.$refs.dataInputForm.validate(valid => {
					if (valid) {
						this.displayResultTable = true;
						this.tableData = [];
						this.requestDialogForm.requestSize = -1;
						this.requestState = -1;
						this.publicAlgorithmFunction();
					}
				});
			},
			//请求前判断是否还有剩余空间
			requestMemory() {
				this.requestDialogForm.requestSize = ""; //每次点击请求按钮前将选框清空，释放时同理(下边)
				for (const item of this.tableData) {
					if (item.isFree === true) {
						this.requestDialogVisible = true;
						return;
					}
        }
        this.$notify.closeAll()
				this.notify('已无空余内存空间，请先释放', 'error');
			},
			//所有内存空间均空闲则无法释放
			releaseMemory() {
				this.releaseDialogForm.releaseSize = "";
				for (let i = 0; i < this.tableData.length; i++) {
					if (this.tableData[i].isFree === false) {
						this.releaseDialogVisible = true;
						return;
					}
        }
        this.$notify.closeAll()
				this.notify('无可释放的内存空间，请先请求', 'error');
			},
			//如剩余空间都不能满足请求，返回错误提示
			confirmRequest() {
				this.$refs.requestDialogForm.validate(valid => {
					if (valid) {
						this.requestState = 0;
						let isRequestSuccess = this.publicAlgorithmFunction();
						if (isRequestSuccess) {
							this.requestDialogVisible = false;
						} else {
              this.$notify.closeAll()
							this.notify('因内存不连续请求失败，请重新输入', 'error');
						}
					}
				});
			},
			//生成当前被占用的内存空间数组（释放的内存空间必须是之前请求过的，因此不提供用户自定义输入）
			generateReleaseSizeOptions() {
				let resultArray = [];
				for (let i = 0; i < this.tableData.length; i++) {
					if (this.tableData[i].isFree === false) {
						resultArray.push({
							value: `内存块${this.tableData.indexOf(this.tableData[i]) + 1}: ${this.tableData[i].size}KB`,
							label: `内存块${this.tableData.indexOf(this.tableData[i]) + 1}: ${this.tableData[i].size}KB`
						});
					}
				}
				return resultArray;
			},
			confirmRelease() {
				this.$refs.releaseDialogForm.validate(valid => {
					if (valid) {
						this.releaseDialogVisible = false;
						this.requestState = 1;
						this.requestDialogForm.requestSize = this.releaseDialogForm.releaseSize;
						this.publicAlgorithmFunction();
					}
				});
			},
			//最佳适应算法
			BF(systemSize, freeSize, requestSize, requestState) {
				var lowAddress = 0;
				var loop = 0,
					i = 0,
					j = 0,
					min = 0;
				var index = 0;

				if (requestSize === -1 && requestState === -1) {
					this.tableData.push({
						startAddress: lowAddress + systemSize,
						size: freeSize,
						isFree: true
					});
					this.maxRequestSize = freeSize;
					return 1;
				} else {
					if (requestState === 0) {
						for (i = 0; i < this.tableData.length; i++) {
							if (
								this.tableData[i].isFree === true &&
								this.tableData[i].size >= requestSize
							) {
								min = this.tableData[i].size;
								index = i;
								break;
							} else continue;
						}
						if (min === 0) return 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (
								this.tableData[i].isFree === true &&
								this.tableData[i].size >= requestSize &&
								this.tableData[i].size < min
							) {
								min = this.tableData[i].size;
								index = i;
							}
						}
						if (this.tableData[index].size - requestSize !== 0) {
							this.tableData.splice(index + 1, 0, {
								startAddress: this.tableData[index].startAddress + requestSize,
								size: this.tableData[index].size - requestSize,
								isFree: true
							});
						}
						this.tableData[index].size = requestSize;
						this.tableData[index].isFree = false;

						this.maxRequestSize = 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].isFree === true) {
								this.maxRequestSize += this.tableData[i].size;
							}
						}
						return 1;
					} else
					// if (requestState === 1)
					{
						// start from 0
						var num = parseInt(requestSize.split(':')[0].match(/\d+/g)[0]) - 1;
						// for (i = 0; i < this.tableData.length; i++)
						// {
						// if (
						//     this.tableData[i].size === requestSize &&
						//     this.tableData[i].isFree === false
						// )
						// {
						this.tableData[num].isFree = true;
						loop = num - 1;
						while (loop > -1 && this.tableData[loop].isFree === true) {
							this.tableData[loop].size =
								this.tableData[loop].size + this.tableData[loop + 1].size;
							this.tableData.splice(loop + 1, 1);
							loop--;
						}
						j = loop + 1;
						loop += 2;
						while (
							loop < this.tableData.length &&
							this.tableData[loop].isFree === true
						) {
							this.tableData[j].size =
								this.tableData[j].size + this.tableData[loop].size;
							this.tableData.splice(loop, 1);
						}

						this.maxRequestSize = 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].isFree === true) {
								this.maxRequestSize += this.tableData[i].size;
							}
						}

						return 1;
						// }
						// }
					}
				}
			},
			//最坏适应算法
			WF(systemSize, freeSize, requestSize, requestState) {
				var lowAddress = 0;
				var loop = 0,
					i = 0,
					j = 0,
					max = 0;
				var index = 0;
				//var this.maxRequestSize = 0; //使用时去掉这一行

				if (requestSize === -1 && requestState === -1) {
					this.tableData.push({
						startAddress: lowAddress + systemSize,
						size: freeSize,
						isFree: true
					});
					this.maxRequestSize = freeSize;
					return 1;
				} else {
					if (requestState === 0) {
						for (i = 0; i < this.tableData.length; i++) {
							if (
								this.tableData[i].isFree === true &&
								this.tableData[i].size >= requestSize
							) {
								max = this.tableData[i].size;
								index = i;
								break;
							} else continue;
						}
						if (max === 0) return 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (
								this.tableData[i].isFree === true &&
								this.tableData[i].size > max
							) {
								max = this.tableData[i].size;
								index = i;
							}
						}
						if (this.tableData[index].size - requestSize !== 0) {
							this.tableData.splice(index + 1, 0, {
								startAddress: this.tableData[index].startAddress + requestSize,
								size: this.tableData[index].size - requestSize,
								isFree: true
							});
						}
						this.tableData[index].size = requestSize;
						this.tableData[index].isFree = false;

						this.maxRequestSize = 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].isFree === true) {
								this.maxRequestSize += this.tableData[i].size;
							}
						}
						return 1;
					} else
					// if (requestState === 1)
					{
						var num = parseInt(requestSize.split(':')[0].match(/\d+/g)[0]) - 1;
						// for (i = 0; i < this.tableData.length; i++)
						// {
						// if (
						//     this.tableData[i].size === requestSize &&
						//     this.tableData[i].isFree === false
						// )
						// {
						this.tableData[num].isFree = true;
						loop = num - 1;
						while (loop > -1 && this.tableData[loop].isFree === true) {
							this.tableData[loop].size =
								this.tableData[loop].size + this.tableData[loop + 1].size;
							this.tableData.splice(loop + 1, 1);
							loop--;
						}
						j = loop + 1;
						loop += 2;
						while (
							loop < this.tableData.length &&
							this.tableData[loop].isFree === true
						) {
							this.tableData[j].size =
								this.tableData[j].size + this.tableData[loop].size;
							this.tableData.splice(loop, 1);
						}

						this.maxRequestSize = 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].isFree === true) {
								this.maxRequestSize += this.tableData[i].size;
							}
						}

						return 1;
						// }
						// }
					}
				}
			},
			//首次适应算法
			FF(systemSize, freeSize, requestSize, requestState) {
				var lowAddress = 0;
				var loop = 0,
					i = 0,
					j = 0;
				var index = -1;

				if (requestSize === -1 && requestState === -1) {
					this.tableData.push({
						startAddress: lowAddress + systemSize,
						size: freeSize,
						isFree: true
					});
					this.maxRequestSize = freeSize;
					return 1;
				} else {
					if (requestState === 0) {
						for (i = 0; i < this.tableData.length; i++) {
							if (
								this.tableData[i].isFree === true &&
								this.tableData[i].size >= requestSize
							) {
								index = i;
								break;
							}
						}
						if (index === -1) return 0;
						if (this.tableData[index].size - requestSize !== 0) {
							this.tableData.splice(index + 1, 0, {
								startAddress: this.tableData[index].startAddress + requestSize,
								size: this.tableData[index].size - requestSize,
								isFree: true
							});
						}
						this.tableData[index].size = requestSize;
						this.tableData[index].isFree = false;

						this.maxRequestSize = 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].isFree === true) {
								this.maxRequestSize += this.tableData[i].size;
							}
						}
						return 1;
					} else
					// if (requestState === 1)
					{
						var num = parseInt(requestSize.split(':')[0].match(/\d+/g)[0]) - 1;
						// for (i = 0; i < this.tableData.length; i++)
						// {
						// if (
						//     this.tableData[i].size === requestSize &&
						//     this.tableData[i].isFree === false
						// )
						// {
						this.tableData[num].isFree = true;
						loop = num - 1;
						while (loop > -1 && this.tableData[loop].isFree === true) {
							this.tableData[loop].size =
								this.tableData[loop].size + this.tableData[loop + 1].size;
							this.tableData.splice(loop + 1, 1);
							loop--;
						}
						j = loop + 1;
						loop += 2;
						while (
							loop < this.tableData.length &&
							this.tableData[loop].isFree === true
						) {
							this.tableData[j].size =
								this.tableData[j].size + this.tableData[loop].size;
							this.tableData.splice(loop, 1);
						}

						this.maxRequestSize = 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].isFree === true) {
								this.maxRequestSize += this.tableData[i].size;
							}
						}

						return 1;
						// }
						// }
					}
				}
			},
			//循环首次适应算法
			LFF(systemSize, freeSize, requestSize, requestState) {
				var lowAddress = 0;
				var loop = 0,
					i = 0,
					j = 0;
				var index = -1;
				var count = 0;
				//var this.maxRequestSize = 0; //使用时去掉这一行

				if (requestSize === -1 && requestState === -1) {
					this.tableData.push({
						startAddress: lowAddress + systemSize,
						size: freeSize,
						isFree: true,
						last: 0
					});
					this.maxRequestSize = freeSize;
					return 1;
				} else {
					if (requestState === 0) {
						for (i = this.tableData[0].last; i < this.tableData.length; i++) {
							if (
								this.tableData[i].isFree === true &&
								this.tableData[i].size >= requestSize
							) {
								index = i;
								break;
							}
						}
						if (index === -1) {
							for (i = 0; i < this.tableData[0].last; i++) {
								if (
									this.tableData[i].isFree === true &&
									this.tableData[i].size >= requestSize
								) {
									index = i;
									break;
								}
							}
						}
						if (index === -1) return 0;
						if (this.tableData[index].size - requestSize !== 0) {
							this.tableData.splice(index + 1, 0, {
								startAddress: this.tableData[index].startAddress + requestSize,
								size: this.tableData[index].size - requestSize,
								isFree: true
							});
							this.tableData[0].last = index + 2;
						} else this.tableData[0].last = index + 1;
						this.tableData[index].size = requestSize;
						this.tableData[index].isFree = false;

						this.tableData[0].last =
							this.tableData[0].last % this.tableData.length;
						// while (this.tableData[this.tableData[0].last].isFree === false)
						// {
						//   this.tableData[0].last += 1;
						//   this.tableData[0].last =
						//     this.tableData[0].last % this.tableData.length;
						//   count += 1;
						//   if (count === this.tableData.length) {
						//     this.tableData[0].last = 0;
						//     break;
						//   }
						// }
						this.maxRequestSize = 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].isFree === true) {
								this.maxRequestSize += this.tableData[i].size;
							}
						}
						return 1;
					} else
					// if (requestState === 1)
					{
						var num = parseInt(requestSize.split(':')[0].match(/\d+/g)[0]) - 1;
						// for (i = 0; i < this.tableData.length; i++)
						// {
						// if (
						//     this.tableData[i].size === requestSize &&
						//     this.tableData[i].isFree === false
						// )
						// {
						this.tableData[num].isFree = true;
						// console.log(this.tableData[num].isFree);

						loop = num - 1;
						// console.log(num);

						while (loop > -1 && this.tableData[loop].isFree === true) {
							this.tableData[loop].size =
								this.tableData[loop].size + this.tableData[loop + 1].size;
							this.tableData.splice(loop + 1, 1);
							if (this.tableData[0].last > loop) this.tableData[0].last -= 1;
							loop--;
						}
						j = loop + 1;
						loop += 2;
						while (
							loop < this.tableData.length &&
							this.tableData[loop].isFree === true
						) {
							this.tableData[j].size =
								this.tableData[j].size + this.tableData[loop].size;
							this.tableData.splice(loop, 1);
							if (this.tableData[0].last >= loop) this.tableData[0].last -= 1;

						}

						this.maxRequestSize = 0;
						for (i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].isFree === true) {
								this.maxRequestSize += this.tableData[i].size;
							}
						}

						return 1;
						// }
						// }
					}
				}
			}
		},
		components: {
			demoCode,
			algorithmBF,
			algorithmWF,
			algorithmFF,
			algorithmLFF
		},
		mounted() {
			this.changeChildAlgorithm();
		}
	};

</script>

<style lang="scss" scoped>
	@import "~@/styles/vars.scss";
	.memory-partition-right {
		height: 100%;
		.data-input {
			width: 550px;
			height: 250px;
			padding: 80px 60px 50px 20px;
			margin: auto;
			.input-buttons {
				.confirm-input-button {
					@media only screen and (min-device-width: 1367px) and(max-device-width:1920px) {
						margin: 0 20px 0 205px;
					}
					margin: 0 20px 0 195px;
				}
			}
		}

		.memory-partition-result {
			width: 100%;
			display: flex;
			flex-direction: column;
			.selected-child-algorithm {
				margin: 10px 3.5em;
				color: $color-theme;
				align-self: flex-start;
				font-weight: 600;
				font-size: 1.2rem;
			}
			>div {
				margin-top: 15px;
				display: flex;
				justify-content: space-around;
				.result-card {
					height: 500px;
					width: 500px;
					margin: 0 auto;
					.card-header {
						display: flex;
						justify-content: space-between;
						.card-title {
							font-weight: 600;
							font-size: 1.6rem;
							color: $color-theme;
						}
						.release-button,
						.request-button {
							font-size: 1.25rem;
							font-weight: 600;
						}
						.release-button {
							margin-left: 0;
						}
						.request-dialog-input {
							display: inline;
						}
					}
					.system-area {
						font-size: 1rem;
						margin-bottom: 24px;
						.system-size {
							color: $color-theme;
							font-size: 1.125rem;
							margin: 0 5px 0 3px;
							font-weight: 600;
						}
					}
					.user-area {
						display: flex;
						flex-direction: column;
						justify-content: center;
						overflow: hidden;
						.free-size {
							color: $color-theme;
							font-size: 1.125rem;
							font-weight: 600;
						}
						.user-area-item {
							font-size: 1rem;
							margin-bottom: 18px;
							.user-area-item-free,
							.user-area-item-no-free {
								font-size: 1.125rem;
								font-weight: 600;
							}
							.user-area-item-free {
								color: $color-lightBlue;
							}
							.user-area-item-no-free {
								color: $color-theme;
							}
						}
					}
				}
				>.show {
					position: relative;
					width: 300px;
					height: 500px;
					margin: 0 auto;
					background-color: #a6c9e2;
					box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
					.show-title{
						height: 80px;
						width: 100%;
						font-size: 1.6em;
						font-weight: 600;
						color: $color-theme;
						background-color: #fff;
						border: none;
						display: flex;
						justify-content: center;
						align-items: center;
						>span{
							position: relative;
							top: -8px;
						}
					}
					>div {
						width: 100%;
						background-color: $color-theme3;
						border: 1px solid #777;
						&:nth-child(2) {
							background-color: $color-theme;
						}
						&.isFree {
							border: none;
							background-color: transparent;
						}
						&.noBorderRight {
							border-right: none;
						}
					}
				}
			}
		}
	}

</style>

<style lang="scss">
	@import "~@/styles/vars.scss";
	.memory-partition-right {
		.data-input {
			.el-form-item__label {
				width: 240px !important;
			}
			.el-form-item__content {
				margin-left: 240px !important;
			}
			@media only screen and (min-device-width: 1367px) and(max-device-width:1920px) {
				.el-form-item__label {
					width: 250px !important;
				}
				.el-form-item__content {
					margin-left: 250px !important;
				}
			}
			.el-input__inner {
				width: 260px;
			}
		}
		.memory-partition-result {
			.el-form-item__error {
				color: $color-theme;
			}
			.el-form-item__label {
				color: #000;
			}
		}
		.el-card__body {
			max-height: 400px;
			overflow: auto;
		}
		.el-card__header {
			padding: 16px 18px;
			border-bottom: 1px solid $color-dividingLine;
		}
		.el-dialog {
			margin-top: 20vh !important;
			width: 500px;
			.request-dialog-form .el-input__inner {
				width: 170px;
			}
			.request-dialog-form {
				.el-form-item__label,
				.el-input,
				.request-dialog-span {
					font-size: 1rem;
				}
				.el-form-item__label {
					width: 60px !important;
				}
				.el-form-item__content {
					margin-left: 60px !important;
				}
			}
			.el-dialog__body {
				display: flex;
				justify-content: center;
			}
		}
	}

</style>
