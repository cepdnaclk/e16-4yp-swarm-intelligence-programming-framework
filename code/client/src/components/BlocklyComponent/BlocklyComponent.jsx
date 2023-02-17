import React from "react";
import { useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { setAlgorithmName, setGeneratedCppCode, setGeneratedXmlCode } from "../../Redux/FirmwareFile";
import { increase } from "../../Redux/CodeGenSteps";
import { StepForwardOutlined } from '@ant-design/icons'

import Blockly from "blockly/core";
import locale from "blockly/msg/en";
import "./generator/all";
import "./custom-blocks";
import cppGen from "./generator/cpp";
import { Button } from "antd";

Blockly.setLocale(locale);

function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const toolbox = useRef();
  let primaryWorkspace = useRef();

  // redux related variables
  const dispatch = useDispatch()

  const handleNext = () => {
    generateCode()
    generateXML()
    dispatch(increase())
  }

  const generateCode = () => {
    cppGen.init(primaryWorkspace.current);
    var code = cppGen.workspaceToCode(primaryWorkspace.current);
    const algorithmName = cppGen.algorithm_
    dispatch(setAlgorithmName(algorithmName)) // set algorithm name in redux state
    dispatch(setGeneratedCppCode(code)) // set generated cpp code in redux state
    console.log(code);
  };

  const generateXML = () => {
    var xmlDom = Blockly.Xml.workspaceToDom(primaryWorkspace.current);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    dispatch(setGeneratedXmlCode(xmlText)) // set generated xml code in redux state
    console.log(xmlText);
  };

  useEffect(() => {
    const { initialXml, children, ...rest } = props;
    primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      ...rest,
    });

    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom(initialXml),
        primaryWorkspace.current
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialXml]);

  return (
    <React.Fragment>
      <Button type="primary" onClick={() => handleNext()}>
        <div className='d-flex'>
            <div>Next</div>
            <div style={{marginTop: '-3px', marginRight: '3px'}}><StepForwardOutlined /></div>
        </div>
      </Button>
      <div ref={blocklyDiv} id="blocklyDiv" />
      <div style={{ display: "none" }} ref={toolbox}>
        {props.children}
      </div>
    </React.Fragment>
  );
}

export default BlocklyComponent;
