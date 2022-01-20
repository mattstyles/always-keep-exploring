import {BaseTexture, Texture, Rectangle, SCALE_MODES} from 'pixi.js'
import {Point} from 'mathutil'

import img from '../assets/test.png'

const base = new BaseTexture(img)
base.scaleMode = SCALE_MODES.NEAREST

export const textures = setTextures(base, Point.of(10, 10), Point.of(5, 5))

export function get(id: number): Texture {
  const texture = textures.get(id)

  if (texture == null) {
    throw new Error('Unfound texture id')
  }

  return texture
}

function getTextureTile(
  x: number,
  y: number,
  base: BaseTexture,
  size: Point
): Texture {
  return new Texture(
    base,
    new Rectangle(x * size.x, y * size.y, size.x, size.y)
  )
}

function setTextures(
  base: BaseTexture,
  tileSize: Point,
  textureSize: Point
): Map<number, Texture> {
  const textures = new Map<number, Texture>()

  let count = 0
  for (let y = 0; y < textureSize.y; y++) {
    for (let x = 0; x < textureSize.x; x++) {
      textures.set(count, getTextureTile(x, y, base, tileSize))
      count = count + 1
    }
  }

  return textures
}
