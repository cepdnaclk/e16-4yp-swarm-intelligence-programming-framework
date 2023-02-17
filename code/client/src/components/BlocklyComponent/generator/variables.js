import cppGenerator from "./cpp";
import { Names } from "blockly/core";

cppGenerator["variables_get"] = function (block) {
  // Variable getter.
  const code = cppGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Names.NameType.VARIABLE
  );
  return [code, cppGenerator.ORDER_ATOMIC];
};

cppGenerator["variables_set"] = function (block) {
  // Variable setter.
  const argument0 =
    cppGenerator.valueToCode(block, "VALUE", cppGenerator.ORDER_ASSIGNMENT) ||
    "0";
  const varName = cppGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Names.NameType.VARIABLE
  );
  return varName + " = " + argument0 + ";\n";
};
