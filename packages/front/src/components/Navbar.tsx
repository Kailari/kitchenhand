import React, { FunctionComponent } from 'react'
import { Menu, Container, Image, Icon, Dropdown, Button, Sidebar, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { User } from '../types'

interface NavbarProps {
  logout: () => void,
  currentUser: User,
}

export const DesktopNavbar: FunctionComponent<NavbarProps> = ({ logout, currentUser }) => {
  return (
    <Menu size='large'>
      <Container>
        <Menu.Item header>
          <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
          Kitchenhand
        </Menu.Item>

        <Menu.Item as={Link} to='/'>Dashboard</Menu.Item>
        <Dropdown item simple text='Recipes'>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to='/recipes'>Home</Dropdown.Item>
            <Dropdown.Item as={Link} to='/recipes/create'>Create</Dropdown.Item>
            <Dropdown.Item as={Link} to='/recipes/my'>Cookbook</Dropdown.Item>
            <Dropdown.Item as={Link} to='/recipes/discover'>Discover</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item as={Link} to='/storeroom'>Storeroom</Menu.Item>

        {currentUser && (
          <Menu.Item position='right'>
            {currentUser.name}
          </Menu.Item>
        )}
        <Menu.Item position='right'>
          <Button onClick={logout}>
            Log out
          </Button>
        </Menu.Item>
      </Container>
    </Menu>
  )
}

interface MobileNavbarProps extends NavbarProps {
  sidebarVisible: boolean,
  setSidebarVisible: (value: boolean) => void,
}

export const MobileNavbar: FunctionComponent<MobileNavbarProps> = ({ children, logout, /*currentUser,*/ sidebarVisible, setSidebarVisible }) => {
  const toggleSidebarVisible = (oldValue: boolean) => () => setSidebarVisible(!oldValue)

  return (
    <>
      <Sidebar
        as={Menu}
        animation='push'
        vertical
        visible={sidebarVisible}
      >
        <Menu.Item as={Link} to='/'>Dashboard</Menu.Item>
        <Menu.Item as={Link} to='/recipes'>Recipes</Menu.Item>
        <Menu.Item as={Link} to='/storeroom'>Storeroom</Menu.Item>
      </Sidebar>

      <Menu
        fixed='top'
        style={{ minHeight: 50 }}
      >
        <Menu.Item onClick={toggleSidebarVisible(sidebarVisible)}>
          <Icon name='sidebar' />
        </Menu.Item>
        <Menu.Item position='right'>
          <Button onClick={logout}>
            Log out
          </Button>
        </Menu.Item>
      </Menu>

      <Sidebar.Pusher dimmed={sidebarVisible}>
        <Segment style={{ minHeight: 50 }} />
        {children}
      </Sidebar.Pusher>
    </>
  )
}
