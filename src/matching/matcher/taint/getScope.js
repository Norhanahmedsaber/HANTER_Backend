import AbstractSyntaxTree from "abstract-syntax-tree";

export default function getScope(AST, row, col) {
    let start = 0
    let end = 0
    let scope=AST
    let startCondition = false;
    let stopCondition = false
    AbstractSyntaxTree.walk(AST, (node) => {
        if (startCondition) {
            if (!stopCondition) {
                if (node.type === "BlockStatement") {
                    if (checkIfInside(row, col, node.loc.start.line, node.loc.end.line, node.loc.start.column, node.loc.end.column)) {
                        start = node.loc.start.line
                        end = node.loc.end.line
                        scope=node
                        const newLoc = getScope(node, row, col)
                        if (newLoc.start !== 0) {
                            start = newLoc.start
                            end = newLoc.end
                            scope=newLoc.scope
                        }
                    } else if (node.loc.start.line > row) {
                        stopCondition = true
                    }
                }
            }
        }else {
            startCondition = true
        }

    })
    return {
        start, end, scope
    }
}
export function checkIfInside(row, col, scopeRowStart, scopeRowEnd, scopeColStart, scopeColEnd) {
    if(row>=scopeRowStart && row<=scopeRowEnd){
        if(row==scopeRowStart){
            if(col<scopeColStart){
                return false
            }
        }    
        if(row==scopeRowEnd){
            if(col>scopeColEnd){
                return false
            }
        }    
        return true
    }
    return false
}