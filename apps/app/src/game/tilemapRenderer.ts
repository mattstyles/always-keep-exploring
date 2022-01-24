import type {Tilemap, Tile} from '@nse/tilemap'
import type {Camera} from 'pixi-holga'
import type {Point} from 'mathutil'

import {Sprite, Container} from 'pixi.js'
import {SpritePool} from 'pixi-spritepool'
import {getTexture} from '@nse/textures'

/**
 * Handles the spritepool for the tilemap rendering
 */
export class TilemapRenderer {
  pool: SpritePool
  camera: Camera

  constructor({camera, container}: {camera: Camera; container: Container}) {
    this.camera = camera
    const region = camera.getViewBounds().round()

    this.pool = SpritePool.of({
      length: region.width * region.height,
      onCreateItem: () => {
        const sprite = new Sprite()
        sprite.visible = true
        return sprite
      },
      container: container,
    })
  }

  render(tilemap: Tilemap) {
    const region = this.camera.getViewBounds().round()

    // Check we have enough capacity in the pool
    const capacity = region.area - this.pool.length
    if (capacity > 0) {
      this.pool.malloc(capacity)
    }
    if (capacity < 0) {
      this.pool.free(0 - capacity)
    }

    // When we only have partial map in view we will end up rendering less
    // than the entire pool, so we need to reset the sprite visibility.
    // We could do this only with the remaining sprites but it won't
    // increase performance vs 2 entire loops.
    this.resetVisibility()

    // Render the map
    let count = 0
    let sprite = null
    tilemap.iterate((position: Point, tile: Tile) => {
      const projection = this.camera.applyProjection(position)
      sprite = this.pool.get(count)
      sprite.position.set(projection.x, projection.y)
      sprite.scale.set(this.camera.scale.x, this.camera.scale.y)
      sprite.texture = getTexture(tile)
      sprite.visible = true

      count = count + 1
    }, region)
  }

  resetVisibility() {
    this.pool.each((sprite) => {
      sprite.visible = false
    })
  }
}
