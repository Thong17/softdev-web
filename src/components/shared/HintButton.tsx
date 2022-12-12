import React, { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import LightbulbCircleRoundedIcon from '@mui/icons-material/LightbulbCircleRounded'
import useWeb from 'hooks/useWeb'
import { getYoutubePlaylist } from 'api/youtube'
import { MenuDialog } from './MenuDialog'
import { FlexBetween } from './container/FlexBetween'
import { TextEllipsis } from './TextEllipsis'
import { dateFormat } from 'utils/index'
import { Box } from '@mui/material'

export const HintItem = ({ data }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <Box sx={{
      '&:hover': {
        backgroundColor: `${theme.background.primary}33`
      }
    }}>
      <a
        href={`${process.env.REACT_APP_YOUTUBE_BASE_URL}watch?v=${data.contentDetails?.videoId}`}
        target='_blank'
        rel='noreferrer'
        style={{
          textDecoration: 'none',
          padding: '5px 10px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'start',
          position: 'relative',
          height: 100,
          color: theme.text.secondary,
        }}
      >
        <div style={{ marginRight: 10 }}>
          <img
            src={data.snippet?.thumbnails?.default?.url}
            alt={data.snippet?.description}
            width={data.snippet?.thumbnails?.default?.width}
            height={data.snippet?.thumbnails?.default?.height}
            style={{ borderRadius: theme.radius.secondary, overflow: 'hidden' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '10px 0',
            boxSizing: 'border-box',
            height: '100%',
          }}
        >
          <FlexBetween>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TextEllipsis>{data.snippet?.title}</TextEllipsis>
              <p
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                {dateFormat(data.snippet?.publishedAt)}
              </p>
            </div>
          </FlexBetween>
          <span>By: {data.snippet?.channelTitle}</span>
        </div>
      </a>
    </Box>
  )
}

export const HintButton = ({ playlistId }) => {
  const { theme } = useTheme()
  const { width } = useWeb()
  const [list, setList] = useState<any>([])

  useEffect(() => {
    getYoutubePlaylist({
      apiKey: process.env.REACT_APP_YOUTUBE_API_KEY,
      playlistId,
    })
      .then((result) => setList(result))
      .catch((err) => console.log(err))
  }, [playlistId])

  return (
    <MenuDialog
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        backgroundColor: theme.background.secondary,
        position: 'fixed',
        padding: 0,
        right: 17,
        bottom: width < 1024 ? 77 : 17,
        borderRadius: theme.radius.circle,
        boxShadow: theme.shadow.secondary,
        zIndex: 1000,
        width: 54,
        height: 54,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        color: theme.text.secondary,
        '&:hover': {
          color: theme.text.primary,
        },
        '&:hover svg': {
          fontSize: '54px !important',
        },
      }}
      label={
        <LightbulbCircleRoundedIcon
          style={{ fontSize: 44, transition: '0.3s ease' }}
        />
      }
    >
      <div style={{ maxHeight: 400, minWidth: 400, overflowY: 'auto' }}>
        {list?.map((item, key) => {
          return <HintItem key={key} data={item} />
        })}
      </div>
    </MenuDialog>
  )
}
