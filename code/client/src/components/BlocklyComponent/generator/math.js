import cppGenerator from "./cpp";

cppGenerator["math_number"] = function (block) {
  // Numeric value.
  const code = Number(block.getFieldValue("NUM"));
  const order =
    code >= 0 ? cppGenerator.ORDER_ATOMIC : cppGenerator.ORDER_UNARY_NEGATION;
  return [code, order];
};
