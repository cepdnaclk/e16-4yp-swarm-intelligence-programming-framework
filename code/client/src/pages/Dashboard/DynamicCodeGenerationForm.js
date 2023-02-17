import React, { useState, useEffect } from 'react'
import {
    Button,
    Checkbox,
    Form,
    Select,
    message,
    Tooltip
  } from 'antd';
import { Row, Col } from 'reactstrap';
import { setDynamicCode, setFormResult } from '../../Redux/FirmwareFile';
import { change as changeFirmwareFile } from '../../Redux/FirmwareFile';
import { increase, decrease } from '../../Redux/CodeGenSteps';
import { useDispatch, useSelector } from 'react-redux';
import { StepForwardOutlined, StepBackwardOutlined, CopyOutlined } from '@ant-design/icons'
import { CopyBlock, dracula, googlecode } from 'react-code-blocks'

function DynamicCodeGenerationForm() {

    // antd related variables
    const { Option } = Select

    // form related variables to change the form dynamically
    const [motors, setMotors] = useState(false)
    const [distanceSensor, setDistanceSensor] = useState(false)

    // redux related variables
    const { formResult, algorithmName, generatedCppCode } = useSelector((state) => state.firmware);
    const dispatch = useDispatch()

    const [copyState, setCopyState] = useState("Copy")

    // code blocks related variables
    const showLineNumbers = true
    const codeBlock = true
    
    const handleCopy = () => {
        setCopyState("Copied")
        navigator.clipboard.writeText(generatedCppCode)
        setTimeout(function() {
          setCopyState("Copy")
        }, 1000);
    }

    useEffect(() => {
        setMotors(formResult?.ENABLE_MOTORS)
        setDistanceSensor(formResult?.ENABLE_DISTANCE_SENSOR)
    }, [])

    // store features object after assigning related values
    const onFinish = (values) => {
        // validations
        if (values.ENABLE_MOTORS && !(values.DRIVE_SERVO || values.DRIVE_PWM)) {
            message.error('Need to be enable either DRIVE SERVO or DRIVE PWM');
        } else if (values.ENABLE_DISTANCE_SENSOR && !(values.DISTANCE_GP2Y0A21YK0F || values.DISTANCE_VL53LX0)) {
            message.error('Need to enable either GP2Y0A21YK0F or VL53LX0 sensor');
        } else if (values.ENABLE_DISTANCE_SENSOR && values.DISTANCE_GP2Y0A21YK0F && values.DISTANCE_VL53LX0) {
            message.error('You can\'t enable both GP2Y0A21YK0F and VL53LX0 sensors at once');
        } else if (values.ENABLE_MQTT && !values.ENABLE_WIFI) {
            message.error('Need to enable WiFi to enable the MQTT');
        } else {

            let features = [
                { name: "ALGORITHM", value: values.ALGORITHM, isEnabled: values.ALGORITHM ? true : false },
                { name: "ENABLE_SERIAL_COMMUNICATION", value: "ENABLE_SERIAL_COMMUNICATION", isEnabled: values.ENABLE_SERIAL_COMMUNICATION ? true : false, extra: ["1"] },
                { name: "NEOPIXEL_INDICATIONS", value: "NEOPIXEL_INDICATIONS", isEnabled: values.NEOPIXEL_INDICATIONS ? true : false },
                { name: "ENABLE_MEMORY", value: "ENABLE_MEMORY", isEnabled: values.ENABLE_MEMORY ? true : false },
                { name: "ENABLE_MOTORS", value: "ENABLE_MOTORS", isEnabled: values.ENABLE_MOTORS ? true : false, dependencies: [
                    { name: "WHEEL_ENCODER", value: "WHEEL_ENCODER", isEnabled: values.WHEEL_ENCODER ? true : false },
                    { name: "DRIVE_PWM", value: "DRIVE_PWM", isEnabled: values.DRIVE_PWM ? true : false },
                    { name: "DRIVE_SERVO", value: "DRIVE_SERVO", isEnabled: values.DRIVE_SERVO ? true : false },
                ] },
                { name: "ENABLE_DISTANCE_SENSOR", value: "ENABLE_DISTANCE_SENSOR", isEnabled: values.ENABLE_DISTANCE_SENSOR ? true : false, dependencies: [
                    { name: "DISTANCE_GP2Y0A21YK0F", value: "DISTANCE_GP2Y0A21YK0F", isEnabled: values.DISTANCE_GP2Y0A21YK0F ? true : false },
                    { name: "DISTANCE_VL53LX0", value: "DISTANCE_VL53LX0", isEnabled: values.DISTANCE_VL53LX0 ? true : false },
                ] },
                { name: "ENABLE_NEOPIXEL_RING", value: "ENABLE_NEOPIXEL_RING", isEnabled: values.ENABLE_NEOPIXEL_RING ? true : false },
                { name: "ENABLE_COLOR_SENSOR", value: "ENABLE_COLOR_SENSOR", isEnabled: values.ENABLE_COLOR_SENSOR ? true : false },
                { name: "ENABLE_COMPASS_SENSOR", value: "ENABLE_COMPASS_SENSOR", isEnabled: values.ENABLE_COMPASS_SENSOR ? true : false },
                { name: "ENABLE_OTA_UPLOAD", value: "ENABLE_OTA_UPLOAD", isEnabled: values.ENABLE_OTA_UPLOAD ? true : false },
                { name: "ENABLE_MQTT", value: "ENABLE_MQTT", isEnabled: values.ENABLE_MQTT ? true : false },
                { name: "ENABLE_WIFI", value: "ENABLE_WIFI", isEnabled: values.ENABLE_WIFI ? true : false }
            ]

            dispatch(setDynamicCode(features)) // store dynamically generated feature object
            dispatch(setFormResult(values)) // store form result 
            dispatch(increase()) // increase the step 
        }
    };

    const onChange = (value) => {
        console.log(`selected ${value}`);
        dispatch(changeFirmwareFile(value))
    };
    
    const onSearch = (value) => {
        console.log('search:', value);
    };
    
    // firmware files
    const files = [
        {
            value: 'esp_robot_firmware',
            label: 'ESP-Firmware-01'
        }
    ]

  return (
    <div className='mt-1 mb-5'>

        {/* generated cpp code */}
        {/* <div className='terminal p-4' id="terminalDiv">
            <span className='response-msg text-light'>
                {generatedCppCode}
            </span>
        </div> */}
        <div className='code-block mt-3'>
            <CopyBlock
            text={generatedCppCode}
            language={'cpp'}
            theme={googlecode}
            customStyle={{
                height: '300px',
                overflow: 'scroll',
            }}
            {...{ showLineNumbers, codeBlock }}
            />
        </div>


        <div className='mt-3'>
            {/* dynamic code generation form */}
            <Form
                name="dynamic_code_generation"
                onFinish={onFinish}
                initialValues={{
                    FIRMWARE: formResult?.FIRMWARE,
                    ALGORITHM: algorithmName ? `ALGO_${algorithmName.toUpperCase()}` : '',
                    ENABLE_SERIAL_COMMUNICATION: formResult?.ENABLE_SERIAL_COMMUNICATION !== undefined ? formResult?.ENABLE_SERIAL_COMMUNICATION : true,
                    NEOPIXEL_INDICATIONS: formResult?.NEOPIXEL_INDICATIONS !== undefined ? formResult?.NEOPIXEL_INDICATIONS : true,
                    ENABLE_MEMORY: formResult?.ENABLE_MEMORY !== undefined ? formResult?.ENABLE_MEMORY : true,
                    ENABLE_NEOPIXEL_RING: formResult?.ENABLE_NEOPIXEL_RING !== undefined ? formResult?.ENABLE_NEOPIXEL_RING : true,
                    ENABLE_COLOR_SENSOR: formResult?.ENABLE_COLOR_SENSOR !== undefined ? formResult?.ENABLE_COLOR_SENSOR : true,
                    ENABLE_COMPASS_SENSOR: formResult?.ENABLE_COMPASS_SENSOR !== undefined ? formResult?.ENABLE_COMPASS_SENSOR : true,
                    ENABLE_OTA_UPLOAD: formResult?.ENABLE_OTA_UPLOAD !== undefined ? formResult?.ENABLE_OTA_UPLOAD : true,
                    ENABLE_MQTT: formResult?.ENABLE_MQTT !== undefined ? formResult?.ENABLE_MQTT : true,
                    ENABLE_WIFI: formResult?.ENABLE_WIFI !== undefined ? formResult?.ENABLE_WIFI : true,
                    ENABLE_MOTORS: formResult?.ENABLE_MOTORS,
                    DRIVE_PWM: formResult?.DRIVE_PWM,
                    WHEEL_ENCODER: formResult?.WHEEL_ENCODER,
                    DRIVE_SERVO: formResult?.DRIVE_SERVO,
                    ENABLE_DISTANCE_SENSOR: formResult?.ENABLE_DISTANCE_SENSOR,
                    DISTANCE_GP2Y0A21YK0F: formResult?.DISTANCE_GP2Y0A21YK0F,
                    DISTANCE_VL53LX0: formResult?.DISTANCE_VL53LX0
                }}
            >
                <Row>
                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12">
                        <h6>FIRMWARE FILE</h6>
                        <Form.Item
                            name="FIRMWARE"
                            rules={[
                                {
                                required: true,
                                message: 'Please select a firmware file!',
                                },
                            ]}
                        >
                            <Select
                                className='col-12'
                                showSearch
                                placeholder="Search to select firmware file"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                size="large"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={files}
                            />
                        </Form.Item>
                    </Col>

                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12">
                        <div className='d-flex'>
                            <h6>ALGORITHM</h6>
                            
                            <div style={{marginLeft: '5px', marginTop: '-4px'}}>
                                <Tooltip title={copyState}>
                                    <CopyOutlined onClick={() => handleCopy()} />
                                </Tooltip>
                            </div>
                        </div>
                        <Form.Item
                            name="ALGORITHM"
                            rules={[
                                {
                                required: true,
                                message: 'Please select an algorithm!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select the algorithm"
                                size="large"
                                value={`ALGO_${algorithmName.toUpperCase()}`}
                                defaultValue={`ALGO_${algorithmName.toUpperCase()}`}
                            >
                                <Option value={`ALGO_${algorithmName.toUpperCase}`}>{`ALGO_${algorithmName.toUpperCase()}`}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                
                <Row>
                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_SERIAL_COMMUNICATION" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>ENABLE SERIAL COMMUNICATION</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="NEOPIXEL_INDICATIONS" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>NEOPIXEL INDICATIONS</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_MEMORY" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>ENABLE MEMORY</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_NEOPIXEL_RING" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>ENABLE NEOPIXEL RING</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_COLOR_SENSOR" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>ENABLE COLOR SENSOR</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_COMPASS_SENSOR" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>ENABLE COMPASS SENSOR</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_OTA_UPLOAD" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>ENABLE OTA UPLOAD</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_MQTT" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>ENABLE MQTT</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_WIFI" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox>ENABLE WIFI</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_MOTORS" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox onChange={(e) => setMotors(e.target.checked)}><h6>MOTORS</h6></Checkbox>
                        </Form.Item>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    {
                        motors &&
                        <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                            <Form.Item 
                                name="DRIVE_PWM" 
                                valuePropName="checked" 
                                noStyle
                            >
                                <Checkbox>DRIVE PWM</Checkbox>
                            </Form.Item>
                        </Col>
                    }

                    {
                        motors &&
                        <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                            <Form.Item 
                                name="DRIVE_SERVO" 
                                valuePropName="checked" 
                                noStyle
                            >
                                <Checkbox>DRIVE SERVO</Checkbox>
                            </Form.Item>
                        </Col>
                    }

                    {
                        motors &&
                        <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                            <Form.Item 
                                name="WHEEL_ENCODER" 
                                valuePropName="checked" 
                                noStyle
                            >
                                <Checkbox>WHEEL ENCODER</Checkbox>
                            </Form.Item>
                        </Col>
                    }
                </Row>

                <Row className='mt-3'>
                    <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                        <Form.Item 
                            name="ENABLE_DISTANCE_SENSOR" 
                            valuePropName="checked" 
                            noStyle
                        >
                            <Checkbox onChange={(e) => setDistanceSensor(e.target.checked)}><h6>DISTANCE SENSOR</h6></Checkbox>
                        </Form.Item>
                    </Col>

                    <Row className='mt-2'>
                        {
                            distanceSensor &&
                            <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                                <Form.Item 
                                    name="DISTANCE_GP2Y0A21YK0F" 
                                    valuePropName="checked" 
                                    noStyle
                                >
                                    <Checkbox>DISTANCE GP2Y0A21YK0F</Checkbox>
                                </Form.Item>
                            </Col>
                        }

                        {
                            distanceSensor &&
                            <Col xxl="3" xl="3" lg="3" md="4" sm="6" xs="6" className='my-auto'>
                                <Form.Item 
                                    name="DISTANCE_VL53LX0" 
                                    valuePropName="checked" 
                                    noStyle
                                >
                                    <Checkbox>DISTANCE VL53LX0</Checkbox>
                                </Form.Item>
                            </Col>
                        }
                    </Row>

                </Row>

                <Row className='text-center mt-3'>
                    <Form.Item>
                        <div className='d-flex justify-content-center'>
                            <Button style={{marginRight: '5px'}} onClick={() => dispatch(decrease())}>
                                <div className='d-flex'>
                                    <div style={{marginTop: '-3px', marginRight: '3px'}}><StepBackwardOutlined /></div>
                                    <div>Back</div>
                                </div>
                            </Button>

                            <Button type="primary" htmlType="submit">
                                <div className='d-flex'>
                                    <div>Next</div>
                                    <div style={{marginTop: '-3px', marginRight: '3px'}}><StepForwardOutlined /></div>
                                </div>
                            </Button>
                        </div>
                    </Form.Item>
                </Row>
            </Form>
        </div>
    </div>
  )
}

export default DynamicCodeGenerationForm