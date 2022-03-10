import $ from 'jquery'
import '../../../css/shared/rotatingRoundMenu.css'

/**
 * 定数一覧
 */
const $circle = $('#rotating-menu')
const $item = '.item'
const centerMenuId = '#rotating-menu-button'
const $centerMenu = $('<button id="rotating-menu-button" data-position="right"></button>')
const doorButtonElement = $('<button id="rotating-menu-door-button">menu</button>')
const $menuBackGround = $('<div id="rotating-menu-back-ground"></div>')
const $menuBackGroundId = '#rotating-menu-back-ground'
let $doorButton
const Bigsize = 1.2

/**
 * setItem
 * 1個のitemにおける円の設置処理
 * @param {*初期角度} angle
 * @param {*itemの要素番号} i
 * @param {*設置角度} degree
 */
const setItem = (angle, i, degree) => {
  const $item = $(`.item-${i}`)
  /* outerHeight / outerWidth :margin含めた高さ/幅 */
  const height = $item.outerHeight()
  const width = $item.outerWidth()
  const cirleWidth = $circle.outerWidth()
  /* 円の半径 */
  const cirleRadius = cirleWidth / 2
  const radian = Math.PI * (angle + degree + 90) / 180
  const sinTheta = (angle !== 0) ? Math.sin(radian) : 0
  const cosTheta = (angle !== 0) ? Math.cos(radian) : 0
  /*
   * angle(角度)が0じゃない時
   * translate(-50%){※(-(width/ 2)):円の中心}からx,y軸それぞれ何ピクセル離れたか場所か
   * そうじゃない時y軸に半径分はなれたところに円を設置
   */
  const ypoint = (angle !== 0 || angle !== 360) ? -(height / 2) - (cirleRadius * sinTheta) : -(height / 2) /* - cirleRadius */
  const xpoint = (angle !== 0 || angle !== 360) ? -(width / 2) + (cirleRadius * cosTheta) : -(width / 2)
  $item.css({
    transform: `translate(${xpoint}px, ${ypoint}px)`,
    top: '50%',
    left: '50%'
  })
}

/**
 * すべてのitemの設置処理
 * @param {*} degree
 */
const setAllitems = (degree, linkItems) => {
  let i = 0
  linkItems.forEach((linkItem) => {
    i++
    const angleSingle = 360 / linkItems.length
    const angle = angleSingle * i
    setItem(angle, i, degree)
  })
}

/**
 * 要素を生成して、円上に設置する処理
 * @param {*itemデータ} linkItem
 * @param {*要素番号} elementNum
 * @param {*各要素の設置角度} addRadian
 * @param {*itemの総個数} linkNum
 */
const createLink = (linkItem, elementNum, addRadian, linkNum) => {
  /* angleSingle :円を要素分に等分したときの、1個あたりの角度 */
  const angleSingle = 360 / linkNum
  const angle = angleSingle * elementNum
  const href = (linkItem.href === undefined) ? '#' : linkItem.href
  const className = (linkItem.className === undefined) ? '' : linkItem.className
  const value = (linkItem.value === undefined) ? elementNum : linkItem.value
  $($circle).append(`<a href="${href}" class="item item-${elementNum} ${className}">${value}</a>`)
  setItem(angle, elementNum, addRadian)
}

/**
 * initilazeCircle
 * HTMLから取得したサイズに円を生成する初期化処理
 * メニュー背景設定
 */
const initilazeCircle = (SIZE, POSITION, RIGHT_PX, SCROLL_SPEED) => {
  if (POSITION === 'right') {
    $($circle).css({
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      opacity: '1',
      right: `-${RIGHT_PX}px`
    })
  } else if (POSITION === 'left') {
    $($circle).css({
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      opacity: '1'
    })
    const slideWidth = calculationSlidewidth($($circle).outerWidth(), RIGHT_PX)
    $($circle).css({
      right: `${slideWidth}px`
    })
  }
  const circleOffset = {
    top: $($circle).offset().top,
    left: $($circle).offset().left
  }
  $($circle).after($menuBackGround)
  $($menuBackGroundId).css({
    width: `${screen.width}px`,
    height: `${screen.height}px`,
    transitionDuration: `${SCROLL_SPEED}ms`
  })
  return circleOffset
}

