<template>
  <div class="action-items-wrapper">
    <el-popover
      v-if="state.actionItem.showMessage"
      class="action-item"
      trigger="click"
      @after-enter="onPopoverAfterEnter"
    >
      <el-badge
        slot="reference"
        :value="12"
      >
        <span class="iconfont action-item">
          <SvgIcon :icon-class="'message'" />
        </span>
      </el-badge>
      <MessageContent
        ref="messageContent"
        @clear-num="clearNum"
      />
    </el-popover>
    <span
      v-if="state.actionItem.showRefresh && state.device !== 'mobile'"
      class="iconfont action-item"
      @click="onRefrehRoute"
    >
      <SvgIcon :icon-class="'refresh-line'" />
    </span>
    <span
      v-if="state.actionItem.showFullScreen && state.device !== 'mobile'"
      class="iconfont action-item"
      @click="onScreenFull"
    >
      <SvgIcon
        v-if="!isScreenFull"
        :icon-class="'fullscreen-line'"
      />
      <SvgIcon
        v-else
        :icon-class="'fullscreen-exit-line'"
      />
    </span>
    <span
      v-if="state.actionItem.showSetting && state.device !== 'mobile'"
      class="iconfont action-item"
      @click="onSetting"
    >
      <SvgIcon :icon-class="'setting'" />
    </span>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import store from '../store/index'
export default {
  name: 'ActionItems',
  data() {
    return {
      nums: 3,
      state: store.state,
      isScreenFull: false,
    }
  },
  methods: {
    onScreenFull() {
      if (!screenfull.isEnabled) {
        this.$errorMsg('当前浏览器不支持全屏操作')
        return false
      }
      this.isScreenFull = !this.isScreenFull
      screenfull.toggle()
    },
    onSetting() {
      this.$emit('open-drawer')
    },
    onRefrehRoute() {
      this.$router.replace({ path: '/redirect' + this.$route.path })
    },
    onPopoverAfterEnter() {
      this.$refs.messageContent.update()
    },
    clearNum(num) {
      this.nums = Math.max(0, this.nums - num)
    },
  },
}
</script>

<style lang="scss" scoped>
.action-items-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  color: currentColor;
  z-index: 1;
  .action-item {
    min-width: 40px;
  }
  .input-wrapper {
    position: absolute;
    top: 6px;
    bottom: 3px;
    left: 0;
    width: 0;
    z-index: -1;
    transform: translateX(0);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    &.is-active {
      width: 100%;
      transform: translateX(-100%);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  }
}
::v-deep {
  .el-input {
    border: none;
    border-bottom: 1px solid currentColor;
  }
  .el-input__inner {
    border: none !important;
    height: 35px;
    line-height: 35px;
    color: currentColor !important;
    background-color: transparent !important;
  }
}
</style>
