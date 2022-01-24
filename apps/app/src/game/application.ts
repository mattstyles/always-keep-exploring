import type {Tile, TilemapData} from '@nse/tilemap'

import {Application, Container, Sprite} from 'pixi.js'
import {Camera} from 'pixi-holga'
import {Point, Rect} from 'mathutil'
import random from 'just-random-integer'

import {getTexture} from '@nse/textures'
import {Tilemap} from '@nse/tilemap'

import {TilemapRenderer} from './tilemapRenderer'

export class Game {
  app: Application
  tiles: Tilemap
  camera: Camera
  tileRenderer: TilemapRenderer

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
      position: Point.of(20, 20),
      fov: Point.of(20, 20),
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

    this.tileRenderer = new TilemapRenderer({
      camera: this.camera,
      container: container,
    })

    window.camera = this.camera
    window.tiles = this.tiles
    window.application = this.app
    window.render = this.render

    window.addEventListener('keydown', this.onKeydown)

    // Set the size and camera up
    this.onResize()
  }

  render = () => {
    this.tileRenderer.render(this.tiles)
  }

  onResize = () => {
    const {width, height} = this.app.screen
    const zoom = this.camera.zoom
    const tileSize = 10 * zoom

    const x = Math.ceil((width / tileSize) * 0.5)
    const y = Math.ceil((height / tileSize) * 0.5)

    this.camera.fov = Point.of(x * zoom, y * zoom)

    // this.tiles.removeVisibility()
    this.render()
  }

  // Placeholder for testing camera
  onKeydown = (event) => {
    switch (event.key) {
      case 'a':
        // decrease x fov
        this.camera.fov = Point.of(this.camera.fov.x - 1, this.camera.fov.y)
        break
      case 'd':
        // increase x fov
        this.camera.fov = Point.of(this.camera.fov.x + 1, this.camera.fov.y)
        break
      case 's':
        // descrease y fov
        this.camera.fov = Point.of(this.camera.fov.x, this.camera.fov.y - 1)
        break
      case 'w':
        // increase y fov
        this.camera.fov = Point.of(this.camera.fov.x, this.camera.fov.y + 1)
        break
      case 'q':
        // zoom out
        this.camera.setZoom(this.camera.zoom - 1)
        break
      case 'e':
        // zoom in
        this.camera.setZoom(this.camera.zoom + 1)
        break
      case 'ArrowUp':
        // decrease y pos
        this.camera.y = this.camera.y - 1
        break
      case 'ArrowDown':
        // increase y pos
        this.camera.y = this.camera.y + 1
        break
      case 'ArrowLeft':
        // decrease x pos
        this.camera.x = this.camera.x - 1
        break
      case 'ArrowRight':
        // increase x pos
        this.camera.x = this.camera.x + 1
        break
    }

    console.log(
      [this.camera.x, this.camera.y],
      this.camera.zoom,
      this.camera.fov.pos,
      this.camera.getViewBounds().pos
    )

    this.render()
  }

  release() {
    this.app.destroy(true, {
      children: true,
    })
    window.removeEventListener('resize', this.onResize)
  }
}
