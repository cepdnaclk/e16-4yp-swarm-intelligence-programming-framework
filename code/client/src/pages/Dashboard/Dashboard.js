import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Button, Input, message, Steps } from 'antd' 
import io from 'socket.io-client';
import { decrease, increase } from '../../Redux/CodeGenSteps';
import {CodeOutlined} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux';
import DynamicCodeGenerationForm from './DynamicCodeGenerationForm';
import Mqtt from '../Mqtt/Mqtt';
import Playground from '../Playground/Playground';
import { CodeSandboxOutlined, FireOutlined, StepBackwardOutlined, CloudUploadOutlined, StepForwardOutlined, BuildOutlined } from '@ant-design/icons';

// socket.io connection socket
const socket = io("http://localhost:5001");

function Dashboard() {
  // antd steps
  const { Step } = Steps

  // socket related variables
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [msgs, setMsgs] = useState([])

  // redux related variables
  const dispatch = useDispatch()
  const { firmwareFile, dynamicCodeObject, algorithmName, generatedCppCode, generatedXmlCode } = useSelector((state) => state.firmware);
  const { step } = useSelector((state) => state.step);
  const [robotId, setRobotId] = useState(null)


  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('build', (data) => {
      setMsgs(msgs => [...msgs, data])
      var terminalDiv = document.getElementById("terminalDiv");
      terminalDiv.scrollTop = terminalDiv.scrollHeight;
    });

    // the listeners must be removed in the cleanup step, in order to prevent multiple event registrations
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('build');
    }
  }, []);

  useEffect(() => {
      console.log(`Socket connection established: ${isConnected}`)
  }, [isConnected])


  // send build request
  const handleBuild = async () => {
    setMsgs([])
    try {
      const response = await axios.post(`http://localhost:5001/build?dir=${firmwareFile}`, {features: dynamicCodeObject, algorithm_name: algorithmName, algorithm_body: generatedCppCode, robot_id: robotId});

      if (response?.data?.msg) {
        message.loading(response.data.msg)
      }
      

    } catch (error) {
      message.error(error.message)
    }
  }

  const handleRobotId = (value) => {
    if (value < 0 || value > 15) {
      message.error("Robot id should be between 1-15")
      setRobotId(null)
    } else {
      setRobotId(value)
    }
  }

  return (
    <div className='mt-5 mb-5'>

      {/* Antd steps component */}
      <div className='col-lg-10 mt-3 mb-5 mx-auto step-area'>
        <Steps current={step}>
          <Step title="Algorithm Generation" icon={<div style={{marginTop: '-5px'}}><BuildOutlined /></div>} />
          <Step title="Dynamic Code Generation" icon={<div style={{marginTop: '-5px'}}><CodeSandboxOutlined /></div>} />
          <Step title="Build" icon={<div style={{marginTop: '-5px'}}><FireOutlined /></div>} />
          <Step title="OTA Upload" icon={<div style={{marginTop: '-5px'}}><CloudUploadOutlined /></div>} />
        </Steps>
      </div>

      {/* Blockly Playground */}
      {
        step === 0 &&
        <Playground />
      }

      {/* Dynamic code generation step */}
      {
        step === 1 &&
        <DynamicCodeGenerationForm />
      }

      {/* Build area */}
      {
        step === 2 &&
        <>
          <div className='mt-4'>
            <div className='terminal p-4' id="terminalDiv">
              <span className='response-msg text-light'>
                {msgs}
              </span>
            </div>
          </div>

          <div className='mt-4 d-flex'>
            <Input 
              onChange={(e) => handleRobotId(e.target.value)}
              value={robotId}
              type="number"
              placeholder="Specify the robot ID"
            />

            <Button type="primary" onClick={() => handleBuild()} style={{marginLeft: '5px'}}>
              <div className='d-flex'>
                <div style={{marginTop: '-3px', marginRight: '3px'}}><CodeOutlined /></div>
                <div>Build</div>
              </div>
            </Button>
          </div>

          <div className='mt-4 d-flex justify-content-center'>
            {/* decrease the step to go back */}
            <Button style={{marginRight: '5px'}} onClick={() => dispatch(decrease())}>
              <div className='d-flex'>
                <div style={{marginTop: '-3px', marginRight: '3px'}}><StepBackwardOutlined /></div>
                <div>Back</div>
              </div>
            </Button>

            <Button onClick={() =>dispatch(increase())} style={{marginLeft: '5px'}}>
              <div className='d-flex'>
                <div style={{marginTop: '-3px', marginRight: '3px'}}><StepForwardOutlined /></div>
                <div>Next</div>
              </div>
            </Button>
          </div>
        </>
      }

      {/* to handle OTA upload */}
      {
        step === 3 &&
        <Mqtt />

                
      }
    </div>
  )
}

export default Dashboard