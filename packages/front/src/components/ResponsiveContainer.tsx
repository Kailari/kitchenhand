import React, { useState, FunctionComponent } from 'react'
import { Responsive, Visibility, Sidebar } from 'semantic-ui-react'

import { DesktopNavbar, MobileNavbar } from './Navbar'
import { User } from './MainApp'

interface ResponsiveContainerProps {
  logout: () => void,
  currentUser: User,
}

const getWidth = (): number => {
  const isSSR = typeof window === undefined
  const width = isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
  return width as number
}

const DesktopContainer: FunctionComponent<ResponsiveContainerProps> = ({ children, ...otherProps }) => {
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
        <DesktopNavbar /*menuVisible={menuVisible}*/ {...otherProps} />
      </Visibility>
      {children}

    </Responsive>
  )
}

const MobileContainer: FunctionComponent<ResponsiveContainerProps> = ({ children, ...otherProps }) => {
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
        {...otherProps}>
        {children}
      </MobileNavbar>
    </Responsive>
  )
}

const ResponsiveContainer: FunctionComponent<ResponsiveContainerProps> = ({ children, ...otherProps }) => (
  <>
    <DesktopContainer {...otherProps}>{children}</DesktopContainer>
    <MobileContainer {...otherProps}>{children}</MobileContainer>
  </>
)

export default ResponsiveContainer
