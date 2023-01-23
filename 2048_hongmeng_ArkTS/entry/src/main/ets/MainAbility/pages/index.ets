/**
 * 厦门大学计算机专业 | 前华为工程师
 * 专注《零基础学编程系列》  http://lblbc.cn/blog
 * 包含：Java | 安卓 | 前端 | Flutter | iOS | 小程序 | 鸿蒙
 * 公众号：蓝不蓝编程
 */
import display from '@ohos.display'
import { GameController } from '../model/GameController'
import { GameDataSource } from '../model/GameDataSource'
import { ColorUtil } from '../util/ColorUtil'

@Entry
@Component
struct Lblbc {
  @State flatCellArr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  private gameController: GameController = new GameController()
  private colorUtil: ColorUtil = new ColorUtil()
  @State @Watch("onGameOver") isGameOver: boolean = false
  gameOverDialogController: CustomDialogController = new CustomDialogController({
    builder: GameOverView({
      startGame: this.startGame.bind(this)
    }),
    autoCancel: false
  })
  @State screenSize: {
    x: number,
    y: number
  } = { x: px2vp(1080), y: px2vp(0) }

  onGameOver() {
    if (this.isGameOver === true) {
      this.gameOverDialogController.open()
    }
  }

  startGame() {
    this.flatCellArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.gameController.init(this.flatCellArr)
    this.flatCellArr = this.gameController.getFlatCellArr()
    this.isGameOver = false
  }

  moveUp() {
    this.gameController.moveUp()
    this.updateCells()
  }

  moveDown() {
    this.gameController.moveDown()
    this.updateCells()
  }

  moveLeft() {
    this.gameController.moveLeft()
    this.updateCells()
  }

  moveRight() {
    this.gameController.moveRight()
    this.updateCells()
  }

  updateCells() {
    this.flatCellArr = this.gameController.getFlatCellArr()
    this.isGameOver = this.gameController.isGameOver
  }

  aboutToAppear() {
    display.getDefaultDisplay((err, data) => {
      if (data.height > data.width) {
        this.screenSize = { x: px2vp(data.width), y: px2vp(data.height) }
      } else {
        this.screenSize = { x: px2vp(750), y: px2vp(data.width) }
      }
    })
    this.startGame()
  }

  build() {
    Column() {
      Column() {
        Grid() {
          LazyForEach(new GameDataSource(this.flatCellArr), (item) => {
            GridItem() {
              Text(`${item === 0 ? '' : item}`)
                .fontSize('85px')
                .fontColor(item <= 4 ? '#000' : '#fcf8f5')
                .fontWeight(FontWeight.Bolder)
                .backgroundColor('#f0fff0')
                .width('100%')
                .height('100%')
                .textAlign(TextAlign.Center)
                .borderRadius(10)
                .backgroundColor(this.colorUtil.getCellBackgroundColor(item))
            }
          })
        }
        .columnsTemplate('1fr 1fr 1fr 1fr')
        .rowsTemplate('1fr 1fr 1fr 1fr')
        .columnsGap(10)
        .rowsGap(10)
        .width(this.screenSize.x)
        .padding(10)
        .backgroundColor('rgba(80,69,46,0.26)')
        .height(this.screenSize.x)
        .borderRadius(10)
        .gesture(GestureGroup(GestureMode.Exclusive,
        PanGesture({ direction: PanDirection.Left }).onActionEnd(() => {
          this.moveLeft()
        }),
        PanGesture({ direction: PanDirection.Right }).onActionEnd(() => {
          this.moveRight()
        }),
        PanGesture({ direction: PanDirection.Up }).onActionEnd(() => {
          this.moveUp()
        }),
        PanGesture({ direction: PanDirection.Down }).onActionEnd(() => {
          this.moveDown()
        })
        ))
        Button('向上', { type: ButtonType.Normal })
          .borderRadius(5)
          .width(100)
          .margin({ top: 20 })
          .onClick(() => {
            this.moveUp()
          })
        Row() {
          Button('向左', { type: ButtonType.Normal })
            .borderRadius(5)
            .width(100)
            .onClick(() => {
              this.moveLeft()
            })
          Button('向右', { type: ButtonType.Normal })
            .borderRadius(5)
            .width(100)
            .margin({ left: 50 })
            .onClick(() => {
              this.moveRight()
            })
        }.margin({ top: 20 })

        Button('向下', { type: ButtonType.Normal })
          .borderRadius(5)
          .width(100)
          .margin({ top: 20 })
          .onClick(() => {
            this.moveDown()
          })
      }
      .alignItems(HorizontalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .height('100%')
      .width('100%')
    }
    .alignItems(HorizontalAlign.Center)
    .justifyContent(FlexAlign.Start)
    .width('100%')
    .height('100%')
  }
}

@CustomDialog
struct GameOverView {
  controller: CustomDialogController
  startGame: () => void

  build() {
    Column() {
      Text('游戏结束')
        .fontSize(30)
        .fontWeight(FontWeight.Medium)
        .margin({ top: 10 })

      Row() {
        Button('重新开始', { type: ButtonType.Normal })
          .borderRadius(5)
          .margin({ top: 10 })
          .width(200)
          .onClick(() => {
            this.startGame()
            this.controller.close()
          })
      }.justifyContent(FlexAlign.SpaceAround)
      .margin({ top: 10, bottom: 10 })
    }
    .backgroundColor('#f0f0f0')
    .borderRadius(25)
  }
}