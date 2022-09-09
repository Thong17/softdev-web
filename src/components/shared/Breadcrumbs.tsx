import useTheme from 'hooks/useTheme'
import { Breadcrumbs } from 'styles'
import { Link } from 'react-router-dom'
import { FC, ReactElement } from 'react'

export interface Stage {
  title?: string
  icon?: Element
  path?: string
  id?: string
}

interface IBreadcrumb {
  stages: Array<Stage>
  title?: string | ReactElement
}

const Breadcrumb: FC<IBreadcrumb> = ({ stages, title }) => {
  const { theme } = useTheme()

  return (
    <Breadcrumbs styled={theme}>
      {title && <span>{title}</span>}
      <div>
        {stages &&
          stages.map((stage, index) => {
            const path = stage.id ? `${stage.path}/${stage.id}` : stage.path as string
            return stage.path ? (
              <Link key={index} to={path}>
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
                  color: theme.text.quaternary,
                }}
              >
                {stage.title}
              </Link>
            )
          })}
      </div>
    </Breadcrumbs>
  )
}

export default Breadcrumb
