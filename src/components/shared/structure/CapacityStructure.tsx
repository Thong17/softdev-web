import React, { useEffect, useState } from 'react'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getStructureCapacity, selectStructureCapacity } from 'shared/redux'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'

export const CapacityStructure = () => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectStructureCapacity)
  const [average, setAverage] = useState(null)
  const [available, setAvailable] = useState(0)

  useEffect(() => {
    if (!data) return
    setAvailable(data.vacant)
    setAverage(data.avgWaiting)
  }, [data])

  useEffect(() => {
    dispatch(getStructureCapacity())
  }, [dispatch])

  return (
    <div
      style={{
        display: 'flex',
        borderRadius: theme.radius.secondary,
        alignItems: 'center',
        padding: '5px 8px',
        backgroundColor: average
          ? `${theme.color.error}22`
          : `${theme.color.success}22`,
        color: average ? theme.color.error : theme.color.success,
        fontSize: theme.responsive[device]?.text.tertiary,
        wordBreak: 'break-all',
        maxWidth: '25%'
      }}
    >
      {average ? `Avg. ${average}` : `${available} available`}
      <PieChartRoundedIcon style={{ fontSize: 19, marginLeft: 5 }} />
    </div>
  )
}
