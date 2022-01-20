import {Canvas} from '@nse/ui'
import {Game} from '../game/application'

export function Main() {
  return <Canvas onReady={onReady} />
}

function onReady({canvas}: {canvas: HTMLCanvasElement}) {
  const game = new Game({canvas})

  return () => {
    game.release()
  }
}
