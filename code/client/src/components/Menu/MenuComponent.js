import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Select, Menu } from 'antd';
import { change } from '../../Redux/FirmwareFile';
import {
  AppstoreFilled,
  BuildOutlined,
  CloudUploadOutlined
} from '@ant-design/icons'
import { useLocation } from 'react-router-dom';
import './MenuComponent.css'

// menu item icons
import PeraSwarm from '../../images/PeraSwarm.png'

function MenuComponent() {

  const location = useLocation()
  const navigate = useNavigate()

  // menu item structure
  const getItem = (label, key, icon, children, theme) => {
    return {
      key,
      icon,
      children,
      label,
      theme,
    };
  }

  const items = [
    getItem('Home', '/', <AppstoreFilled />),
    // getItem('Playground', '/playground', <BuildOutlined />),
    getItem('MQTT', '/mqtt', <CloudUploadOutlined />),
  ]

  const onClick = (e) => {
    navigate(e.key);
  }

  return (
    <>
      {/* main logo section */}
      <div className='d-flex' style={{marginTop: '30px', marginLeft: '10px', marginBottom: '10px'}} >
        <div>
          <img alt='pera-swarm-main-logo' src={PeraSwarm} style={{ width: '40px', marginLeft: '20px' }} />
        </div>

        <div className='my-auto' style={{marginLeft: '10px'}}>
          <h2 className='text-light'>Pera Swarm</h2>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={location.pathname}
        theme="dark"
        onClick={onClick}
        style={{ padding: '1px' }}
        items={items}
        className="menu-background"
      />
      
    </>
  )
}

export default MenuComponent