/**
 * menuを閉じる
 * @param {*} pos
 * @param {*} slideWidth
 * @param {*} SCROLL_SPEED
 */
const closeMenu = (pos, slideWidth, SCROLL_SPEED) => {
  $($doorButton).css({
    display: 'block'
  })
  if (pos === 'right') {
    $($circle).animate({
      width: '0px',
      height: '0px'
    }, SCROLL_SPEED)
  } else {
    $($circle).animate({
      width: '0px',
      height: '0px',
      right: `${slideWidth * 2}px`
    }, SCROLL_SPEED)
  }

  $($menuBackGroundId).css({
    opacity: '0'
  })

  setTimeout(() => {
    $($circle).css({
      display: 'none'
    })
    $($item).css({
      display: 'none'
    })
  }, SCROLL_SPEED)
}

/**
 * menuを開く
 * @param {*} pos
 * @param {*} SIZE
 * @param {*} slideWidth
 * @param {*} RIGHT_PX
 * @param {*} SCROLL_SPEED
 */
const openMenu = (pos, SIZE, slideWidth, RIGHT_PX, SCROLL_SPEED, backGround) => {
  $($circle).css({
    display: 'block'
  })
  $($item).css({
    display: 'block'
  })

  if (backGround === true) {
    $($menuBackGroundId).css({
      opacity: '0.7'
    })
  }

  if (pos === 'right') {
    $($circle).animate({
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      right: `-${RIGHT_PX}px`
    }, SCROLL_SPEED)
  } else {
    $($circle).animate({
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      right: `${slideWidth}px`
    }, SCROLL_SPEED)
  }
  setTimeout(() => {
    $($doorButton).css({
      display: 'none'
    })
  }, SCROLL_SPEED)
}

/**
 * itemを初期状態に
 * @param {*} startDegree
 */
const initilazeItems = (startDegree, linkItems) => {
  let i = 0
  linkItems.forEach((linkItem) => {
    i++
    createLink(linkItem, i, startDegree, linkItems.length)
  })
}

/**
 * 表示するitem個数を調整
 * Max10個
 * 数が少ない時は、2~3倍に
 * @param {*} linkItems
 */
const createCorrectLinItem = (linkItems) => {
  const num = linkItems.length
  let corectLinkItems = []
  switch (num) {
    case 2:
      for (let i = 1; i <= 3; i++) {
        corectLinkItems = corectLinkItems.concat(linkItems)
      }
      break
    case 3:
    case 4:
      for (let i = 1; i <= 2; i++) {
        corectLinkItems = corectLinkItems.concat(linkItems)
      }
      break
    case num > 4:
    default:
      corectLinkItems = corectLinkItems.concat(linkItems)
      break
  }
  return corectLinkItems
}

/**
 * 画面上の円の中心座標の取得
 */
const getCenterPosition = () => {
  const offsetTop = $($circle).offset().top
  const offsetleft = $($circle).offset().left
  const height = $($circle).innerHeight()
  const width = $($circle).innerWidth()
  const centerX = offsetleft + (width / 2)
  const centerY = offsetTop + (height / 2)
  const center = { x: centerX, y: centerY }
  return center
}

/**
 * 中央のボタンを配置
 */
const setCenterButton = (POSITION, SCROLL_SPEED) => {
  $($circle).append($centerMenu)
  const height = $centerMenu.outerHeight()
  const width = $centerMenu.outerWidth()

  if (POSITION === 'right') {
    $($centerMenu).text('←')
    $($centerMenu).attr('data-position', 'right')
    $centerMenu.css({
      transform: `translate(${-(width / 2)}px, ${-(height / 2)}px)`,
      transitionDuration: `${SCROLL_SPEED}ms`
    })
  } else if (POSITION === 'left') {
    $($centerMenu).text('→')
    $($centerMenu).attr('data-position', 'left')
    $centerMenu.css({
      transform: `translate(${-(width / 2)}px, ${-(height / 2)}px)`,
      transitionDuration: `${SCROLL_SPEED}ms`
    })
  }
  const centerOffset = {
    top: $(centerMenuId).offset().top,
    left: $(centerMenuId).offset().left
  }
  return centerOffset
}

/**
 *
 * @param {*} POSITION
 * @param {*} SIZE
 */
