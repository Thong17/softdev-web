import useTheme from 'hooks/useTheme'
import { Breadcrumbs } from 'styles'
import { Link } from 'react-router-dom'
import { FC } from 'react'

export interface Stage {
  title?: string
  icon?: Element
  path?: string
}

interface IBreadcrumb {
  stages: Array<Stage>
  title?: string
}

const Breadcrumb: FC<IBreadcrumb> = ({ stages, title }) => {
  const { theme } = useTheme()

  return (
    <Breadcrumbs styled={theme}>
      {title && <span>{title}</span>}
      <div>
        {stages &&
          stages.map((stage, index) =>
            stage.path ? (
              <Link key={index} to={stage.path}>
                {stage.title}
                {stage.icon}
              </Link>
            ) : (
              <Link
                key={index}
                to={''}
                style={{
                  userSelect: 'none',
                  cursor: 'default',
                  color: theme.active.secondary,
                }}
              >
                {stage.title}
              </Link>
            )
          )}
      </div>
    </Breadcrumbs>
  )
}

export default Breadcrumb
