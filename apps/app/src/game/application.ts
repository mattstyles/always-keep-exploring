import type {Tile, TilemapData} from '@nse/tilemap'

import {Application, Container, Sprite} from 'pixi.js'
import {Camera} from 'pixi-holga'
import {Point, Rect} from 'mathutil'
import random from 'just-random-integer'

import {getTexture} from '@nse/textures'
import {Tilemap} from '@nse/tilemap'

export class Game {
  app: Application
  tiles: Tilemap
  camera: Camera

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

    // const sprite = new Sprite(getTexture(2))
    // sprite.x = 200
    // sprite.y = 200
    // this.app.stage.addChild(sprite)

    const container = new Container()
    this.app.stage.addChild(container)

    window.addEventListener('resize', this.onResize)

    this.camera = Camera.of({
      position: Point.of(0, 10),
      fov: Point.of(10, 10),
      zoom: 3,
      projection: Point.of(10, 10),
    })

    const tilemapSize = Point.of(40, 40)
    this.tiles = new Tilemap({
      size: tilemapSize,
      createMapData: () => {
        const tiles: TilemapData = []
        for (let y = 0; y < tilemapSize.y; y++) {
          for (let x = 0; x < tilemapSize.x; x++) {
            if (
              x === 0 ||
              y === 0 ||
              x === tilemapSize.x - 1 ||
              y === tilemapSize.y - 1
            ) {
              tiles.push(0)
              continue
            }

            tiles.push(random(1, 24))
          }
        }

        return tiles
      },
    })
    this.tiles.pool.attach(container)

    // For now, just render the tilemap once
    this.tiles.render((position: Point, tile: Tile, sprite: Sprite) => {
      const projection = this.camera.applyProjection(position)
      sprite.position.set(projection.x, projection.y)
      sprite.scale.set(this.camera.scale.x, this.camera.scale.y)
      sprite.texture = getTexture(tile)
    })
  }

  onResize = () => {
    const {width, height} = this.app.screen
    const zoom = this.camera.zoom
    const tileSize = 10 * zoom

    const x = Math.ceil(width / tileSize)
    const y = Math.ceil(height / tileSize)

    this.camera.fov = Point.of(x, y)

    console.log({
      width,
      height,
      zoom,
      tileSize,
      x,
      y,
      viewBounds: this.camera,
    })

    this.tiles.removeVisibility()
    let maxX = 0
    this.tiles.render((position: Point, tile: Tile, sprite: Sprite) => {
      maxX = position.x > maxX ? position.x : maxX
      const projection = this.camera.applyProjection(position)
      sprite.position.set(projection.x, projection.y)
      sprite.scale.set(this.camera.scale.x, this.camera.scale.y)
      sprite.texture = getTexture(tile)
    }, Rect.of(this.camera.getViewBounds()))
    console.log(maxX)
  }

  release() {
    this.app.destroy(true, {
      children: true,
    })
    window.removeEventListener('resize', this.onResize)
  }
}
