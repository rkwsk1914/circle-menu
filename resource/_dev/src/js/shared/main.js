import $ from 'jquery'
import '../../css/shared/rotatingRoundMenu.css'
import { rotatingRoundMenu } from './modules/rotatingRoundMenu'
import '../../css/shared/substyle.css'
import '../../scss/shared/style.scss'

/*
--------------------------------------------------
 * 【設定の概要】
  -----------------------------------------------
 * linkItems
 *    最大個数は10個
 *    2個の場合は、3倍
 *    3、4個の場合は、2倍
 * scrollspeed
 *    ページトップに戻る際のスクロールスピード
 * startDegree
 *    表示初期のメニューの円計表示における位置を設定
--------------------------------------------------
*/
const RoundMenuConfig = {
  linkItems: [
    { value: 'TOP', href: '#', className: 'menu1' },
    { value: 'MENU', href: '#', className: 'menu2' },
    { value: 'LOCATION', href: '#', className: 'menu3' },
    { value: 'HOURS', href: '#', className: 'menu4' }
  ],
  scrollspeead: 500,
  startDegree: 0
}

/**
 * デバイス判定
 */
const judgeDevice = () => {
  const ua = window.navigator.userAgent
  let device

  if (ua.indexOf('iPhone') > 0) {
    device = 'iPhone'
  } else if (ua.indexOf('iPod') > 0) {
    device = 'iPod'
  } else if (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
    device = 'Andoroid'
  } else if (ua.indexOf('iPad') > 0) {
    device = 'iPad'
  } else if (ua.indexOf('Android') > 0) {
    device = 'Tablet'
  } else {
    device = 'PC'
  }
  console.log(window.navigator.userAgent)
  return device
}

/**
 * PC用の表示
 */
const showAttention = (device) => {
  const attenstion = $(`
    <div id="attention-mobile-page">
    <p>スマートフォン専用ページになります。</p>
    </div>
  `)
  $('#cafe-page').prepend(attenstion)
}

/*
--------------------------------------------------
 * メイン
--------------------------------------------------
*/
$(window).on('load', () => {
  const device = judgeDevice()
  if (device === 'iPhone' || device === 'Andoroid') {
    rotatingRoundMenu(RoundMenuConfig)
  } else {
    showAttention(device)
  }
})
