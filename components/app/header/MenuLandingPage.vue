<template>
  <v-container>
    <coming-soon-dialog v-model="dialog" />
    <div class="container-menu header-images">
      <div class="navbar-right">
        <div class="contact-menu-header">
          <div class="message">
            <strong>Call now</strong> to speak with a specialist
          </div>
          <div class="contact-phone">
            <img loading="lazy" class="img-phone-call" src="https://playgardenonline.com/wp-content/uploads/2022/01/phone-call-1.svg" alt="Call to Playgarden Prep Online">
            <a href="tel:+646-504-4716" class="number-phone">+1 (646)-504-4716</a>
          </div>
        </div>

        <ul v-if="!hideNavbarOptions" class="menu-header logged-">
          <li class="only-desktop link-option">
            <a href="https://playgardenonline.com/">Home</a>
          </li>
          <li class="only-desktop link-option link-option-with-icon">
            <a href="#admisions" class="menu-view-more">
              <span>Admissions</span>
              <v-icon class="menu-view-icon" large>
                mdi-chevron-down
              </v-icon>
            </a>
            <div class="container-submenu">
              <ul class="submenu">
                <li><a href="https://playgardenonline.com/virtual-preschool/">Virtual Preschool</a></li>
                <li><a href="https://playgardenonline.com/plans/">Enrollment Plans</a></li>
                <li><a href="https://playgardenonline.com/testimonials/">Parent Testimonials</a></li>
                <li><a href="https://playgardenprep.com/group-solutions/">Group Solutions</a></li>
                <li><a href="https://playgardenonline.com/esl/">English as a Second Language</a></li>
              </ul>
            </div>
          </li>
          <li class="only-desktop link-option link-option-with-icon">
            <a href="#the-virtual-preschool" class="menu-view-more">
              <span>Resources</span>
              <v-icon class="menu-view-icon" large>
                mdi-chevron-down
              </v-icon>
            </a>
            <div class="container-submenu">
              <ul class="submenu">
                <li><a href="https://playgardenonline.com/how-it-works/">How it Works</a></li>
                <!-- <li><a href="https://playgardenonline.com/do-it-yourself/">DIY</a></li> -->
                <li><a href="https://playgardenonline.com/blog">Blog</a></li>
                <li><a href="https://playgardenonline.com/specialized-learning/">Specialized Learning</a></li>
                <li><a href="https://playgardenonline.com/do-it-yourself/">Do it Yourself</a></li>
              </ul>
            </div>
          </li>
          <li class="only-desktop link-option link-option-with-icon">
            <a href="#the-virtual-preschool" class="menu-view-more">
              <span>About us</span>
              <v-icon class="menu-view-icon" large>
                mdi-chevron-down
              </v-icon>
            </a>
            <div class="container-submenu">
              <ul class="submenu">
                <li><a href="https://playgardenonline.com/school/help/">FAQs</a></li>
                <li><a href="https://playgardenonline.com/about-us/">About Us</a></li>
                <li><a href="https://playgardenonline.com/your-teachers/">Your Teachers</a></li>
              </ul>
            </div>
          </li>
          <li class="only-desktop link-option">
            <a @click="openDialog">Community</a>
          </li>
          <li class="login link-option">
            <a href="https://playgardenonline.com/school/auth/login">
              <span>Log In</span>
              <img loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/01/log-in.svg" alt="Login - Playgarden Prep Online" class="login-icon">
            </a>
          </li>
          <li class="header-action-btn">
            <a href="https://playgardenonline.com/school/auth/parent">TRY FOR FREE</a>
          </li>
          <li class="logged-active">
            <a href="https://playgardenonline.com/school/auth/parent">Go to Preschool</a>
          </li>
        </ul>

        <ul v-else class="menu-header">
          <li v-if="showLogInNavbar" class="header-action-btn">
            <a href="https://playgardenonline.com/school/auth/login">LOG IN</a>
          </li>
          <li v-if="showSignUpNavbar" class="header-action-btn">
            <a href="https://playgardenonline.com/school/auth/preschool/normal">SIGN UP NOW</a>
          </li>
        </ul>
      </div>
      <div id="modal-menu-pg" class="modal-pg left strech">
        <div class="modal-content fade fade-in-left fade-out-left">
          <img loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/02/close-popup.svg" alt="Close Menu" class="modal-close btn-up-close">
          <div class="content-menu-mobile">
            <a href="https://playgardenonline.com/" class="logo-menu-navbar">
              <img loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/01/logo-text.svg" alt="Playgarden Prep Online - Logo">
            </a>
            <div class="container-list-menu-mobile">
              <ul>
                <li>
                  <a href="https://playgardenonline.com/">Home</a>
                </li>
                <li class="more-menu">
                  <a href="#admissions" class="more-menu-link">
                    <span>Admissions</span>
                    <i class="fas fa-sort-down" />
                  </a>
                  <ul class="submenu">
                    <li><a href="https://playgardenonline.com/plans/">Enrollment Plans</a></li>
                    <li><a href="https://playgardenonline.com/testimonials/">Parent Testimonials</a></li>
                  </ul>
                </li>
                <li class="more-menu">
                  <a href="#the-virtual-preschool" class="more-menu-link">
                    <span>Virtual Preschool</span>
                    <i class="fas fa-sort-down" />
                  </a>
                  <ul class="submenu">
                    <li>
                      <a href="https://playgardenonline.com/virtual-preschool/">Preschool and
                        Pre-K</a>
                    </li>
                    <li><a href="https://playgardenonline.com/how-it-works/">How it Works</a></li>
                    <!-- <li><a href="https://playgardenonline.com/do-it-yourself/">DIY</a></li> -->
                    <li><a href="https://playgardenonline.com/blog">Blog</a></li>
                    <li><a href="https://playgardenonline.com/your-teachers/">Your Teachers</a></li>
                    <li><a href="https://playgardenonline.com/specialized-learning/">Specialized Learning</a></li>
                    <li><a href="https://playgardenonline.com/do-it-yourself/">Do it Yourself</a></li>
                  </ul>
                </li>
                <!-- <li>
                                <a href="https://playgardenonline.com/about-us">About Us</a>
                            </li> -->
              </ul>
            </div>

            <a href="https://playgardenonline.com/school/auth/login" class="login-navbar">
              <span>Login</span>
              <img loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/01/log-in.svg" alt="Playgarden Prep Online Login">
            </a>
            <a href="https://playgardenonline.com/school/auth/parent" class="try-to-free-navbar">Try To Free</a>
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
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, useRoute, ref } from '@nuxtjs/composition-api'
import ComingSoonDialog from './ComingSoonDialog.vue'