const setDoorButton = (POSITION, SIZE, circleOffset, centerOffset) => {
  $($circle).before(doorButtonElement)
  $doorButton = $('#rotating-menu-door-button')
  const height = $doorButton.outerHeight()
  const width = $doorButton.outerWidth()
  const ypoint = -(height / 2)
  const position = window.pageYOffset
  let xpoint
  const top = (circleOffset.top) + (SIZE / 2)
  const bottom = document.documentElement.clientHeight - top - height + position
  if (POSITION === 'right') {
    $($doorButton).attr('data-position', 'right')
    xpoint = centerOffset.left - (width / 2)
    $($doorButton).css({
      transform: `translate(${xpoint}px, ${ypoint}px)`,
      bottom: `${bottom}px`,
      left: '0'
    })
  } else {
    $($doorButton).attr('data-position', 'left')
    xpoint = (centerOffset.left) - (width / 2) - ($('body').offset().left)
    $($doorButton).css({
      transform: `translate(${xpoint}px, ${ypoint}px)`,
      bottom: `${bottom}px`
    })
  }
  return xpoint
}

/**
 *
 * @param {*} POSITION
 * @param {*} SIZE
 */
const moveDoorButton = (POSITION, SIZE, circleOffset, pos, defaultXpoint) => {
  const height = $doorButton.outerHeight()
  const width = $doorButton.outerWidth()
  const ypoint = -(height / 2)
  const top = (circleOffset.top) + (SIZE / 2)
  const bottom = document.documentElement.clientHeight - top - height
  let xpoint
  if (POSITION === 'right') {
    if (pos === 'right') {
      xpoint = screen.width - defaultXpoint - width
      $($doorButton).attr('data-position', 'left')
    } else {
      xpoint = defaultXpoint
      $($doorButton).attr('data-position', 'right')
    }
    $($doorButton).css({
      transform: `translate(${xpoint}px, ${ypoint}px)`,
      bottom: `${bottom}px`,
      left: '0'
    })
  } else {
    if (pos === 'right') {
      xpoint = defaultXpoint
      $($doorButton).attr('data-position', 'left')
    } else {
      xpoint = screen.width - defaultXpoint - width - ($('body').offset().left) - 6
      $($doorButton).attr('data-position', 'right')
    }
    $($doorButton).css({
      transform: `translate(${xpoint}px, ${ypoint}px)`,
      bottom: `${bottom}px`
    })
  }
}

/**
 * * 余弦定理をつかった、円上の変化量の計算
 * @param {*} touchStart
 * @param {*} touchMove
 * @param {*} center
 */
const calculationChangeRadian = (touchStart, touchMove, center) => {
  let x
  let y
  x = Math.abs(center.x - touchStart.x)
  y = Math.abs(center.y - touchStart.y)
  const touchStartLine = calculationline(x, y)

  x = Math.abs(center.x - touchMove.x)
  y = Math.abs(center.y - touchMove.y)
  const touchMoveLine = calculationline(x, y)

  x = Math.abs(touchMove.x - touchStart.x)
  y = Math.abs(touchMove.y - touchStart.y)
  const oppositeSideLine = calculationline(x, y)

  /* 余弦定理 */
  const cosRadian = ((touchStartLine * touchStartLine) + (touchMoveLine * touchMoveLine) - (oppositeSideLine * oppositeSideLine)) / (2 * touchStartLine * touchMoveLine)
  const degree = (Math.acos(cosRadian) * 180) / Math.PI
  return degree
}

/**
 * 座標間の距離を計算
 * 戻り値：距離
 * @param {*} x
 * @param {*} y
 */
const calculationline = (x, y) => {
  const line = Math.sqrt((x * x) + (y * y))
  return line
}

/**
 * 時計回りか、半時計回りか
 * 初期値 反時計まわり
 * 戻り値： false{反時計まわり}, true{時計回り}
 * @param {*} touchMove
 * @param {*} touchOldMove
 * @param {*} center
 */
