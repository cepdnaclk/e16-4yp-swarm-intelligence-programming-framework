import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import SiderComponent from './components/Sider/SiderComponent';
import FooterComponent from './components/Footer/FooterComponent';
import Pages from './pages/Pages';
import { useSelector } from "react-redux";


function Layoutview() {

  const { Content } = Layout;
  const { margin } = useSelector((state) => state.margin);
  const [marginVariable, setMarginVariable] = useState('side-menu-margin-extended')

  useEffect(() => {
    if (!margin) {
      setMarginVariable('side-menu-margin-extended')
    } else {
      setMarginVariable('side-menu-margin')
    }
  }, [margin])

  return (
    // main layout of the website
    <Layout className={marginVariable}>

      {/* side menu component */}
      <div className='side-menu'>
        <SiderComponent />
      </div>
      
      <Layout style={{minHeight: '100vh'}}>
        
            <Content>
              <div className='container-fluid mt-4'>
                <Pages />
              </div>
            </Content>

            <FooterComponent />
      </Layout>
    </Layout>
  )
}

export default Layoutview
