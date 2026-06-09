import useTheme from 'hooks/useTheme'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { currencyFormat } from 'utils/index'

const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme()
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{ background: `${theme.text.primary}22`, color: theme.text.primary, backdropFilter: 'blur(4px)', borderRadius: theme.radius.ternary, padding: '8px 10px', fontSize: 13 }}>
      <div style={{ opacity: 0.8, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <>
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div>{currencyFormat(p.value, 'USD')}</div>
          </div>
          <div style={{ fontSize: 11, color: theme.text.quaternary }}>{p.payload?.createdAt}</div>
        </>
      ))}
    </div>
  )
}

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props
  const { theme } = useTheme()

  return (
    <g transform={`translate(${cx},${cy})`}>
      <foreignObject x={-75} y={5} textAnchor="middle" width="150" height="20">
        <div style={{ display: 'grid', placeItems: 'center', color: theme.text.quaternary }}>
          <span style={{ background: `${theme.text.primary}22`, padding: '0 4px', borderRadius: theme.radius.ternary, backdropFilter: 'blur(4px)' }}>
            {currencyFormat(payload.value, 'USD', 0)}
            </span>
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
        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} />
        {labels?.map((item, key) => {
          return (
            <Area key={key} type='monotone' dataKey={item.name} dot={<CustomizedDot />} stroke={theme.text.tertiary} fill='url(#colorUv)' />
          )
        })}
        
      </AreaChart>
    </ResponsiveContainer>
  )
}
