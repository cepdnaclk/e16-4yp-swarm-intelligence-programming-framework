import * as Blockly from "blockly/core";
import { Workspace } from "blockly/core";

/* eslint-disable no-undef */
// goog.provide("Blockly.cpp");
// goog.require("Blockly.Generator");

Blockly.cpp = new Blockly.Generator("cpp");

Blockly.cpp.C_VARIABLE_TYPES = [
  ["float", "float"],
  ["int", "int"],
  ["unsigned int", "unsigned int"],
  ["short", "short"],
  ["unsigned short", "unsigned short"],
  ["bool", "bool"],
];

Blockly.cpp.SWARM_ALGO_SIGNATURES = [
  "algorithm_setup",
  "algorithm_start",
  "algorithm_execute",
  "algorithm_interrupt",
  "algorithm_reset",
  "algorithm_stop",
];

Blockly.cpp.C_GLOBAL_VARS = [];

// http://en.cppreference.com/w/cpp/keyword
Blockly.cpp.addReservedWords(
  ",alignas,alignof,and,and_eq,asm,auto,bitand,bitor,bool,break,case,catch,char,char16_t,char32_t,class,compl,const,constexpr,const_cast,continue,decltype,default,delete,do,double,dynamic_cast,else,enum,explicit,export,extern,false,float,for,friend,goto,if,inline,int,long,long double,long long,mutable,namespace,new,noexcept,not,not_eq,nullptr,operator,or,or_eq,private,protected,public,register,reinterpret_cast,return,short,signed,sizeof,static,static_assert,static_cast,struct,switch,template,this,thread_local,throw,true,try,typedef,typeid,typename,union,unsigned,using,virtual,void,volatile,wchar_t,while,xor,xor_eq,posix," +
    "game,api,PI,PI2,PI3,PI4,DEG2RAD,RAD2DEG,ZRMS,ZR2D,ZR3D,ALLIANCE"
);

Blockly.cpp.INFINITE_LOOP_TRAP = null;

Blockly.cpp.ORDER_ATOMIC = 0; // 0 "" ...
Blockly.cpp.ORDER_MEMBER = 2; // . []
Blockly.cpp.ORDER_FUNCTION_CALL = 2; // ()
Blockly.cpp.ORDER_INCREMENT = 3; // ++
Blockly.cpp.ORDER_DECREMENT = 3; // --
Blockly.cpp.ORDER_LOGICAL_NOT = 3; // !
Blockly.cpp.ORDER_BITWISE_NOT = 3; // ~
Blockly.cpp.ORDER_UNARY_PLUS = 3; // +
Blockly.cpp.ORDER_UNARY_NEGATION = 3; // -
Blockly.cpp.ORDER_MULTIPLICATION = 5; // *
Blockly.cpp.ORDER_DIVISION = 5; // /
Blockly.cpp.ORDER_MODULUS = 5; // %
Blockly.cpp.ORDER_ADDITION = 6; // +
Blockly.cpp.ORDER_SUBTRACTION = 6; // -
Blockly.cpp.ORDER_BITWISE_SHIFT = 7; // << >>
Blockly.cpp.ORDER_RELATIONAL = 8; // < <= > >=
Blockly.cpp.ORDER_EQUALITY = 9; // == !=
Blockly.cpp.ORDER_BITWISE_AND = 10; // &
Blockly.cpp.ORDER_BITWISE_XOR = 11; // ^
Blockly.cpp.ORDER_BITWISE_OR = 12; // |
Blockly.cpp.ORDER_LOGICAL_AND = 13; // &&
Blockly.cpp.ORDER_LOGICAL_OR = 14; // ||
Blockly.cpp.ORDER_CONDITIONAL = 15; // ?:
Blockly.cpp.ORDER_ASSIGNMENT = 15; // = += -= *= /= %= <<= >>= ...
Blockly.cpp.ORDER_COMMA = 17; // ,
Blockly.cpp.ORDER_NONE = 99; // (...)

Blockly.cpp.isInitialized = false;

