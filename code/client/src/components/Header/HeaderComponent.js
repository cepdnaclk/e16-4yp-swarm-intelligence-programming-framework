import React, { useState } from 'react'
import './HeaderComponent.css'
import { Menu } from 'react-feather'
import { Row, Col } from 'reactstrap'
import { Drawer } from 'antd'
import MenuComponent from '../Menu/MenuComponent'

function Header() {

  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const showDrawer = () => {
    setShowMobileMenu(true);
  };

  const closeDrawer = () => {
    setShowMobileMenu(false);
  };

  return (
    <div className="sticky-top bg-blue p-3">
      <Row>
        <Col lg="12" md="12" sm="12" className='text-end'>
          <Menu className='mobile-menu' onClick={showDrawer} />
        </Col>
      </Row>

      <Drawer placement="left" onClose={closeDrawer} visible={showMobileMenu} closable={false} width="280px">
          <div>
            <MenuComponent />
          </div>
      </Drawer>
    </div>
  )
}

export default Header