const checkClockwise = (touchMove, touchOldMove, center) => {
  /* ★スタート左上 */
  if (touchOldMove.x <= center.x && touchOldMove.y <= center.y) {
    /* 反時計回りでスタート */
    if (touchMove.x < touchOldMove.x || touchMove.y > touchOldMove.y) {
      return false
      /* 時計回りでスタート */
    } else {
      return true
    }
    /* ★スタート右上 */
  } else if (touchOldMove.x >= center.x && touchOldMove.y <= center.y) {
    /* 反時計回りでスタート */
    if (touchMove.x < touchOldMove.x || touchMove.y < touchOldMove.y) {
      return false
      /* 時計回りでスタート */
    } else {
      return true
    }
    /* ★スタート左下 */
  } else if (touchOldMove.x <= center.x && touchOldMove.y >= center.y) {
    /* 反時計回りでスタート */
    if (touchMove.x > touchOldMove.x || touchMove.y > touchOldMove.y) {
      return false
    } else {
      return true
    }
    /* ★スタート右下 */
  } else if (touchOldMove.x >= center.x && touchOldMove.y >= center.y) {
    /* 反時計回りでスタート */
    if (touchMove.x > touchOldMove.x || touchMove.y < touchOldMove.y) {
      return false
    } else {
      return true
    }
  }
}

/**
 * スタート時時計回りか、半時計回りか
 * 初期値 反時計まわり
 * 戻り値： false{反時計まわり}, true{時計回り}
 * @param {*} touchStart
 * @param {*} touchMove
 * @param {*} center
 */
const setClockwise = (touchStart, touchMove, center) => {
  /* ★スタート左上 */
  if (touchStart.x <= center.x && touchStart.y <= center.y) {
    /* 反時計回りでスタート */
    if (touchMove.x < touchStart.x || touchMove.y > touchStart.y) {
      return false
      /* 時計回りでスタート */
    } else {
      return true
    }
    /* ★スタート右上 */
  } else if (touchStart.x >= center.x && touchStart.y <= center.y) {
    /* 反時計回りでスタート */
    if (touchMove.x < touchStart.x || touchMove.y < touchStart.y) {
      return false
      /* 時計回りでスタート */
    } else {
      return true
    }
    /* ★スタート左下 */
  } else if (touchStart.x <= center.x && touchStart.y >= center.y) {
    /* 反時計回りでスタート */
    if (touchMove.x > touchStart.x || touchMove.y > touchStart.y) {
      return false
    } else {
      return true
    }
    /* ★スタート右下 */
  } else if (touchStart.x >= center.x && touchStart.y >= center.y) {
    /* 反時計回りでスタート */
    if (touchMove.x > touchStart.x || touchMove.y < touchStart.y) {
      return false
    } else {
      return true
    }
  }
}

/**
 * メニューをスライドさせる移動距離の計算
 * 画面幅 - (メニューの円の横幅 - 80px)
 * @param {*#rotating-menuの横幅} width
 */
const calculationSlidewidth = (width, RIGHT_PX) => {
  const sw = screen.width
  const slideWidth = (sw - (width - RIGHT_PX))
  return slideWidth
}

/**
 * ページトップにスクロール
 * @param {configのスクロールスピード*} SCROLL_SPEED
 */
const scrollPageTop = (SCROLL_SPEED) => {
  const speed = SCROLL_SPEED
  const $body = $('html, body')
  const position = $($body).offset().top
  $($body).animate({ scrollTop: position }, speed, 'swing')
}

/**
 * メインモジュール
 * @param {*itemのオブジェクト} RoundMenuConfig
 */
