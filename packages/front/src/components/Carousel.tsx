import React, { useState, FunctionComponent } from 'react'
import { Button, Transition } from 'semantic-ui-react';
import './carousel.less'

interface CarouselProps<TElement> {
  elements: TElement[],
  elementKeyMapper: (element: TElement) => any
  render: (element: TElement) => JSX.Element,
}

interface AnimationState {
  animation: string | null,
  state: 'out' | 'in' | 'finished',
}

interface VisibleIndex {
  current: number,
  new: number
}

const Carousel = <TElement extends {}>({ elements, elementKeyMapper, render }: CarouselProps<TElement>) => {
  const animLeft = 'slide left'
  const animRight = 'slide right'
  const fadeOutTime = 250
  const fadeInTime = 250

  const [visibleIndex, setVisibleIndex] = useState<VisibleIndex>({ current: 0, new: 0 })
  const [animation, setAnimation] = useState<AnimationState>({ animation: null, state: 'finished' })

  const switchLeft = (iCurrent: number, iNew: number) => () => {
    setVisibleIndex({ current: iCurrent, new: iNew })
    setAnimation({ animation: animLeft, state: 'out' })
  }

  const switchRight = (iCurrent: number, iNew: number) => () => {
    setVisibleIndex({ current: iCurrent, new: iNew })
    setAnimation({ animation: animRight, state: 'out' })
  }

  const switchTo = (iCurrent: number, iNew: number) => iNew < iCurrent
    ? switchLeft(iCurrent, iNew)
    : iNew > iCurrent
      ? switchRight(iCurrent, iNew)
      : () => { }

  const onTransitionComplete = (visIndex: VisibleIndex, anim: AnimationState) => () => {
    setVisibleIndex({ current: visIndex.new, new: visIndex.new })
    if (anim.state === 'out') {
      const nextAnimation = anim.animation === animLeft ? animRight : animLeft
      setAnimation({ animation: nextAnimation, state: 'in' })
    } else if (anim.state === 'in') {
      setAnimation({ animation: null, state: 'finished' })
    }
  }

  const animationInProgress = animation.state !== 'finished'
  const fadingIn = animation.state === 'in'
  const canMoveToPrevious = !animationInProgress && visibleIndex.current !== 0
  const canMoveToNext = !animationInProgress && visibleIndex.current < elements.length - 1

  return (
    <div className='carousel'>
      <Transition.Group>
        {elements.map((element, index) =>
          <Transition
            animation={animation.animation as string}
            duration={fadingIn ? fadeInTime : fadeOutTime}
            key={elementKeyMapper(element)}
            visible={index === visibleIndex.current && index === visibleIndex.new}
            unmountOnHide={true}
            onComplete={onTransitionComplete(visibleIndex, animation)}
          >
            {render(element)}
          </Transition>
        )}
      </Transition.Group>
      <div className='indicators'>
        <Button.Group>
          {elements.map((element, index) =>
            <Button
              compact
              size='small'
              color='olive'
              key={elementKeyMapper(element)}
              active={index === visibleIndex.new}
              disabled={animationInProgress}
              icon={index === visibleIndex.new ? 'circle' : 'circle outline'}
              onClick={switchTo(visibleIndex.current, index)}
            />
          )}
        </Button.Group>
      </div>
      <Button
        disabled={!canMoveToPrevious}
        icon='caret left'
        className='prev'
        onClick={switchTo(visibleIndex.current, visibleIndex.current - 1)} />
      <Button
        disabled={!canMoveToNext}
        icon='caret right'
        className='next'
        onClick={switchTo(visibleIndex.current, visibleIndex.current + 1)} />
    </div>
  )
}

export default Carousel