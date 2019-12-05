import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  // scrollBehavior(to, from, savedPosition) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve({ x: 0, y: 0 })
  //     }, 500)
  //   })
  // },
  routes: [{
      path: '/',
      redirect: '/loading'
    },
    {
      path: '/e_signature_index',
      name: 'e_signature_index',
      //异步加载
      component: () => import( /* webpackChunkName: "index" */ './components/contract/e_signature_index.vue'),
    },
    {
      path: '/index',
      name: 'index',
      //异步加载
      component: () => import( /* webpackChunkName: "index" */ './components/home/index.vue'),
    },
    {
      path: '/AddID',
      name: 'AddID',
      //异步加载
      component: () => import( /* webpackChunkName: "AddID" */ './components/home/addID.vue'),
    },
    {
      path: '/VideoTape',
      name: 'VideoTape',
      //异步加载
      component: () => import( /* webpackChunkName: "VideoTape" */ './components/home/videoTape.vue'),
    },
    {
      path: '/IDInfo',
      name: 'IDInfo',
      //异步加载
      component: () => import( /* webpackChunkName: "IDInfo" */ './components/home/IDInfo.vue'),
    },
    {
      path: '/Authentication',
      name: 'Authentication',
      //异步加载
      component: () => import( /* webpackChunkName: "Authentication" */ './components/home/Authentication.vue'),
    },
    {
      path: '/Success',
      name: 'Success',
      //异步加载
      component: () => import( /* webpackChunkName: "Success" */ './components/home/Success.vue'),
    },

    {
      path: '/ChangeBankCardApplication',
      name: 'ChangeBankCardApplication',
      //异步加载
      component: () => import( /* webpackChunkName: "ChangeBankCardApplication" */ './components/dataFile/ChangeBankCardApplication.vue'),
    },
    {
      path: '/e_signature_list',
      name: 'e_signature_list',
      //异步加载
      component: () => import( /* webpackChunkName: "index" */ './components/contract/e_signature_list.vue'),
    },
    {
      path: '/e_signature_flie',
      name: 'e_signature_flie',
      //异步加载
      component: () => import( /* webpackChunkName: "index" */ './components/contract/e_signature_flie.vue'),
    },
    {
      path: '/e_signature_sccess',
      name: 'e_signature_sccess',
      //异步加载
      component: () => import( /* webpackChunkName: "index" */ './components/contract/e_signature_sccess.vue'),
    },
    {
      path: '/e_signature_sccess_guarantor',
      name: 'e_signature_sccess_guarantor',
      //异步加载
      component: () => import( /* webpackChunkName: "index" */ './components/contract/e_signature_sccess_guarantor.vue'),
    },
    {
      path: '/applyMain',
      name: 'applyMain',
      //异步加载
      component: () => import( /* webpackChunkName: "applyMain" */ './components/easyApply/applyMain.vue'),
    },
    {
      path: '/info',
      name: 'info',
      //异步加载
      component: () => import( /* webpackChunkName: "info" */ './components/easyApply/info.vue'),
    },
    {
      path: '/photo',
      name: 'photo',
      //异步加载
      component: () => import( /* webpackChunkName: "photo" */ './components/easyApply/photo.vue'),
    },
    {
      path: '/photoDemo0',
      name: 'photoDemo0',
      //异步加载
      component: () => import( /* webpackChunkName: "photoDemo0" */ './components/easyApply/photoDemo0.vue'),
    },
    {
      path: '/photoDemo1',
      name: 'photoDemo1',
      //异步加载
      component: () => import( /* webpackChunkName: "photoDemo1" */ './components/easyApply/photoDemo1.vue'),
    },
    {
      path: '/photoDemo2',
      name: 'photoDemo2',
      //异步加载
      component: () => import( /* webpackChunkName: "photoDemo2" */ './components/easyApply/photoDemo2.vue'),
    },
    {
      path: '/submit',
      name: 'submit',
      //异步加载
      component: () => import( /* webpackChunkName: "submit" */ './components/easyApply/submit.vue'),
    },
    {
      path: '/over',
      name: 'over',
      //异步加载
      component: () => import( /* webpackChunkName: "over" */ './components/easyApply/over.vue'),
    },
    {
      path: '/zx',
      name: 'zx',
      //异步加载
      component: () => import( /* webpackChunkName: "zx" */ './components/easyApply/zx.vue'),
    },
    {
      path: '/pdfFlie',
      name: 'pdfFlie',
      //异步加载
      component: () => import( /* webpackChunkName: "pdfFlie" */ './components/easyApply/pdfFlie.vue'),
    },
    {
      path: '/audit',
      name: 'audit',
      //异步加载
      component: () => import( /* webpackChunkName: "audit" */ './components/easyApply/audit.vue'),
    },
    {
      path: '/enclosureDetails',
      name: 'enclosureDetails',
      //异步加载
      component: () => import( /* webpackChunkName: "enclosureDetails" */ './components/easyApply/enclosureDetails.vue'),
    },
    {
      path: '/enclosureMsg',
      name: 'enclosureMsg',
      //异步加载
      component: () => import( /* webpackChunkName: "enclosureMsg" */ './components/easyApply/enclosureMsg.vue'),
    },
    {
      path: '/blh_signature_index',
      name: 'blh_signature_index',
      //异步加载
      component: () => import( /* webpackChunkName: "blh_signature_index" */ './components/blhSign/blh_signature_index.vue'),
    },
    {
      path: '/blh_signature_list',
      name: 'blh_signature_list',
      //异步加载
      component: () => import( /* webpackChunkName: "blh_signature_list" */ './components/blhSign/blh_signature_list.vue'),
    },
    {
      path: '/blh_signature_flie',
      name: 'blh_signature_flie',
      //异步加载
      component: () => import( /* webpackChunkName: "blh_signature_flie" */ './components/blhSign/blh_signature_flie.vue'),
    },
    {
      path: '/blh_signature_sccess',
      name: 'blh_signature_sccess',
      //异步加载
      component: () => import( /* webpackChunkName: "blh_signature_sccess" */ './components/blhSign/blh_signature_sccess.vue'),
    },
    {
      path: '/blh_signature_sccess_guarantor',
      name: 'blh_signature_sccess_guarantor',
      //异步加载
      component: () => import( /* webpackChunkName: "blh_signature_sccess_guarantor" */ './components/blhSign/blh_signature_sccess_guarantor.vue'),
    },
    {
      path: '/loading',
      name: 'loading',
      //异步加载
      component: () => import( /* webpackChunkName: "loading" */ './components/cashLoan/loading.vue'),
    },
    {
      path: '/signIn',
      name: 'signIn',
      //异步加载
      component: () => import( /* webpackChunkName: "signIn" */ './components/cashLoan/signIn.vue'),
    },
    {
      path: '/bindIdCard',
      name: 'bindIdCard',
      //异步加载
      component: () => import( /* webpackChunkName: "bindIdCard" */ './components/cashLoan/bindIdCard.vue'),
    },
    {
      path: '/uploadIdCard',
      name: 'uploadIdCard',
      //异步加载
      component: () => import( /* webpackChunkName: "uploadIdCard" */ './components/cashLoan/uploadIdCard.vue'),
    },
    {
      path: '/IdCardInfo',
      name: 'IdCardInfo',
      //异步加载
      component: () => import( /* webpackChunkName: "IdCardInfo" */ './components/cashLoan/IdCardInfo.vue'),
    },
    {
      path: '/borrowMoney',
      name: 'borrowMoney',
      //异步加载
      component: () => import( /* webpackChunkName: "borrowMoney" */ './components/cashLoan/borrowMoney.vue'),
    },
    {
      path: '/mine',
      name: 'mine',
      //异步加载
      component: () => import( /* webpackChunkName: "mine" */ './components/cashLoan/mine.vue'),
    },
    {
      path: '/loanMain',
      name: 'loanMain',
      //异步加载
      component: () => import( /* webpackChunkName: "loanMain" */ './components/cashLoan/loanMain.vue'),
    },
    {
      path: '/applyDetailed',
      name: 'applyDetailed',
      //异步加载
      component: () => import( /* webpackChunkName: "applyDetailed" */ './components/cashLoan/applyDetailed.vue'),
    },
    {
      path: '/addBankCard',
      name: 'addBankCard',
      //异步加载
      component: () => import( /* webpackChunkName: "addBankCard" */ './components/cashLoan/addBankCard.vue'),
    },
    {
      path: '/uploadBankCard',
      name: 'uploadBankCard',
      //异步加载
      component: () => import( /* webpackChunkName: "uploadBankCard" */ './components/cashLoan/uploadBankCard.vue'),
    },
    {
      path: '/addContacts',
      name: 'addContacts',
      //异步加载
      component: () => import( /* webpackChunkName: "addContacts" */ './components/cashLoan/addContacts.vue'),
    },
    {
      path: '/bankCardPhoto',
      name: 'bankCardPhoto',
      //异步加载
      component: () => import( /* webpackChunkName: "bankCardPhoto" */ './components/cashLoan/bankCardPhoto.vue'),
    },
    {
      path: '/confirmSubmit',
      name: 'confirmSubmit',
      //异步加载
      component: () => import( /* webpackChunkName: "confirmSubmit" */ './components/cashLoan/confirmSubmit.vue'),
    },
    {
      path: '/submitSuccess',
      name: 'submitSuccess',
      //异步加载
      component: () => import( /* webpackChunkName: "submitSuccess" */ './components/cashLoan/submitSuccess.vue'),
    },
    {
      path: '/submitFail',
      name: 'submitFail',
      //异步加载
      component: () => import( /* webpackChunkName: "submitFail" */ './components/cashLoan/submitFail.vue'),
    },
    {
      path: '/myQuota',
      name: 'myQuota',
      //异步加载
      component: () => import( /* webpackChunkName: "myQuota" */ './components/cashLoan/myQuota.vue'),
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      //异步加载
      component: () => import( /* webpackChunkName: "myOrder" */ './components/cashLoan/myOrder.vue'),
    },
    {
      path: '/orderDetails',
      name: 'orderDetails',
      //异步加载
      component: () => import( /* webpackChunkName: "orderDetails" */ './components/cashLoan/orderDetails.vue'),
    },
    {
      path: '/againAddBankCard',
      name: 'againAddBankCard',
      //异步加载
      component: () => import( /* webpackChunkName: "againAddBankCard" */ './components/cashLoan/againAddBankCard.vue'),
    },
    {
      path: '/againBankCardPhoto',
      name: 'againBankCardPhoto',
      //异步加载
      component: () => import( /* webpackChunkName: "againBankCardPhoto" */ './components/cashLoan/againBankCardPhoto.vue'),
    },
    {
      path: '/againConfirmSubmit',
      name: 'againConfirmSubmit',
      //异步加载
      component: () => import( /* webpackChunkName: "againConfirmSubmit" */ './components/cashLoan/againConfirmSubmit.vue'),
    },
    {
      path: '/clEnclosureMsg',
      name: 'clEnclosureMsg',
      //异步加载
      component: () => import( /* webpackChunkName: "clEnclosureMsg" */ './components/cashLoan/clEnclosureMsg.vue'),
    },
    {
      path: '/clPdfFlie',
      name: 'clPdfFlie',
      //异步加载
      component: () => import( /* webpackChunkName: "clPdfFlie" */ './components/cashLoan/clPdfFlie.vue'),
    },
    {
      path: '/againAddBankCardSuccess',
      name: 'againAddBankCardSuccess',
      //异步加载
      component: () => import( /* webpackChunkName: "againAddBankCardSuccess" */ './components/cashLoan/againAddBankCardSuccess.vue'),
    },
    {
      path: '/myRepayment',
      name: 'myRepayment',
      //异步加载
      component: () => import( /* webpackChunkName: "myRepayment" */ './components/cashLoan/myRepayment.vue'),
    },
    {
      path: '/repaymentDetails',
      name: 'repaymentDetails',
      //异步加载
      component: () => import( /* webpackChunkName: "repaymentDetails" */ './components/cashLoan/repaymentDetails.vue'),
    },
    {
      path: '/changeBankCard',
      name: 'changeBankCard',
      //异步加载
      component: () => import( /* webpackChunkName: "changeBankCard" */ './components/cashLoan/changeBankCard.vue'),
    },
    {
      path: '/setUp',
      name: 'setUp',
      //异步加载
      component: () => import( /* webpackChunkName: "setUp" */ './components/cashLoan/setUp.vue'),
    },
    {
      path: '/personalInformation',
      name: 'personalInformation',
      //异步加载
      component: () => import( /* webpackChunkName: "personalInformation" */ './components/cashLoan/personalInformation.vue'),
    },
    {
      path: '/htmlShow',
      name: 'htmlShow',
      //异步加载
      component: () => import( /* webpackChunkName: "htmlShow" */ './components/cashLoan/htmlShow.vue'),
    },
    {
      path: '/AddressConfirmation',
      name: 'AddressConfirmation',
      //异步加载
      component: () => import( /* webpackChunkName: "AddressConfirmation" */ './components/dataFile/AddressConfirmation.vue'),
    },
    {
      path: '/PersonalInfoWarrant',
      name: 'PersonalInfoWarrant',
      //异步加载
      component: () => import( /* webpackChunkName: "PersonalInfoWarrant" */ './components/dataFile/PersonalInfoWarrant.vue'),
    },
    {
      path: '/PersonalConsumption',
      name: 'PersonalConsumption',
      //异步加载
      component: () => import( /* webpackChunkName: "PersonalConsumption" */ './components/dataFile/PersonalConsumption.vue'),
    },
    {
      path: '/PersonalLoan',
      name: 'PersonalLoan',
      //异步加载
      component: () => import( /* webpackChunkName: "PersonalLoan" */ './components/dataFile/PersonalLoan.vue'),
    },
    {
      path: '/PersonalConsumptionApplication',
      name: 'PersonalConsumptionApplication',
      //异步加载
      component: () => import( /* webpackChunkName: "PersonalConsumptionApplication" */ './components/dataFile/PersonalConsumptionApplication.vue'),
    },
    {
      path: '/PersonalLoanApplication',
      name: 'PersonalLoanApplication',
      //异步加载
      component: () => import( /* webpackChunkName: "PersonalLoanApplication" */ './components/dataFile/PersonalLoanApplication.vue'),
    },
  ]
})