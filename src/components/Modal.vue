<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="closeModal()">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message">

            </slot>
          </div>

        </div>
        <div class="btn-wrap">
          <slot name="btnGroup"></slot>
        </div>
      </div>
    </div>
    <div class="md-overlay"  v-if="mdShow" @click="closeModal()"></div>
  </div>
</template>
<script>
  //实现 全局模态框父子组件件的通信，父子组件间的通信必须通过props进行传递
    export default{
      props:["mdShow"],
      data(){
        return{

        }
      },
      methods:{
        closeModal(){
          //触发父组件的close事件
          this.$emit("close");
        }
      }
    }
</script>
<style>
  .btn-wrap{
    height:30px;
  }
</style>
