<template>
  <div class="footer-container">
    Copyright <i
      class="iconfont"
      style="margin: 0 5px"
    >&#xe619;</i> {{`Asiainfo Admin Mgmt ${getYear}`}}
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    getYear() {
      return dayjs().year()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';
.footer-container {
  height: $footerHeight;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
