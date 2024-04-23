import AbstractSyntaxTree from "abstract-syntax-tree"
import getScope from "./getScope"

export default function getDeclarationScope(ast, location, name) {
    let targetScope = {
        start:0,
        end:0,
        scope:undefined
    }
    AbstractSyntaxTree.walk(ast,(node)=>{
        if(node.type === "VariableDeclarator" && node.id.type === "Identifier" && node.id.name === name){
            const scope = getScope(ast,node.loc.start.line, node.loc.start.column)
            if(location>=scope.start && location<=scope.end){
                if(targetScope.start === 0 || (scope.end-scope.start)<(targetScope.end-targetScope.start)){
                    targetScope.start = scope.start
                    targetScope.end = scope.end
                    targetScope.scope = scope.scope
                }
            }
        }
    })
    return targetScope
}