import type * as Stitches from '@stitches/react'
import {createStitches} from '@stitches/react'

export const {styled, css, theme, config} = createStitches({
  theme: {
    colors: {
      black: 'hsl(0, 0%, 0%)',
      white: 'hsl(0, 0%, 100%)',
    },
    fonts: {
      mono: 'Source Code Pro, Consolas, monospace',
    },
    space: {
      0: 0,
      '0.5': '1px',
      1: '2px',
      2: '4px',
      3: '8px',
      4: '12px',
      5: '16px',
      6: '24px',
      7: '32px',
      8: '48px',
      9: '72px',
    },
    radii: {
      0: 0,
      1: '3px',
      2: '5px',
      round: '9999px',
    },
    fontSizes: {
      1: '11px',
      2: '12px',
      3: '14px',
      4: '16px',
      5: '19px',
      6: '21px',
      7: '26px',
      8: '32px',
      xs: '$1',
      s: '$2',
      m: '$3',
      l: '$4',
      xl: '$5',
    },
    lineHeights: {
      1: '16px',
      2: '16px',
      3: '20px',
      4: '24px',
      5: '32px',
      6: '32px',
      7: '36px',
      8: '48px',
      xs: '$1',
      s: '$2',
      m: '$3',
      l: '$4',
      xl: '$5',
    },
  },
})

export type CSS = Stitches.CSS<typeof config>