Blockly.cpp.init = function (workspace) {
  Object.getPrototypeOf(this).init.call(this);

  if (!this.nameDB_) {
    this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
  } else {
    this.nameDB_.reset();
  }
  // Create a dictionary of definitions to be printed before the code.
   Blockly.cpp.nameDB_.setVariableMap(workspace.getVariableMap());
   Blockly.cpp.nameDB_.populateVariables(workspace);
   Blockly.cpp.nameDB_.populateProcedures(workspace);
  Blockly.cpp.definitions_ = Object.create(null);
  Blockly.cpp.algorithm_ = "Algorithm_" + Date.now();

  Blockly.cpp.times_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.cpp.functionNames_ = Object.create(null);

  if (Blockly.Variables) {
    if (!Blockly.cpp.variableDB_) {
      Blockly.cpp.variableDB_ = new Blockly.Names(Blockly.cpp.RESERVED_WORDS_);
    } else {
      Blockly.cpp.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allUsedVarModels(workspace);
    // var structures = Blockly.Structure.allStructure();
    for (var x = 0; x < variables.length; x++) {
      if (variables[x][3] == "global")
        defvars[x] =
          variables[x][0] +
          variables[x][1] +
          " " +
          Blockly.cpp.variableDB_.getName(
            variables[x][2],
            Blockly.Variables.NAME_TYPE
          ) +
          ";";
    }
    Blockly.cpp.definitions_["variables"] = defvars.join("\n");
  }
  Blockly.cpp.isInitialized = true;
  console.log(workspace.getVariableMap());
};

Blockly.cpp.finish = function (code) {
  // Indent every line.
  if (code) {
    code = this.prefixLines(code, Blockly.cpp.INDENT);
  }
  code = "\n" + code;

  // Convert the definitions dictionary into a list.
  var includes = [];
  var declarations = [];
  var defines = [];
  var func_definitions = [];
  for (var name in Blockly.cpp.definitions_) {
    var def = Blockly.cpp.definitions_[name];
    var nameInclude = "include";
    var nameFunc_declare = "Func_declare";
    var nameDefine = "define";
    if (name.match(nameInclude)) {
      includes.push(def);
    } else if (name.match(nameFunc_declare)) {
      declarations.push(def); //declaration
    } else if (name.match(nameDefine)) {
      defines.push(def); //#define
    } else {
      func_definitions.push(def); //definition
    }
  }
  //imports--> #include
  //definitions--> function def, #def
  var allDefs =
    includes.join("\n") +
    "\n\n" +
    declarations.join("\n") +
    "\n\n" +
    defines.join("\n");
  var allFuncs = func_definitions.join("\n");
  var algorithmDefStart = `#ifdef ALGO_${Blockly.cpp.algorithm_.toUpperCase()}`;
  var algorithmDefEnd = `#endif`;
  let algorithm = `
    ${algorithmDefStart}\n
    ${code}\n
    ${allFuncs.replace(/\n\n+/g, "\n\n")}
    \n
    ${algorithmDefEnd}
  `;
  this.isInitialized = false;
  this.nameDB_.reset();

  return allDefs.replace(/\n\n+/g, "\n\n").replace(/\n*$/, "\n") + algorithm;
};

Blockly.cpp.finishFull = function (code) {
  console.log(code);
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.cpp.definitions_) {
    definitions.push(Blockly.cpp.definitions_[name]);
  }
  code =
    definitions.join("\n\n") +
    "\n\n" +
    "void setPos(float x, float y, float z) {\n\tfloat pos[3];\n\tpos[0] = x; pos[1] = y; pos[2] = z;\n\tapi.setPositionTarget(pos);\n}" +
    "\n\n" +
    code;
  //HACK: Make sure the code contains an init function in case the init page has not been properly initialized
  if (code.indexOf("//Begin page init\nvoid init() {\n") === -1) {
    code = "void init() {}\n" + code;
  }
  return code;
};

Blockly.cpp.scrubNakedValue = function (line) {
  return line + ";\n";
  //ZR editor should ignore all blocks that are not children of the page's function block
  // return '';
};

Blockly.cpp.quote_ = function (string) {
  string = string
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\?/g, "\\?");
  string = string.replace(/\\\\n/g, "\\n");
  return string; //Do not add quotes so printf formatting can be used
};

Blockly.cpp.scrub_ = function (block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return "";
  }
  var commentCode = "";
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, "// ") + "\n";
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, "// ");
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

// Constructor
Blockly.cpp["constructor"] = function (block) {
  var branchParams = Blockly.cpp.statementToCode(block, "PARAMS");
  var params = branchParams.split("$$");
  if (params.length > 2) {
    for (var i = 0; i < params.length - 3; i++) {
      params[i] = params[i] + ", ";
    }
    branchParams = params.join();
  } else {
    branchParams = params.join();
  }
  // removing the starting indentation and last comma
  branchParams = branchParams.substring(2, branchParams.lastIndexOf(","));

  var code = "$$CONSTRUCTOR_NAME$$(" + branchParams + ") {}\n";
  return code;
};

/**
 * Code generator stub for class-container block
 * @param block
 * @returns {string}
 */
Blockly.cpp["class-container"] = function (block) {
  // Blockly.cpp.validator.init(block.workspace);
  var text_class_name = block.getFieldValue("class_name");
  var statements_class_body = Blockly.cpp.statementToCode(block, "class_body");

  var code =
    "#incluse mbed.h \n\nclass ahmed " +
    text_class_name +
    " {\n" +
    statements_class_body +
    "}";

  var res = code.replace("$$CONSTRUCTOR_NAME$$", text_class_name);

  // Blockly.cpp.validator.refresh();
  return res;
};

/**
 * Code generator stub for child-class-container block
 * @param block
 * @returns {string}
 */
