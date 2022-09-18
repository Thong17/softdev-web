import useTheme from 'hooks/useTheme'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { currencyFormat } from 'utils/index'

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props
  const { theme } = useTheme()

  return (
    <g transform={`translate(${cx},${cy})`}>
      <foreignObject x={-75} y={5} textAnchor="middle" width="150" height="20">
        <div style={{ display: 'grid', placeItems: 'center', color: theme.text.quaternary }}>
          {currencyFormat(payload.value, 'USD')}
        </div>
      </foreignObject>
    </g>
  )
}

export const CustomAreaChart = ({ width = '100%', height = 300, labels, data }) => {
  const { theme } = useTheme()
  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart
        data={data}
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
        <XAxis dataKey='name' />
        <YAxis />
        {labels?.map((item, key) => {
          return (
            <Area key={key} type='monotone' dataKey={item.name} dot={<CustomizedDot data={item} />} stroke={theme.text.tertiary} fill='url(#colorUv)' />
          )
        })}
        
      </AreaChart>
    </ResponsiveContainer>
  )
}
