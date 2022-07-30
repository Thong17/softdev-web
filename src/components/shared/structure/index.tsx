import { statusReservation } from 'utils'

export const StructureStatus = ({ styled, status }) => {
  return (
    <div
      style={{
        backgroundColor: styled.color[statusReservation(status)],
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 20,
        right: 0,
      }}
    >
        <span style={{ backgroundColor: styled.background.primary, width: 3, position: 'absolute', top: -1, bottom: -1, left: -1 }}></span>
    </div>
  )
}

export { FloorStructure } from './FloorStructure'
export { RoomStructure } from './RoomStructure'
export { TableStructure } from './TableStructure'
