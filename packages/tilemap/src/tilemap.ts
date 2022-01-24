import {Rect, Point, clamp} from 'mathutil'

export type Tile = number
export type TilemapData = Tile[]
export type CreateMapDataFn = () => TilemapData
export type IteratorFn = (position: Point, tile: Tile) => void

export class Tilemap {
  size: Point
  data: TilemapData

  constructor({
    size,
    createMapData,
  }: {
    size: Point
    createMapData: CreateMapDataFn
  }) {
    this.size = size
    this.data = createMapData()
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
}

function to2d(x: number, y: number, width: number) {
  return y * width + x
}
