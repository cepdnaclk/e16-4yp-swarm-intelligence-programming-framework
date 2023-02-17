import React from 'react'
import './Badge.css'

function Badge(props) {

    const {value} = props

    const getBadge = (value) => {
        if (value === 'BSC') {
            return('bg-green-badge')
        } else if (value === 'buy') {
            return('bg-green-badge')
        } else if (value === 'sell') {
            return('bg-red-badge')
        } else {
            return('bg-blue-badge')
        }
    }

    return (
        <span className={`badge ${getBadge(value)}`}>{value}</span>
    )
}

export default Badge