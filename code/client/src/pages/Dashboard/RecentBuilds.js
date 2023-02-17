import { Tag } from 'antd'
import React from 'react'
import { TagsOutlined } from '@ant-design/icons'

function RecentBuilds() {

    const recentBuilds = [
        {
            id: 1,
            name: 'ESP-Firmware-01'
        },
        {
            id: 2,
            name: 'ESP-Firmware-02'
        }
    ]

    return (
        <div>
            <h6 className='text-center'>Recent Builds</h6>
            <hr />

            {
                recentBuilds.map(build => (
                    <Tag className='pointer' color='cyan' key={build.id}>
                        <div className='d-flex'>
                            <div style={{marginTop: '-2px', marginRight: '3px'}}>
                                <TagsOutlined />
                            </div>

                            <div>
                                {build.name}
                            </div>
                        </div>
                    </Tag>
                ))
            }
        </div>
    )
}

export default RecentBuilds