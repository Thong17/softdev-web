import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomCustomerContainer } from 'styles'
import { RankStatus } from '../RankStatus'

export const CustomerContainer = ({ ...props }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <CustomCustomerContainer device={device} styled={theme} {...props}>
      <LocalPhoneRoundedIcon style={{ marginRight: 5, fontSize: 15 }} />
      <div style={{ display: 'flex', alignItems: 'start', marginRight: 7 }}>
        <p style={{ fontSize: 15 }}>+855 12 345 678</p>
      </div>
      <RankStatus text='250' color={theme.color.info} />
    </CustomCustomerContainer>
  )
}
