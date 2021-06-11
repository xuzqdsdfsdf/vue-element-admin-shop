<template>
  <el-dialog
:append-to-body="true"
:modal-append-to-body="false"
title="上传图片"
:visible.sync="uploaddialogVisible"
    width="70%"
    @close="close"
:before-close="handleClose">
    <el-upload
action="/upload/"
list-type="picture-card"
:file-list="FileList"
:on-preview="handlePictureCardPreview"
      :on-success="handlesuccess"
:on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog
:append-to-body="true"
:modal-append-to-body="false"
:visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      uploaddialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      callback: null,
      FileList: []
    }
  },
  methods: {
    close() {
      this.FileList = []
    },
    open(callback, url = false) {
      this.uploaddialogVisible = true
      if (typeof callback === 'function') {
        this.callback = callback
      }
      if (url) {
        this.FileList.push({
          url,
          name: url
        })
      }
    },
    handleClose() {
      this.uploaddialogVisible = false
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlesuccess(res, file) {
      this.FileList = []
      this.FileList.push({
        url: res.data,
        name: res.data
      })
      this.dialogImageUrl = res.data
    },
    confirm() {
      this.callback(this.dialogImageUrl)
      this.handleClose()
    }
  }
}
</script>

<style>
</style>
