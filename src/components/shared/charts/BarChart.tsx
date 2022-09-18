import useTheme from 'hooks/useTheme'
import { BarChart, XAxis, YAxis, ResponsiveContainer, Bar } from 'recharts'
import { currencyFormat } from 'utils/index'
import React from 'react';

const CustomizedLabel = (props) => {
  const {x, y, width, value} = props
  const { theme } = useTheme()

  return <g transform={`translate(${0},${y})`}>
    <foreignObject x={x} y={-20} textAnchor="middle" width={width} height="20">
      <div style={{ display: 'grid', placeItems: 'center', color: theme.text.quaternary }}>
        {currencyFormat(value, 'USD')}
      </div>
    </foreignObject>
  </g>
}
 
export const CustomBarChart = ({ width = '100%', height = 300, labels, data }) => {
  const { theme } = useTheme()
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        data={data}
        margin={{
          top: 25,
          right: 40,
          left: 0,
          bottom: 10,
        }}
      >
        <XAxis dataKey='name' />
        <YAxis />
        {labels?.map((item, key) => {
          return (
            <Bar key={key} type='monotone' dataKey={item.name} stroke={theme.text.tertiary} strokeWidth={0} radius={[7, 7, 0, 0]} label={<CustomizedLabel />} />
          )
        })}
        
      </BarChart>
    </ResponsiveContainer>
  )
}
