import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props

  return (
    <g transform={`translate(${cx},${cy})`}>
      <text x={30} y={5} dy={16} textAnchor="end" fill="#666">
        {payload.value}$
      </text>
    </g>
  )
}

export const CustomAreaChart = ({ width = '100%', height = 300, labels, data }) => {
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
        <Tooltip />
        {labels?.map((item, key) => {
          return (
            <Area key={key} type='monotone' dataKey={item.name} dot={<CustomizedDot data={item} />} stroke='#fff' fill='url(#colorUv)' />
          )
        })}
        
      </AreaChart>
    </ResponsiveContainer>
  )
}
