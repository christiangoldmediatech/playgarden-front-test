<template>
  <v-navigation-drawer v-model="appDrawer" temporary app width="315">
    <template v-slot:prepend>
      <v-row class="pt-4 pr-3" justify="end">
        <v-btn icon @click.stop="appDrawer = !appDrawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </template>

    <v-container fluid>
      <v-row no-gutters>
        <div v-if="items.length > 0">
          <template v-for="(item, index) in items">
            <v-col
              v-if="item.external"
              :key="`${_uid}-drawer-item-${index}`"
              cols="12"
            >
              <v-btn
                class="list-item"
                exact
                nuxt
                text
                @click="openLink(item.link)"
              >
                {{ item.title }}
              </v-btn>
            </v-col>
            <v-col v-else :key="`${_uid}-drawer-item-${index}`" cols="12">
              <v-btn class="list-item" exact nuxt text :to="item.to">
                {{ item.title }}
              </v-btn>
            </v-col>
          </template>
        </div>
        <div v-else id="modal-menu-pg" class="modal-pg left strech">
          <div class="modal-content fade fade-in-left fade-out-left menu-mobile menu-mobile-content">
            <div class="content-menu-mobile mt-n10">
              <a href="https://playgardenonline.com/" class="logo-menu-navbar">
                <img loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/01/logo-text.svg" alt="Playgarden Prep Online - Logo">
              </a>
              <div class="container-list-menu-mobile mt-n4">
                <ul>
                  <li>
                    <a href="https://playgardenonline.com/">Home</a>
                  </li>
                  <v-list-group
                    active-class="accent selected-menu-item more-menu-link"
                    no-action
                  >
                    <template v-slot:activator>
                      <v-list-item-title>
                        <span class="menu-mobile-text">Admissions</span>
                      </v-list-item-title>
                    </template>

                    <ul class="submenu">
                      <li><a href="https://playgardenonline.com/plans/">Enrollment Plans</a></li>
                      <li><a href="https://playgardenonline.com/testimonials/">Parent Testimonials</a></li>
                    </ul>
                  </v-list-group>
                  <hr class="mx-4">
                  <v-list-group
                    active-class="accent selected-menu-item"
                    no-action
                  >
                    <template v-slot:activator>
                      <v-list-item-title>
                        <span class="menu-mobile-text">Virtual Preschool</span>
                      </v-list-item-title>
                    </template>

                    <ul class="submenu">
                      <li>
                        <a href="https://playgardenonline.com/virtual-preschool/">Preschool and
                          Pre-K</a>
                      </li>
                      <li><a href="https://playgardenonline.com/how-it-works/">How it Works</a></li>
                      <!-- <li><a href="https://playgardenonline.com/do-it-yourself/">DIY</a></li> -->
                      <li><a href="https://playgardenonline.com/blog">Blog</a></li>
                    </ul>
                  </v-list-group>
                  <hr class="mx-4">
                  <li>
                    <a href="https://playgardenonline.com/about-us">About Us</a>
                  </li>
                </ul>
              </div>

              <a href="https://playgardenonline.com/school/auth/login" class="login-navbar">
                <span>Login</span>
                <img loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/01/log-in.svg" alt="Playgarden Prep Online Login">
              </a>
              <a href="https://playgardenonline.com/school/auth/parent" class="try-to-free-navbar">Try For Free</a>
              <div class="call-us-content">
                <span>CALL US</span>
                <a href="tel:+6465044716">
                  <img loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/01/phone-call.svg" alt="Playgarden Online Call Us">
                  <span>646-504-4716</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </v-row>
    </v-container>

    <template v-if="items.length > 0" v-slot:append>
      <v-container fluid mb-6>
        <v-row>
          <v-col cols="12">
            <span class="font-weight-medium">First time using Playgarden?</span>
            <v-btn color="primary" nuxt text :to="{ name: 'app-onboarding' }">
              WATCH TUTORIAL HERE
            </v-btn>
          </v-col>

          <v-col v-if="isUserLoggedIn && !isUserInSignupProcess" cols="12">
            <v-btn
              block
              color="primary"
              nuxt
              :to="{ name: 'app-account-index' }"
            >
              ACCOUNT SETTINGS
            </v-btn>
          </v-col>

          <v-col v-if="isUserLoggedIn" class="pb-0" cols="12">
            <v-btn
              block
              class="mb-3"
              color="accent"
              text
              :to="{ name: 'auth-logout' }"
            >
              LOG OUT
            </v-btn>
          </v-col>

          <v-col v-else class="pb-0" cols="12">
            <v-btn
              block
              class="mb-3"
              color="primary"
              nuxt
              text
              :to="{ name: 'auth-login' }"
            >
              LOG IN
            </v-btn>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col
            v-for="(item, index) in appendDrawer"
            :key="`${_uid}-append-drawer-${index}`"
            cols="12"
          >
            <v-btn class="list-item" exact nuxt text :to="item.to">
              {{ item.title }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-navigation-drawer>
</template>

<script>
import computedMixin from './computed'

export default {
  name: 'AppNavigation',

  mixins: [computedMixin],

  data() {
    return {
      appDrawer: false,
      isChild: false,
      appendDrawer: [
        { title: 'Terms & Conditions', to: { name: 'terms-conditions' } },
        { title: 'Privacy Policy', to: { name: 'privacy-policy' } },
        { title: 'Help', to: { name: 'help' } }
      ]
    }
  },

  created() {
    this.$nuxt.$on('toggle-nav-drawer', () => {
      this.appDrawer = !this.appDrawer
    })
  },

  methods: {
    openLink(link) {
      window.open(link, '_self')
    }
  }
}
</script>

<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
.menu-mobile-text {
  font-family: 'Poppins' !important;
  font-size: 18px !important;
  color: #707070 !important;
  font-weight: 500 !important;
}

/* MENU CONTENT ON POPUP*/
.btn-up-close{
    position: absolute;
    top: 51px;
    left: 24px;
    width: 22px;
    height: 22px;
    cursor: pointer;
}
.content-menu-mobile{
    background-color: #ffffff;
    box-sizing: border-box;
    padding: 45px 15px 56px;
    display: grid;
    gap: 30px;
    color: #707070;
}
.content-menu-mobile a{
    color: #707070;
    text-decoration: none;
    outline: navajowhite;
}
.content-menu-mobile ul{
    list-style: none;
    padding: 0;
}
.content-menu-mobile .logo-menu-navbar{
    width: 201px;
    height: 42.36px;
    margin: auto;
}

.content-menu-mobile .logo-menu-navbar img{
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
}
.content-menu-mobile .login-navbar{
    text-align: center;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.92px;
    text-decoration-line:underline;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 13px;
}
.content-menu-mobile .login-navbar span{
    text-decoration-line:underline;
    margin-right: 5px;
}
.content-menu-mobile .try-to-free-navbar{
    font-weight: 800;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.92px;
    color: #ffffff;
    background: #FFAB37;
    box-shadow: 0px 7.7px 23px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 7.7px 23px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 7.7px 23px rgba(0, 0, 0, 0.15);
    border-radius: 3.8px;
    text-align: center;
    display: block;
    padding: 9px 15px;
    margin-bottom: 14px;
}
.content-menu-mobile .call-us-content{
    display: grid;
    gap: 12px;
    justify-content: center;
    text-align: center;
    color: #707070;
}
.content-menu-mobile .call-us-content > span{
    font-weight: 800;
    line-height: 24px;
    font-size: 16px;
}
.content-menu-mobile .call-us-content a{
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.96px;
    display: flex;
    align-items: center;
}
.content-menu-mobile .login-navbar:hover,
.content-menu-mobile .login-navbar:focus,
.content-menu-mobile .call-us-content a:hover,
.content-menu-mobile .call-us-content a:focus{
    color: #68C453;
    text-decoration: underline;
}
.content-menu-mobile .call-us-content a span{
    margin-left: 5px;
}

.menu-mobile {
  --width-modal-pg:100% !important;
  --max-width-modal-pg:425px !important;
}
.v-navigation-drawer--temporary {
  z-index: 1500;
}

.active-menu-item {
  background-color: #f39b44 !important;
}

.list-item {
  color: var(--v-black-base) !important;
  &::before {
    opacity: 0;
  }
}

.menu-mobile-content {
  width:100% !important;
  --max-width-modal-pg:425px;
}

.container-list-menu-mobile{
    width: 100%;
    margin-top: 20px;
    margin-bottom: 12px;
}
.container-list-menu-mobile a{
    text-decoration: none;
    color: #707070;
    padding: 14px 20px;
    display: block;
    position: relative;
    outline: none;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.96px;
    position: relative;
}
.container-list-menu-mobile a:focus,
.container-list-menu-mobile a:focus-visible,
.container-list-menu-mobile a:active,
.container-list-menu-mobile li.more-menu.open > a{
    color: #68C453;
}
.container-list-menu-mobile li.more-menu.open a.link-more::before,
.container-list-menu-mobile a::before{
    content: "";
    position: absolute;
    height: 1px;
    width: calc(100% - 40px);
    bottom: 0;
    left: 18px;
    background: #B6B6B6;
}
.container-list-menu-mobile li.more-menu.open a.link-more{
    color: #68C453;
}
.container-list-menu-mobile ul{
    list-style: none;
}
.container-list-menu-mobile li ul{
    padding-left: 20px;
}
.container-list-menu-mobile li.more-menu{
    overflow: hidden;
    height: 55px;
    transition: 0.5s all;
}
.container-list-menu-mobile li.more-menu a{
    display: grid;
    grid-template-columns: repeat(2,auto);
    align-items: center;
    justify-content: start;
}
.container-list-menu-mobile li.more-menu span{
    margin-right: 10px;
}
.container-list-menu-mobile li.more-menu i{
    transform: translateY(-3px);
    font-size: 16px;
    transition: 0.5s all;
    color: #B2E68D;
}
.container-list-menu-mobile li.more-menu.open{
    height: calc(var(--height-menu) + 44px);
}
.container-list-menu-mobile li.more-menu.open i{
    transform: rotate(-90deg);
}
.container-list-menu-mobile li.more-menu ul a{
    display: grid;
    grid-template-columns: repeat(2, auto);
    column-gap: 15px;
    justify-content: start;
    pointer-events: initial;
}
.container-list-menu-mobile.text-center > ul > li > a{
    text-align: center;
}
.container-list-menu-mobile.text-center li.more-menu > a{
    justify-content: center;
}
.container-list-menu-mobile li.more-menu ul a{
    padding-left: 15%;
}

/* MENU CONTENT ON POPUP*/
.btn-up-close{
    position: absolute;
    top: 51px;
    left: 24px;
    width: 22px;
    height: 22px;
    cursor: pointer;
}
.content-menu-mobile{
    background-color: #ffffff;
    box-sizing: border-box;
    padding: 45px 15px 56px;
    display: grid;
    gap: 30px;
    color: #707070;
}
.content-menu-mobile a{
    color: #707070;
    text-decoration: none;
    outline: navajowhite;
}
.content-menu-mobile ul{
    list-style: none;
    padding: 0;
}
.content-menu-mobile .logo-menu-navbar{
    width: 201px;
    height: 42.36px;
    margin: auto;
}

.content-menu-mobile .logo-menu-navbar img{
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
}
.content-menu-mobile .login-navbar{
    text-align: center;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.92px;
    text-decoration-line:underline;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 13px;
}
.content-menu-mobile .login-navbar span{
    text-decoration-line:underline;
    margin-right: 5px;
}
.content-menu-mobile .try-to-free-navbar{
    font-weight: 800;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.92px;
    color: #ffffff;
    background: #FFAB37;
    box-shadow: 0px 7.7px 23px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 7.7px 23px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 7.7px 23px rgba(0, 0, 0, 0.15);
    border-radius: 3.8px;
    text-align: center;
    display: block;
    padding: 9px 15px;
    margin-bottom: 14px;
}
.content-menu-mobile .call-us-content{
    display: grid;
    gap: 12px;
    justify-content: center;
    text-align: center;
    color: #707070;
}
.content-menu-mobile .call-us-content > span{
    font-weight: 800;
    line-height: 24px;
    font-size: 16px;
}
.content-menu-mobile .call-us-content a{
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.96px;
    display: flex;
    align-items: center;
}
.content-menu-mobile .login-navbar:hover,
.content-menu-mobile .login-navbar:focus,
.content-menu-mobile .call-us-content a:hover,
.content-menu-mobile .call-us-content a:focus{
    color: #68C453;
    text-decoration: underline;
}
.content-menu-mobile .call-us-content a span{
    margin-left: 5px;
}

/* MENU POPUP*/
.container-list-menu-mobile{
    width: 100%;
    margin-top: 20px;
    margin-bottom: 12px;
}
.container-list-menu-mobile a{
    text-decoration: none;
    color: #707070;
    padding: 14px 20px;
    display: block;
    position: relative;
    outline: none;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.96px;
    position: relative;
}
.container-list-menu-mobile a:focus,
.container-list-menu-mobile a:focus-visible,
.container-list-menu-mobile a:active,
.container-list-menu-mobile li.more-menu.open > a{
    color: #68C453;
}
.container-list-menu-mobile li.more-menu.open a.link-more::before,
.container-list-menu-mobile a::before{
    content: "";
    position: absolute;
    height: 1px;
    width: calc(100% - 40px);
    bottom: 0;
    left: 18px;
    background: #B6B6B6;
}
.container-list-menu-mobile li.more-menu.open a.link-more{
    color: #68C453;
}
.container-list-menu-mobile ul{
    list-style: none;
}
.container-list-menu-mobile li ul{
    padding-left: 20px;
}
.container-list-menu-mobile li.more-menu{
    overflow: hidden;
    height: 55px;
    transition: 0.5s all;
}
.container-list-menu-mobile li.more-menu a{
    display: grid;
    grid-template-columns: repeat(2,auto);
    align-items: center;
    justify-content: start;
}
.container-list-menu-mobile li.more-menu span{
    margin-right: 10px;
}
.container-list-menu-mobile li.more-menu i{
    transform: translateY(-3px);
    font-size: 16px;
    transition: 0.5s all;
    color: #B2E68D;
}
.container-list-menu-mobile li.more-menu.open{
    height: calc(var(--height-menu) + 44px);
}
.container-list-menu-mobile li.more-menu.open i{
    transform: rotate(-90deg);
}
.container-list-menu-mobile li.more-menu ul a{
    display: grid;
    grid-template-columns: repeat(2, auto);
    column-gap: 15px;
    justify-content: start;
    pointer-events: initial;
}
.container-list-menu-mobile.text-center > ul > li > a{
    text-align: center;
}
.container-list-menu-mobile.text-center li.more-menu > a{
    justify-content: center;
}
.container-list-menu-mobile li.more-menu ul a{
    padding-left: 15%;
}
</style>
