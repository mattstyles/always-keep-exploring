import {Rect, Point, clamp} from 'mathutil'
import {SpritePool} from 'pixi-spritepool'
import {Sprite} from 'pixi.js'

import {getTexture} from '@nse/textures'

export type Tile = number
export type TilemapData = Tile[]
export type CreateMapDataFn = () => TilemapData
export type IteratorFn = (position: Point, tile: Tile) => void
export type RenderFn = (position: Point, tile: Tile, sprite: Sprite) => void

export class Tilemap {
  size: Point
  data: TilemapData
  pool: SpritePool

  constructor({
    size,
    createMapData,
  }: {
    size: Point
    createMapData: CreateMapDataFn
  }) {
    this.size = size
    this.data = createMapData()

    this.pool = SpritePool.of({
      length: size.x * size.y,
      onCreateItem: () => {
        const sprite = new Sprite()
        sprite.visible = true
        return sprite
      },
    })
  }

  inBounds(position: Point): boolean {
    return !(
      position.x < 0 ||
      position.y < 0 ||
      position.x >= this.size.x ||
      position.y >= this.size.y
    )
  }

  get(position: Point): Tile {
    if (!this.inBounds(position)) {
      return null
    }

    return this.data[to2d(position.x, position.y, this.size.x)]
  }

  iterate(cb: IteratorFn, region?: Rect) {
    // If no region is supplied then iterate over the entire structure
    if (region == null) {
      region = Rect.of(0, 0, this.size.x, this.size.y)
    }

    const startX = clamp(0, this.size.x, region.pos[0])
    const endX = clamp(0, this.size.x, region.pos[2])
    const startY = clamp(0, this.size.y, region.pos[1])
    const endY = clamp(0, this.size.y, region.pos[3])

    let pos = null
    let tile = null
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        pos = Point.of(x, y)
        tile = this.get(pos)

        if (tile == null) {
          continue
        }

        cb(pos, tile)
      }
    }
  }

  render(cb: RenderFn, region?: Rect) {
    let count = 0
    function iterator(pos: Point, tile: Tile) {
      const sprite = this.pool.get(count)
      sprite.visible = true
      cb(pos, tile, sprite)
      count = count + 1
    }
    this.iterate(iterator.bind(this), region)
  }

  // This must iterate every possible sprite so we don't want to do it
  // unnecessarily. We could currently vastly over provision the sprite pool,
  // we should really assign the spritepool length based on how many we actually
  // want to draw, which is dependent on camera viewport.
  removeVisibility() {
    this.pool.each((sprite) => {
      sprite.visible = false
    })
  }
}

function to2d(x: number, y: number, width: number) {
  return y * width + x
}
