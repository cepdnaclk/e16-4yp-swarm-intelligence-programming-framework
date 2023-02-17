import React from 'react'
import { Layout } from 'antd';
import MenuComponent from '../Menu/MenuComponent';
import { useSelector, useDispatch } from "react-redux";
import { change } from '../../Redux/SidemenuMargin';

function SiderComponent() {
    const { Sider } = Layout;
    const { margin } = useSelector((state) => state.margin);
    const dispatch = useDispatch();

    return (
        // side menu including menu
        <Sider 
            // collapsible
            collapsed={margin}
            onCollapse={() => dispatch(change())}
            width={280}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0
            }}
        >
            <MenuComponent />
        </Sider>
    )
}

export default SiderComponent