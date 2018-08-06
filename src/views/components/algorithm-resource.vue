<template>
	<div class="algorithm-resource">
		<el-table class="resource-table" :data="tableData" :default-sort="{prop: 'upload_time', order: 'descending'}" border>
			<el-table-column fixed prop="file_name" label="文件名" width="250" align="center" sortable>
			</el-table-column>
			<el-table-column prop="file_description" label="文件描述" width="300" align="center">
			</el-table-column>
			<el-table-column prop="upload_time" label="上传时间" width="150" align="center" sortable>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="150" align="center">
				<template slot-scope="scope">
          <m-icon name="yulan1"></m-icon>
					<el-button type="text" @click="viewFile(scope.row.url_path)">预览</el-button>
          <m-icon name="xiazai"></m-icon>
					<el-button type="text" @click="download(scope.row.url_path)">下载</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import api_resource from '@/api/educationResource'
	import notify from '@/mixins/notify'
	import account from '@/mixins/account'
	export default {
		mixins: [notify, account],
		data() {
			return {
				tableData: []
			}
		},
		mounted() {
			this.$store.commit('changeAlgorithm', this.$route.path.substring(1, this.$route.path.indexOf('/', 1)));
			this.viewResource();
		},
		methods: {
			viewResource() {
				let param = {
          option_type: 'courseware',
					algorithm_type: this.$store.getters.selectedAlgorithm
				}
				api_resource.viewResource(param).then(data => {
					const files = data;
					for (const file of files) {
						this.tableData.push(file);
					}
				})
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
			}
    }
	}
</script>

<style lang="scss" scoped>
	@import "~@/styles/vars.scss";

	.algorithm-resource {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 15px 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		.resource-table {
			flex: 0 0 852px;
			margin: auto;
			.icon {
				width: 1.8em;
				height: 1.8em;
				color: $color-theme;
				position: relative;
				top: 0.5em;
				cursor: pointer;
			}
			a {
				font-size: 1.1em;
				color: $color-theme;
				text-decoration: none;
				cursor: pointer;
			}
		}
	}
</style>
