import { SymbolGlyphModifier } from '@kit.ArkUI'

@Entry
@ComponentV2
struct Index {
  private pathStack = new NavPathStack()

  build() {
    Navigation(this.pathStack) {
      Scroll() {
        Column({ space: 12 }) {
          List({ space: 12 }) {
            ListItem() {
              Button('加载本地资源Web')
                .onClick(() => {
                  this.pathStack.pushPathByName('resourceWeb', undefined)
                })
            }

            ListItem() {
              Button('加载在线Web')
                .onClick(() => {
                  this.pathStack.pushPathByName('httpWeb', undefined)
                })
            }
          }
          .width('auto')
          .height('auto')

          ForEach(Array.from({ length: 30 }), () => {
            Row() {
              Text('填充内容')
            }
          })
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)

        // .backgroundColor($r('sys.color.white'))
      }
      .layoutWeight(1)
      .padding({ left: 16, right: 16 })
      .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM])
      .scrollBar(BarState.Off)
      .edgeEffect(EdgeEffect.Fade)
    }
    .title('web测试联调')
    .titleMode(NavigationTitleMode.Mini)
    .hideBackButton(true)
    .backgroundColor($r('sys.color.comp_background_gray'))
    .menus([
      {
        value: '扫码',
        symbolIcon: new SymbolGlyphModifier($r('sys.symbol.line_viewfinder')),
        action: () => {
        }
      },
      {
        value: '设置',
        symbolIcon: new SymbolGlyphModifier($r('sys.symbol.gearshape')),
        action: () => {
        }
      }
    ])
  }
}