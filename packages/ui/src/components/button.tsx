import {styled, theme} from '@nse/theme'

export const Button = styled('button', {
  backgroundColor: 'hotpink',
  color: theme.colors.black,
  borderRadius: '9999px',
  border: 'none',
  fontSize: '13px',
  padding: '10px 15px',
  fontFamily: theme.fonts.mono,
  '&:hover': {
    backgroundColor: 'lightgray',
  },
})