export const rotatingRoundMenu = (RoundMenuConfig) => {
  /* config */
  const SCROLL_SPEED = (RoundMenuConfig.scrollspeead) ? RoundMenuConfig.scrollspeead : 500
  const SIZE = (RoundMenuConfig.size) ? RoundMenuConfig.size : 300
  const POSITION = (RoundMenuConfig.position !== 'left') ? 'right' : 'left'
  const RIGHT_PX = SIZE * 0.32
  const startDegree = (RoundMenuConfig.startDegree) ? RoundMenuConfig.startDegree : 0
  const backGround = (RoundMenuConfig.backGround) ? RoundMenuConfig.backGround : true

  /* メニューitem関連の変数 */
  const touchStart = { x: null, y: null }
  const touchMove = { x: null, y: null }
  const touchOldMove = { x: null, y: null }
  const correctLinkItems = createCorrectLinItem(RoundMenuConfig.linkItems)
  let center
  let stockDegree = 0
  let newDegree
  let oldDegree = 0
  let degree
  let firstTouch
  let phase = 0
  let clockwise

  /**
   * 読み込み時にトップに移動
   */

  /* 円の生成 */
  const circleOffset = initilazeCircle(SIZE, POSITION, RIGHT_PX, SCROLL_SPEED)
  const slideWidth = calculationSlidewidth($($circle).outerWidth(), RIGHT_PX)
  /* itemを円上に設置 */
  initilazeItems(startDegree, correctLinkItems)

  /* 円の中心座標の取得 */
  center = getCenterPosition()

  const centerOffset = setCenterButton(POSITION, SCROLL_SPEED)

  $($circle).css({
    display: 'none'
  })

  setTimeout(() => {
    const pos = $($doorButton).attr('data-position')
    closeMenu(pos, slideWidth, SCROLL_SPEED)
    $($doorButton).css({
      transitionDuration: `${SCROLL_SPEED}ms`
    })
  }, SCROLL_SPEED)

  const defaultXpoint = setDoorButton(POSITION, SIZE, circleOffset, centerOffset, SCROLL_SPEED)

  /**
   * タッチした時
   */
  $($circle).on('touchstart', (event) => {
    touchStart.x = event.originalEvent.touches[0].pageX
    touchStart.y = event.originalEvent.touches[0].pageY
    firstTouch = true
  })

  /**
   * スワイプ時
   */
  $($circle).on('touchmove', (event) => {
    /* スワイプの場合、リンクジャンプを無効 */
    event.preventDefault()
    /* マウスの現在座標を取得 */
    touchMove.x = event.originalEvent.touches[0].pageX
    touchMove.y = event.originalEvent.touches[0].pageY

    /* 時計まわりか。反時計まわりか確認 */
    if (firstTouch === true) {
      clockwise = setClockwise(touchStart, touchMove, center)
      firstTouch = false
    } else {
      clockwise = checkClockwise(touchMove, touchOldMove, center)
    }

    /* 変化角度を取得 */
    newDegree = calculationChangeRadian(touchStart, touchMove, center)

    /* 変化スピードを取得 */
    const speed = Math.abs(oldDegree - newDegree)

    /* 180度、360度、0度時の意図しない折返しを防ぐ */
    if (speed > 2) {
      if (clockwise === false && newDegree > 170 && oldDegree > newDegree) {
        phase = 1
      } else if (clockwise === true && newDegree > 170 && oldDegree > newDegree) {
        phase = 0
      } else if (clockwise === true && newDegree < 10 && oldDegree < newDegree) {
        phase = 1
      } else if (clockwise === false && newDegree < 10 && oldDegree < newDegree) {
        phase = 0
      }
    } else {
      if (clockwise === false && newDegree > 175 && oldDegree > newDegree) {
        phase = 1
      } else if (clockwise === true && newDegree > 175 && oldDegree > newDegree) {
        phase = 0
      } else if (clockwise === true && newDegree < 5 && oldDegree < newDegree) {
        phase = 1
      } else if (clockwise === false && newDegree < 5 && oldDegree < newDegree) {
        phase = 0
      }
    }

    switch (phase) {
      case 1: /* 360~180度 */
        degree = stockDegree + (360 - newDegree)
        break
      case 0: /* 0~180度 */
      default:
        degree = stockDegree + newDegree
        break
    }

    /* itemの再設置 */
    setAllitems(degree, correctLinkItems)

    /* 変化量や回転方向の計算のため、一動作前のデータをストック */
    oldDegree = newDegree
    touchOldMove.x = touchMove.x
    touchOldMove.y = touchMove.y
  })

  /**
   * タッチを解除した時
   */
  $($circle).on('touchend', (event) => {
    /* スタートの値を空に */
    touchStart.x = null
    touchStart.y = null
    touchMove.x = null
    touchMove.y = null
    /* 最後にとまった時の状態を保存 */
    stockDegree = degree
  })

  /* 中央ボタン関連の変数 */
  const touchCenterStart = { x: null, y: null }
  const touchCenterMove = { x: null, y: null }
  const height = $centerMenu.outerHeight()
  const width = $centerMenu.outerWidth()
  let posChangeFlag = false
  let scrollTopFlag = false
  let originalArrow

  /**
   * 中央ボタンをタッチした時
   */
  $(centerMenuId).on('touchstart', (event) => {
    /* 中央ボタンを大きく */
    const $centerMenu = $(event.target)
    originalArrow = $($centerMenu).text()
    $($centerMenu).css({
      width: `${width * Bigsize}px`,
      height: `${height * Bigsize}px`,
      lineHeight: `${height * Bigsize}px`,
      transform: `translate(${-((width * Bigsize) / 2)}px, ${-((height * Bigsize) / 2)}px)`
    })
    touchCenterStart.x = event.originalEvent.touches[0].pageX
    touchCenterStart.y = event.originalEvent.touches[0].pageY
    posChangeFlag = true
  })

  /**
   * 中央ボタンをスワイプさせた時
   */
  $(centerMenuId).on('touchmove', (event) => {
    event.preventDefault()
    touchCenterMove.x = event.originalEvent.touches[0].pageX
    touchCenterMove.y = event.originalEvent.touches[0].pageY
    const slideCheckX = Math.abs(touchCenterStart.x - touchCenterMove.x)
    const slideCheckY = Math.abs(touchCenterStart.y - touchCenterMove.y)
    const pos = $($centerMenu).attr('data-position')
    if (touchCenterMove.y < (touchCenterStart.y - 20) && slideCheckX < 40) {
      $($centerMenu).text('↑')
      scrollTopFlag = true
    } else if (slideCheckX > 40 && slideCheckY < 10) {
      scrollTopFlag = false
      switch (pos) {
        case 'right':
          $($centerMenu).text('←')
          break
        case 'left':
          $($centerMenu).text('→')
          break
        default:
          $($centerMenu).text(originalArrow)
          break
      }
    } else {
      $($centerMenu).text(originalArrow)
    }
  })

  /**
 * 中央ボタンからタッチ解除した時
 */
  $(centerMenuId).on('touchend', (event) => {
    const $centerMenu = $(event.target)
    /* スライドさせる距離を取得 */
    touchCenterMove.x = (touchCenterMove.x === null) ? touchCenterStart.x : touchCenterMove.x
    touchCenterMove.y = (touchCenterMove.y === null) ? touchCenterStart.y : touchCenterMove.y
    const slideCheckX = Math.abs(touchCenterStart.x - touchCenterMove.x)
    const pos = $($centerMenu).attr('data-position')
    if (posChangeFlag === true) {
      if (scrollTopFlag === true) {
        scrollPageTop(SCROLL_SPEED)
        setTimeout(() => {
          $($centerMenu).text(originalArrow)
        }, SCROLL_SPEED)
        scrollTopFlag = false
      } else {
        switch (pos) {
          case 'right':
            if (slideCheckX > 40) {
              posChangeFlag = false
              $($centerMenu).text('→')
              $($centerMenu).attr('data-position', 'left')
              $($doorButton).attr('data-position', 'left')
              $($circle).animate({
                right: `${slideWidth}px`
              }, SCROLL_SPEED)
              moveDoorButton(POSITION, SIZE, circleOffset, pos, defaultXpoint)
            } else if (slideCheckX < 10) {
              closeMenu(pos, slideWidth, SCROLL_SPEED)
            }
            break
          case 'left':
            if (slideCheckX > 40) {
              posChangeFlag = false
              $($centerMenu).text('←')
              $($centerMenu).attr('data-position', 'right')
              $($doorButton).attr('data-position', 'right')
              $($circle).animate({
                right: `-${RIGHT_PX}px`
              }, SCROLL_SPEED)
              moveDoorButton(POSITION, SIZE, circleOffset, pos, defaultXpoint)
            } else if (slideCheckX < 10) {
              closeMenu(pos, slideWidth, SCROLL_SPEED)
            }
            break
          default:
            break
        }
      }
      setTimeout(() => {
        center = getCenterPosition()
      }, SCROLL_SPEED)
    }

    /* 中央ボタンもとの大きさに */
    $($centerMenu).css({
      width: `${width}px`,
      height: `${height}px`,
      lineHeight: `${height}px`,
      transform: `translate(${-(width / 2)}px, ${-(height / 2)}px)`
    })

    /* タッチの座標を初期化 */
    touchCenterStart.x = null
    touchCenterStart.y = null
    touchCenterMove.x = null
    touchCenterMove.y = null
  })

  /* 開閉ボタン関連の変数 */
  const touchDoorStart = { x: null, y: null }
  const touchDoorMove = { x: null, y: null }
  let originalDoor

  /**
   * 開閉ボタンをタッチした時
   */
  $($doorButton).on('touchstart', (event) => {
    const $doorButton = $(event.target)
    originalDoor = $($doorButton).text()
    touchDoorStart.x = event.originalEvent.touches[0].pageX
    touchDoorStart.y = event.originalEvent.touches[0].pageY
    posChangeFlag = true
  })

  /**
   * 開閉ボタンをスワイプさせた時
   */
  $($doorButton).on('touchmove', (event) => {
    event.preventDefault()
    touchDoorMove.x = event.originalEvent.touches[0].pageX
    touchDoorMove.y = event.originalEvent.touches[0].pageY
    const slideCheckX = Math.abs(touchDoorStart.x - touchDoorMove.x)
    const slideCheckY = Math.abs(touchDoorStart.y - touchDoorMove.y)
    const pos = $($doorButton).attr('data-position')
    if (touchDoorMove.y < (touchDoorStart.y - 20) && slideCheckX < 40) {
      $($doorButton).text('↑')
      scrollTopFlag = true
    } else if (slideCheckX > 40 && slideCheckY < 20) {
      scrollTopFlag = false
      switch (pos) {
        case 'right':
          $($doorButton).text('←')
          break
        case 'left':
          $($doorButton).text('→')
          break
        default:
          $($doorButton).text(originalDoor)
          break
      }
    } else {
      $($doorButton).text(originalDoor)
    }
  })

  /**
 * 開閉ボタンからタッチ解除した時
 */
  $($doorButton).on('touchend', (event) => {
    const $doorButton = $(event.target)
    /* スライドさせる距離を取得 */
    touchDoorMove.x = (touchDoorMove.x === null) ? touchDoorStart.x : touchDoorMove.x
    touchDoorMove.y = (touchDoorMove.y === null) ? touchDoorStart.y : touchDoorMove.y
    const slideCheckX = Math.abs(touchDoorStart.x - touchDoorMove.x)
    const pos = $($doorButton).attr('data-position')
    if (posChangeFlag === true) {
      if (scrollTopFlag === true) {
        scrollPageTop(SCROLL_SPEED)
        setTimeout(() => {
          $($doorButton).text(originalArrow)
        }, SCROLL_SPEED)
        scrollTopFlag = false
      } else {
        switch (pos) {
          case 'right':
            if (slideCheckX > 40) {
              posChangeFlag = false
              $($centerMenu).text('→')
              $($centerMenu).attr('data-position', 'left')
              $($doorButton).attr('data-position', 'left')
              $($circle).animate({
                right: `${slideWidth * 2}px`
              }, SCROLL_SPEED)
              moveDoorButton(POSITION, SIZE, circleOffset, pos, defaultXpoint)
            } else if (slideCheckX < 10) {
              openMenu(pos, SIZE, slideWidth, RIGHT_PX, SCROLL_SPEED, backGround)
            }
            break
          case 'left':
            if (slideCheckX > 40) {
              posChangeFlag = false
              $($centerMenu).text('←')
              $($centerMenu).attr('data-position', 'right')
              $($doorButton).attr('data-position', 'right')
              $($circle).animate({
                right: `-${RIGHT_PX}px`
              }, SCROLL_SPEED)
              moveDoorButton(POSITION, SIZE, circleOffset, pos, defaultXpoint)
            } else if (slideCheckX < 10) {
              openMenu(pos, SIZE, slideWidth, RIGHT_PX, SCROLL_SPEED, backGround)
            }
            break
          default:
            break
        }
      }
      setTimeout(() => {
        center = getCenterPosition()
        $($doorButton).text(originalDoor)
      }, SCROLL_SPEED)
    }

    /* タッチの座標を初期化 */
    touchDoorStart.x = null
    touchDoorStart.y = null
    touchDoorMove.x = null
    touchDoorMove.y = null
  })
}
