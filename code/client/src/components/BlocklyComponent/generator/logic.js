import cppGenerator from './cpp';

cppGenerator['controls_if'] = function(block) {
    // If/elseif/else condition.
    let n = 0;
    let code = '', branchCode, conditionCode;
    var value_name = cppGenerator.valueToCode(block, 'NAME', cppGenerator.ORDER_ATOMIC);
    
    if (cppGenerator.STATEMENT_PREFIX) {
      // Automatic prefix insertion is switched off for this block.  Add manually.
      code += cppGenerator.injectId(cppGenerator.STATEMENT_PREFIX, block);
    }
    do {
      conditionCode =
      cppGenerator.valueToCode(block, 'IF' + n, cppGenerator.ORDER_NONE) || 'false';
      branchCode = cppGenerator.statementToCode(block, 'DO' + n);
      if (cppGenerator.STATEMENT_SUFFIX) {
        branchCode =
            cppGenerator.prefixLines(
                cppGenerator.injectId(cppGenerator.STATEMENT_SUFFIX, block), cppGenerator.INDENT) +
            branchCode;
      }
      code += (n > 0 ? 'else ' : '') + 'if (' + conditionCode + ') {\n' +
          branchCode + '\n}';
      n++;
    } while (block.getInput('IF' + n));
  
    if (block.getInput('ELSE') || cppGenerator.STATEMENT_SUFFIX) {
      branchCode = cppGenerator.statementToCode(block, 'ELSE');
      if (cppGenerator.STATEMENT_SUFFIX) {
        branchCode =
            cppGenerator.prefixLines(
                cppGenerator.injectId(cppGenerator.STATEMENT_SUFFIX, block), cppGenerator.INDENT) +
            branchCode;
      }
      code += ' else {\n' + branchCode + '\n}';
    }
    return code + '\n';
  };
  
  cppGenerator['logic_compare'] = function(block) {
    // Comparison operator.
    const OPERATORS =
        {'EQ': '==', 'NEQ': '!=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>='};
    const operator = OPERATORS[block.getFieldValue('OP')];
    const order = (operator === '==' || operator === '!=') ?
        cppGenerator.ORDER_EQUALITY :
        cppGenerator.ORDER_RELATIONAL;
    const argument0 = cppGenerator.valueToCode(block, 'A', order) || '0';
    const argument1 = cppGenerator.valueToCode(block, 'B', order) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
  };
  