export default defineComponent({
  name: 'MenuLandingPage',
  head: {
    script: [
      {
        src: './script.js'
      }
    ]
  },
  components: {
    ComingSoonDialog
  },
  setup() {
    const route = useRoute()
    const dialog = ref(false)
    const hideNavbarOptions = computed(() => route.value.name === 'auth-preschool-normal' || route.value.name === 'auth-login')
    const showLogInNavbar = computed(() => route.value.name === 'auth-preschool-normal')
    const showSignUpNavbar = computed(() => route.value.name === 'auth-login')
    const openDialog = () => {
      dialog.value = true
    }

    return {
      hideNavbarOptions,
      showLogInNavbar,
      showSignUpNavbar,
      openDialog,
      dialog
    }
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
body,html{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* DESDE AQUÍ */
header, header *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
header{
    font-family: 'Poppins', sans-serif;
    background-clip: padding-box; /* Safari fix */
}
.scroll-disabled{
    overflow: hidden;
}

/*  NAV MENU - mobile first */

header{
    height: var(--offsetMarginHeader,146px);
}
nav.header-landing-2{
    background: #FFFFFF;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    -webkit-box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    -moz-box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    display: flex;
    justify-content: center;
}
nav .container-menu{
    width: 100%;
    max-width: 1236px;
    padding: 33px 24px 21px;
    position: relative;
    display: grid;
    gap: 20px;
    justify-content: center;
}
nav .icon-menu{
    cursor: pointer;
    position: absolute;
    width: 22.79;
    height: 22.79;
    top: 43px;
    left: 24px;
}
nav .logo-menu{
    width: 209px;
    height:44px;
    margin: auto;
}
nav .logo-menu img{
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
}
nav.sticky {
    position: fixed;
    top: var(--top-menu-sticky,0);
    width: 100%;
    z-index: 9999;
}
.link-option a, .link-option a span {
    color: #707070;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    outline: none;
    transition: 0.3s all;
    font-size: 18px;
    font-size: 1.125rem;
    line-height: 1.6875rem;
    font-weight: 500;
    letter-spacing: .96px;
}
.link-option-with-icon a span {
  margin-right: -12px;
}
.menu-view-icon {
  margin-right: -12px;
}

@media (max-width:1023px) {
    nav.sticky-remove-btns .navbar-right{
        display: none;
    }
    nav.sticky-remove-btns .navbar-right{
        align-items: center;
    }
}
@media (min-width:768px) {
    nav .container-menu{
        padding: 71px 56px 55px;
        gap: 38px;
    }
    nav .icon-menu{
        width: 51.28px;
        height: 40.64px;
        top: 89px;
        left: 56px;
    }
    nav .logo-menu{
        width: 427.66px;
        height:90.13px;
    }
}
@media (min-width:1024px) {
    nav .container-menu{
        grid-template-columns: repeat(2, auto);
        padding: 31px 24px;
        gap: 20px;
        justify-content: space-between;
    }
    nav .icon-menu{
        display: none;
    }
    nav .logo-menu{
        width: 289.43px;
        height:61px;
    }
    .navbar-right{
        display: grid;
        gap: 20px;
        justify-content: flex-end;
    }
}
@media (min-width:1236px) {
    nav .container-menu{
        padding: 31px 0;
        justify-content: space-between;
    }
}
@media (min-width:1366px) {
    nav .container-menu.header-images{
        max-width: 1500px;
        padding-left: 56px;
        padding-right: 56px;
    }
    nav .container-menu{
        max-width: 1236px;
    }
}
@media (min-width:768px) and (max-width:1023px) and (max-height:999px) {
    nav .container-menu{
        grid-template-columns: repeat(2, auto);
        padding: 31px 56px 31px 120px;
        gap: 20px;
        justify-content: space-between;
    }
    nav .icon-menu{
        cursor: pointer;
        position: absolute;
        width: 22.79;
        height: 22.79;
        top: 33px;
        left: 24px;
    }
    nav .logo-menu{
        width: 209px;
        height:44px;
        margin: auto;
    }
    nav.sticky-remove-btns .navbar-right{
        display: block;
    }
}

/* POPUP */
.modal-pg{
    display: none;
    position: fixed;
    transition: all 0.5s;
    width: 100vw;
    height: 100%;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    z-index: 9999999;
    overflow: auto;
}
.modal-pg.left{
    justify-content: flex-start;
}
.modal-pg.strech{
    align-items: stretch;
}
.modal-pg.active{
    display: flex;
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.modal-pg.closing {
    display: flex;
}
.modal-content{
    position: relative;
    background-color: white;
    width: var(--width-modal-pg,80%);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);

    max-width: var(--max-width-modal-pg,1236px);
}
.modal-pg.active .modal-content.fade-in-left{
    -webkit-animation-name: fadeInLeft;
    -webkit-animation-duration: .5s;
    animation-name: fadeInLeft;
    animation-duration: .5s
}
.modal-pg.closing .modal-content.fade-out-left{
    -webkit-animation-name: fadeOutLeft;
    -webkit-animation-duration: .5s;
    animation-name: fadeOutLeft;
    animation-duration: .5s
}

.modal-pg.active .modal-content.fade-in{
    -webkit-animation-name: fadeIn;
    -webkit-animation-duration: .5s;
    animation-name: fadeIn;
    animation-duration: .5s
}
.modal-pg.closing .modal-content.fade-out{
    -webkit-animation-name: fadeOut;
    -webkit-animation-duration: .5s;
    animation-name: fadeOut;
    animation-duration: .5s
}

/* Add Animation */
@-webkit-keyframes fadeInLeft {
    to {left:0; opacity:1}
    from {left:-100%; opacity:0}
}
@keyframes fadeInLeft {
    to {left:0; opacity:1}
    from {left:-100%; opacity:0}
}

@-webkit-keyframes fadeOutLeft {
    from {left:0; opacity:1}
    to {left:-100%; opacity:0}
}
@keyframes fadeOutLeft {
    from {left:0; opacity:1}
    to {left:-100%; opacity:0}
}

/* Add Animation */
@-webkit-keyframes fadeIn {
    from {opacity:0}
    to {opacity:1}
}
@keyframes fadeIn {
    from {opacity:0}
    to {opacity:1}
}
@-webkit-keyframes fadeOut {
    from {opacity:1}
    to {opacity:0}
}
@keyframes fadeOut {
    from {opacity:1}
    to {opacity:0}
}

/* CONTACT MENU */

.contact-menu-header, .contact-menu-header *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.contact-menu-header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.contact-menu-header .message{
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0.96px;
    color: #707070;
    margin-right: 27px;
}

.message strong {
  color: #4F4F4F;
  font-weight: bold !important;
}

.contact-menu-header .contact-phone{
    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    justify-content: center;
    column-gap: 4px;
    text-align: center;
}
.contact-menu-header .img-phone-call{
    width: 21px;
    height: 21px;
}
.contact-menu-header .number-phone{
    font-weight: normal;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.96px;
    color: #707070;
    text-decoration: none;
}
.contact-menu-header .number-phone:hover{
    color: #F58E00;
}

/* MENU */
.menu-header{
    list-style: none;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 24px;
    transition: 0.5s all;
}
.menu-header.logged{
    grid-template-columns: repeat(2,auto);
}
.menu-header > li > a{
    color: #707070;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.96px;
    text-decoration: none;
    display: inline-flex;
    outline: none;
}
.menu-header > li.login a{
    display: grid;
    grid-template-columns: repeat(2, auto);
}
.menu-header > li:hover > a,
.menu-header > li > a:focus{
    color: #68C453;
}
.menu-header .login a{
    font-weight: normal;
    color: #707070;
}
.menu-header li.header-action-btn a {
    min-width: 165px;
    display: flex;
    justify-content: center;
}
.menu-header li.header-action-btn a,
.menu-header li.logged-active a{
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.96px;
    font-weight: 800;
    background: #FFAB37;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    color: #ffffff;
    padding: 8px 16px;
}
.menu-header li.logged-active:hover a,
.menu-header li.header-action-btn:hover a,
.menu-header li.logged-active a:focus,
.menu-header li.header-action-btn a:focus{
    background-color: #F58E00;
    color: #ffffff;
}
.menu-header .logged-active{
    display: none;
}
.menu-header .logged-active{
    display: none;
}
.menu-header .logged .logged-active{
    text-align: center;
    display: block;
}
.menu-header .logged-active{
    text-align: center;
    width: 100%;
}
.menu-header .logged-active a{
    width: 100%;
    display: block;
    text-align: center;
}
.menu-header .logged .logged-active{
    display: block;
}
.menu-header .logged .header-action-btn,
.menu-header .logged .login{
    display: none;
}
.menu-header > li{
    position: relative;
    cursor: pointer;
}
.menu-header > li{
    display: grid;
    grid-template-columns: repeat(2,auto);
    align-items: center;
}
.menu-header > li .container-submenu{
    width: 290px;
    display: none;
    position: absolute;
    height: auto;
    padding-top: 20px;
    top: 40px;
    right: -30px;
    z-index: 9;
}
.menu-header > li .submenu{
    list-style: none;
    position: relative;
    width: 100%;
    height: auto;
    display: grid;
    align-items: center;
    background: #ffffff;
    box-shadow: 8px 8px 24px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 8px 8px 24px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 8px 8px 24px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
}

.menu-header > li a:active .container-submenu,
.menu-header > li a:focus + .container-submenu,
.menu-header > li a:focus ~ .container-submenu,
.menu-header > li:hover .container-submenu{
    display: block;
}
.menu-header .submenu::after{
    content: "";
    position: absolute;
    height: 50px;
    width: 100%;
    background-color: rgba(255,255,255,0);
    top: -35px;
    left: 0;
    z-index: -2;
    cursor: default;
}
.menu-header .submenu::before{
    content: "";
    position: absolute;
    height: 40px;
    width: 40px;
    top: -20px;
    background: #ffffff;
    box-shadow: 0px -8px 12px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0px -8px 12px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px -8px 12px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    right: 36px;
    transform: rotate(45deg);
    z-index: -1;
}
.menu-header .submenu li{
    width: 100%;
    position: relative;
}
.menu-header .submenu li::before{
    content: "";
    position: absolute;
    bottom: 0;
    height: 1px;
    width: 188px;
    background-color: #E8E8E8;
    left: 50%;
    transform: translateX(-50%);
}
.menu-header .submenu li:last-child::before{
    display: none;
}
.menu-header .submenu li:first-child a{
    border-radius: 8px 8px 0 0;
}
.menu-header .submenu li:last-child a{
    border-radius: 0 0 8px 8px;
}
.menu-header .submenu a{
    font-size: 18px;
    line-height: 27px;
    color: #606060;
    text-decoration: none;
    text-align: start;
    display: block;
    padding: 15px 24px;
    padding-left: 49px;
    width: 100%;
}
.menu-header .submenu a span{
    margin-left: 9px;
}
.menu-header .submenu li:hover a{
    background-color: #E8E8E8;
}
.menu-header.menu-mobile{
    justify-content: center;
}
.menu-header.menu-mobile .more-menu{
    display: none
}

@media (max-width:1200px) {
    .menu-header{
        align-items: center;
        justify-content: flex-end;
        gap: 10px 25px;
    }
}

@media (max-width:1024px) {
    .menu-header .only-desktop{
        display: none;
    }
    .menu-header{
        grid-template-columns: repeat(2,auto);
        align-items: center;
        justify-content: flex-end;
    }
    .menu-header.logged{
        display: block;
        width: 100%;
        margin: auto;
    }
    .menu-header li.login a{
        font-size: 18px;
        line-height: 27px;
        letter-spacing: 1.34194px;
        justify-content: center;
        padding: 8px 0;
    }
    .menu-header > li.login a img{
        display: block;
    }
    .menu-header li.header-action-btn a,
    .menu-header li.logged-active a{
        text-align: center;
        font-size: 18px;
        line-height: 27px;
        letter-spacing: 0.929598px;
        padding: 8px 20px;
        display: block;
    }
}
@media (max-width:767px) {
    .menu-header{
        max-width: 250px;
    }
    .menu-header{
        column-gap: 32px;
    }
    .menu-header li.login a{
        font-size: 16.19px;
        line-height: 24px;
        letter-spacing: 0.78px;
    }
    .menu-header li.header-action-btn a,
    .menu-header li.logged-active a{
        font-weight: 800;
        font-size: 11.76px;
        line-height: 18px;
        letter-spacing: 0.564px;
        color: #ffffff;
        padding: 5px 9px;
    }
}
@media (max-width:299px) {
    .menu-header{
        grid-template-columns: 1fr;
        gap: 32px;
    }
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
