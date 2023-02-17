import React from 'react'
import { Alert } from 'antd';

// this component is used to display a information massage
// four states: 'success'/'error'/'info'/'warning'
// state, note to be shown and closable=true/false can be passed as a prop
function InfoNote(props) {

    const {state, message, closable} = props

    return (
        <Alert
        type={state}
        message={message}
        banner
        closable={closable}
        />
    )
}

export default InfoNote