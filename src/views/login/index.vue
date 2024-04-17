<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-banner-wrapper">
        <div class="logo-wrapper"></div>
        <img
          src="../../assets/svg/login_bg.svg"
          alt=""
          class="banner-img-wraper"
        >
      </div>
      <div class="login-form-wrapper">
        <div class="system-name-wrapper">
          <h3 class="text-center text-xxl">后台管理系统</h3>
        </div>
        <div class="item-wrapper">
          <el-input
            v-model="username"
            placeholder="请输入用户名/手机号"
            prefix-icon="el-icon-user"
            clearable
          ></el-input>
        </div>
        <div class="item-wrapper margin-top-lg">
          <el-input
            v-model="password"
            placeholder="请输入密码"
            type="password"
            clearable
            prefix-icon="el-icon-lock"
          ></el-input>
        </div>
        <div class="margin-top-lg">
          <el-button
            type="primary"
            class="login"
            @click="login"
          >
            登录
          </el-button>
        </div>
        <div class="margin-top">
          <div class="flex justify-between">
            <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
            <el-link
              :underline="false"
              type="primary"
            >忘记密码？</el-link>
          </div>
        </div>
      </div>
    </div>
    <div class="login-footer-wrapper">
      <PageFooter />
    </div>
  </div>
</template>

<script>
import PageFooter from '@/layouts/footer'
export default {
  name: 'Login',
  components: { PageFooter },
  data() {
    return {
      username: 'admin',
      password: '123456',
      redirect: '',
      autoLogin: true,
      defaultTheme: this.$layoutStore.state.theme,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.$layoutStore.changeTheme('light')
  },
  destroyed() {
    this.$layoutStore.changeTheme(this.defaultTheme)
  },
  methods: {
    login() {
      if (!this.username) {
        this.$errorMsg('请输入用户名')
        return
      }
      if (!this.password) {
        this.$errorMsg('请输入密码')
        return
      }
      this.$post({
        url: this.$urlPath.login,
        data: {
          username: this.username,
          password: this.password,
          authLogin: this.authLogin ? '1' : '0',
        },
      })
        .then((res) => {
          this.$store
            .dispatch('user/saveUserInfo', res.data)
            .then((_) => {
              this.$router.push({ path: this.redirect || '/index/main' })
            })
            .catch((error) => {
              this.$errorMsg(error.message || '登录失败，未知异常')
            })
        })
        .catch((error) => {
          this.$errorMsg(error.message || '登录失败，未知异常')
        })
    },
    onVerifySuccess() {
      this.verifyState = true
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  background: radial-gradient(circle at center, #fafafa, #f2f3f5);
  .login-footer-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    ::v-deep {
      .el-card {
        background-color: transparent;
      }
    }
  }
  .login-wrapper {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%) translateY(-50%);
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04),
      0px 8px 20px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    @media screen and (max-width: 768px) {
      .login-banner-wrapper {
        display: none;
      }
    }
    @media screen and (min-width: 768px) and (max-width: 992px) {
      .login-banner-wrapper {
        display: none;
      }
    }
    @media screen and (min-width: 992px) {
      .login-banner-wrapper {
        display: block;
        flex: 1;
      }
    }
  }
  .login-banner-wrapper {
    position: relative;
    width: 450px;
    background-color: #f5f7fa;
    overflow: hidden;
    box-sizing: border-box;
  }
  .logo-wrapper {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    background: url('../../assets/img/logo.png') no-repeat;
    background-size: contain;
    box-sizing: border-box;
  }
  .banner-img-wraper {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    box-sizing: border-box;
    padding: 10px;
  }
  .login-form-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 500px;
    width: 500px;
    padding: 50px;
    overflow: hidden;
    box-sizing: border-box;
  }
  .login {
    width: 100%;
    letter-spacing: 2px;
  }
  ::v-deep .el-input__inner {
    height: 42px !important;
  }
}
</style>
