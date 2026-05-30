import { useAppDispatch, useAppSelector } from 'app/hooks'
import { CarouselContainer } from 'components/shared/container/CarouselContainer'
import { getListTransfer, selectListTransfer } from 'modules/organize/store/redux'
import React, { useEffect, useState } from 'react'
import './css/index.css'

const FrontScreen = () => {
    const { data: listTransfer } = useAppSelector(selectListTransfer)
    const dispatch = useAppDispatch()

    const [leftContainerPixel, setLeftContainerPixel] = useState(500);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const startX = e.clientX;
        const startWidth = leftContainerPixel;

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = startWidth + (e.clientX - startX);

            setLeftContainerPixel(
                Math.max(300, Math.min(1200, newWidth))
            );
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        dispatch(getListTransfer())
    }, [dispatch])

    return (
        <div style={{ display: 'flex' }}>
            <div 
                style={{
                    position: 'absolute',
                    boxSizing: 'border-box',
                    height: '100%',
                    width: leftContainerPixel + 'px',
                    backgroundColor: '#000',
                    resize: 'horizontal',
                    overflow: 'hidden',
                }}
            >
                <CarouselContainer
                    images={listTransfer?.map((item) => item.image) || []}
                />
                <div
                    className='resizer'
                    onMouseDown={handleMouseDown}
                >
                </div>
            </div>
            <div style={{ flex: 1 }}>
                Hello
            </div>
        </div>
    )
}

export default FrontScreen