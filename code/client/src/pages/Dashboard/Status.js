import React from 'react';

import { useMqttState } from 'mqtt-react-hooks';

export default function Status() {
  /*
   * Status list
   * - Offline
   * - Connected
   * - Reconnecting
   * - Closed
   * - Error: printed in console too
   */
  const { connectionStatus } = useMqttState();

  return <h6 className='text-muted'>{`MQTT Connection Status: ${connectionStatus}`}</h6>;
}