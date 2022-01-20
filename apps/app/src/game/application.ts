import {Application, Container, Sprite} from 'pixi.js'
import {Camera} from 'pixi-holga'

import {getTexture} from '@nse/textures'

export class Game {
  app: Application

  constructor({canvas}: {canvas: HTMLCanvasElement}) {
    /**
     * Screen
     */
    this.app = new Application({
      resolution: window.devicePixelRatio,
      backgroundColor: 0xff00ae,
      antialias: true,
      autoDensity: true,
      resizeTo: window,
      view: canvas,
    })

    const sprite = new Sprite(getTexture(0))
    sprite.x = 200
    sprite.y = 200
    this.app.stage.addChild(sprite)

    window.addEventListener('resize', this.onResize)
  }

  onResize = () => {
    console.log({
      aw: this.app.screen.width,
      ah: this.app.screen.height,
    })
  }

  release() {
    this.app.destroy(true, {
      children: true,
    })
    window.removeEventListener('resize', this.onResize)
  }
}