Blockly.cpp["child-class-container"] = function (block) {
  var text_class_name = block.getFieldValue("class_name");
  var statements_class_body = Blockly.cpp.statementToCode(block, "class_body");

  var parentClassName = this.parentBlock_.getFieldValue("class_name");
  var code =
    "\n\nclass " +
    text_class_name +
    ": " +
    parentClassName +
    " {\n" +
    statements_class_body +
    "}";
  var res = code.replace("$$CONSTRUCTOR_NAME$$", text_class_name);
  return res;
};

/**
 * Code generator stub for variable-container
 * @param block
 * @returns {string}
 */
Blockly.cpp["variable-container"] = function (block) {
  var dropdown_accessmodifire = block.getFieldValue("access-modifier");
  var statements_variables = Blockly.cpp.statementToCode(block, "variables");
  var code = dropdown_accessmodifire + ":\n" + statements_variables;
  return code;
};

/**
 * Code generator stub for method-container
 * @param block
 * @returns {string}
 */
Blockly.cpp["method-container"] = function (block) {
  var dropdown_access_modifier = block.getFieldValue("access-modifier");
  var statements_inputs = Blockly.cpp.statementToCode(block, "inputs");
  var code = dropdown_access_modifier + ":\n" + statements_inputs;

  return code;
};

/**
 * Code generation stub for method block
 * @method block
 * @returns {string}
 */
Blockly.cpp["method"] = function (block) {
  var returnType = block.getFieldValue("RETURN_TYPE");
  var methodName = block.getFieldValue("METHOD_NAME");
  var branch = Blockly.cpp.statementToCode(block, "NAME");
  var params = branch.split("$$");
  if (params.length > 2) {
    for (var i = 0; i < params.length - 3; i++) {
      params[i] = params[i] + ", ";
    }
    branch = params.join();
  } else {
    branch = params.join();
  }
  // removing the starting indentation and last comma
  branch = branch.substring(2, branch.lastIndexOf(","));
  var code = "";
  code += returnType;
  code += " " + methodName;
  code += "(" + branch + ") {";
  code += returnType && returnType !== "void" ? "\n\treturn -1;\n" : "";
  code += "}\n";
  return code;
};

var workspace;
var colors = ["red", "green", "yellow"];

// Blockly.cpp.validator.init = function (pWorkspace) {
//   if (!workspace) {
//     workspace = pWorkspace;
//   }
// };

// Blockly.cpp.validator.refresh = function () {
//   var classes = workspace.getAllBlocks().filter(function (block) {
//     return block.type == "class-container";
//   });

//   var classDropDowns = workspace.getAllBlocks().filter(function (block) {
//     return block.type == "class-instance-variable";
//   });
//   var classNameList = [];
//   for (var i in classes) {
//     classNameList.push(classes[i].getFieldValue("class_name"));
//   }

//   if (classDropDowns) {
//     for (var z in classDropDowns) {
//       classDropDowns[z].inputList[0].fieldRow[1].menuGenerator_ = [];
//     }
//     for (var i in classNameList) {
//       for (var x in classDropDowns) {
//         classDropDowns[x].inputList[0].fieldRow[1].menuGenerator_.push([
//           classNameList[i],
//           classNameList[i],
//         ]);
//       }
//     }
//   }
// };

/**
 * Code generation stub for variable block
 * @param block
 * @returns {string}
 */
Blockly.cpp["variable"] = function (block) {
  var dropdown_variabletype = block.getFieldValue("variableType");
  var text_varname = block.getFieldValue("varName");
  var code = "\t" + dropdown_variabletype + " " + text_varname + "= 0;\n";
  return code;
};

/**
 * Code generation stub for parameter block
 * @param block
 * @returns {string}
 */
Blockly.cpp["parameter"] = function (block) {
  var text_parameter_name = block.getFieldValue("parameter-name");
  var dropdown_name = block.getFieldValue("NAME");
  var code = dropdown_name + " " + text_parameter_name + "$$"; //adding $$ to use it as a delimiter
  return code;
};
/**
 * Code generation stub for object variable block
 * @param block
 * @returns {string}
 */

Blockly.cpp["class-instance-variable"] = function (block) {
  var text_class_name = block.getFieldValue("class_name");
  var text_var_name = block.getFieldValue("variable_name");
  var code = text_class_name + " " + text_var_name + ";\n";
  return code;
};
/**
 * Code generation stub for pointer variable block
 * @param block
 * @returns {string}
 */

Blockly.cpp["object-pointer"] = function (block) {
  var text_pointer_name = block.getFieldValue("pointer_name");
  var class_name = block.getFieldValue("class_name");
  var code = class_name + " " + "*" + text_pointer_name + ";\n";
  return code;
};

Blockly.cpp.validateWorkspace = (wp) => {
  console.log(wp);
};

export default Blockly.cpp;
