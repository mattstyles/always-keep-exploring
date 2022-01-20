import {useRef, useEffect} from 'react'

interface CanvasProps {
  onReady: ({canvas}: {canvas: HTMLCanvasElement}) => () => void
}
export function Canvas({onReady}: CanvasProps) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref == null || ref.current == null) {
      return
    }
    return onReady({
      canvas: ref.current,
    })
  }, [ref])

  return <canvas ref={ref}></canvas>
}
