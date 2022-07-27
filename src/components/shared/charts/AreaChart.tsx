import { FC } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { generateColor } from 'utils'

const CustomizedDot: FC<any> = (props: any) => {
  const { cx, cy, icon } = props

  return (
    <image x={cx + 5} y={cy - 15} width={30} height={30} xlinkHref={`${process.env.REACT_APP_API_UPLOADS}${icon}`} style={{ borderRadius: 50 }} />
  )
}

export const CustomAreaChart = ({ width = '100%', height = 300, labels, data }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart
        data={labels}
        margin={{
          top: 25,
          right: 40,
          left: 0,
          bottom: 10,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#111111" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        {data?.map((item, key) => {
          return (
            <Area key={key} type='monotone' dataKey={item.name} stroke={generateColor()} dot={<CustomizedDot icon={item.profile} />} fill='url(#colorUv)' />
          )
        })}
        
      </AreaChart>
    </ResponsiveContainer>
  )
}
