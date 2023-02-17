import React from 'react'
import { Layout } from 'antd'
import PeraSwarm from '../../images/PeraSwarm.png'
import UopLogo from '../../images/uop.png'

function FooterComponent() {

  const { Footer } = Layout

  return (
    <Footer className='text-center'>
      <span>Department of Comuputer Engineering - University of Peradeniya</span>
      <div className='mt-2'>
        <img src={PeraSwarm} alt="pera-swarm-logo" style={{width: '30px', marginRight: '5px'}} />
        <img src={UopLogo} alt="uop-logo" style={{width: '30px', marginLeft: '5px'}} />
      </div>
    </Footer>
  )
}

export default FooterComponent