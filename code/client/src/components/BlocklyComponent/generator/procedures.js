import cppGenerator from "./cpp";
import { Names } from "blockly/core";
import Blockly from 'blockly'

cppGenerator["procedures_defreturn"] = function (block) {
  // Define a procedure with a return value.
  const funcName = cppGenerator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Names.NameType.PROCEDURE
  );
  let xfix1 = "";
  if (cppGenerator.STATEMENT_PREFIX) {
    xfix1 += cppGenerator.injectId(cppGenerator.STATEMENT_PREFIX, block);
  }
  if (cppGenerator.STATEMENT_SUFFIX) {
    xfix1 += cppGenerator.injectId(cppGenerator.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = cppGenerator.prefixLines(xfix1, cppGenerator.INDENT);
  }
  let loopTrap = "";
  if (cppGenerator.INFINITE_LOOP_TRAP) {
    loopTrap = cppGenerator.prefixLines(
      cppGenerator.injectId(cppGenerator.INFINITE_LOOP_TRAP, block),
      cppGenerator.INDENT
    );
  }
  const branch = cppGenerator.statementToCode(block, "STACK");
  let returnValue =
    cppGenerator.valueToCode(block, "RETURN", cppGenerator.ORDER_NONE) || "";
  let xfix2 = "";
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = cppGenerator.INDENT + "return " + returnValue + ";\n";
  }
  const returnType = returnValue ? "dynamic" : "void";
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = cppGenerator.nameDB_.getName(
      variables[i],
      Names.NameType.VARIABLE
    );
  }
  let code =
    returnType +
    " " +
    funcName +
    "(" +
    args.join(", ") +
    ") {\n" +
    xfix1 +
    loopTrap +
    branch +
    xfix2 +
    returnValue +
    "}";
  code = cppGenerator.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  cppGenerator.definitions_["%" + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
cppGenerator["procedures_defnoreturn"] = cppGenerator["procedures_defreturn"];

cppGenerator["procedures_callreturn"] = function (block) {
  // Call a procedure with a return value.
  const funcName = cppGenerator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Names.NameType.PROCEDURE
  );
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] =
      cppGenerator.valueToCode(block, "ARG" + i, cppGenerator.ORDER_NONE) ||
      "null";
  }
  let code = funcName + "(" + args.join(", ") + ")";
  return [code, cppGenerator.ORDER_UNARY_POSTFIX];
};

cppGenerator["procedures_callnoreturn"] = function (block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  const tuple = cppGenerator["procedures_callreturn"](block);
  return tuple[0] + ";\n";
};

cppGenerator["algorithm_interrupt"] = function (block) {
  var variable_interrupt_variable = cppGenerator.nameDB_.getName(
    block.getFieldValue("interrupt_variable"),
    Blockly.Variables.NAME_TYPE
  );
  var variable_msg_variable = cppGenerator.nameDB_.getName(
    block.getFieldValue("msg_variable"),
    Blockly.Variables.NAME_TYPE
  );
  var statements_interrupt_body = cppGenerator.statementToCode(
    block,
    "interrupt_body"
  );
  var code = `void algorithm_interrupt(robot_interrupt_t ${variable_interrupt_variable}, char* ${variable_msg_variable}) {
    \t${statements_interrupt_body}
  }`;
  return code;
};
