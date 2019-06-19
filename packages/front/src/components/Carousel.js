import React, { useState } from 'react'
import { Button, Transition } from 'semantic-ui-react';
import './carousel.less'

const Carousel = ({ elements, render }) => {
  const animLeft = 'slide left'
  const animRight = 'slide right'
  const fadeOutTime = 250
  const fadeInTime = 250

  const [visibleIndex, setVisibleIndex] = useState({ current: 0, new: 0 })
  const [animation, setAnimation] = useState({ animation: null, state: 'finished' })

  const switchLeft = (iCurrent, iNew) => () => {
    setVisibleIndex({ current: iCurrent, new: iNew })
    setAnimation({ animation: animLeft, state: 'out' })
  }

  const switchRight = (iCurrent, iNew) => () => {
    setVisibleIndex({ current: iCurrent, new: iNew })
    setAnimation({ animation: animRight, state: 'out' })
  }

  const switchTo = (iCurrent, iNew) => iNew < iCurrent
    ? switchLeft(iCurrent, iNew)
    : iNew > iCurrent
      ? switchRight(iCurrent, iNew)
      : () => { }

  const onTransitionComplete = (visIndex, anim) => () => {
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
        {elements.map((e, index) =>
          <Transition
            animation={animation.animation}
            duration={fadingIn ? fadeInTime : fadeOutTime}
            key={e.id}
            visible={index === visibleIndex.current && index === visibleIndex.new}
            unmountOnHide={true}
            onComplete={onTransitionComplete(visibleIndex, animation)}
          >
            {render(e)}
          </Transition>
        )}
      </Transition.Group>
      <div className='indicators'>
        <Button.Group>
          {elements.map((e, index) =>
            <Button
              compact
              size='small'
              color='olive'
              key={e.id}
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