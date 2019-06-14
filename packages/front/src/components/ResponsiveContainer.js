import React, { useState } from 'react'
import { Responsive, Visibility, Sidebar } from 'semantic-ui-react'

import { DesktopNavbar, MobileNavbar } from './Navbar'

const getWidth = () => {
  const isSSR = typeof window === undefined
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const DesktopContainer = ({ children, ...otherProps }) => {
  const [menuVisible, setMenuVisible] = useState(true)

  const hideMenu = () => setMenuVisible(false)
  const showMenu = () => setMenuVisible(true)

  return (
    <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility
        once={false}
        onBottomPassed={showMenu}
        onBottomPassedReverse={hideMenu}
        style={{ marginBottom: '1em' }}
      >
        <DesktopNavbar menuVisible={menuVisible} {...otherProps} />
      </Visibility>
      {children}

    </Responsive>
  )
}

const MobileContainer = ({ children, ...otherProps }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false)

  return (
    <Responsive
      as={Sidebar.Pushable}
      getWidth={getWidth}
      maxWidth={Responsive.onlyMobile.maxWidth}
    >
      <MobileNavbar
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
        children={children}
        {...otherProps}
      />
    </Responsive>
  )
}

const ResponsiveContainer = ({ children, ...otherProps }) => (
  <>
    <DesktopContainer {...otherProps}>{children}</DesktopContainer>
    <MobileContainer {...otherProps}>{children}</MobileContainer>
  </>
)

export default ResponsiveContainer