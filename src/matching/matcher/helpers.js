function argumentsIncludesGeneral(args) {
    let found = false
    args.forEach(arg => {
        if(arg.type === "General") {
            found = true
        }
    });
    return found
}
function noOfnotGeneralArgs(args) {
    return args.filter(x => x.type !== "General").length
}
function createBlockStatement(tree) {
    return {
        type: "BlockStatement",
        body: tree.body,
        start: tree.start,
        end: tree.end,
        range: tree.range,
        loc: tree.loc
    }
}
function statementsIncludesGeneral(statements) {
    let found = false
    statements.forEach(statement => {
        if(statement.type === "General") {
            found = true
        }
    });
    return found
}
function clearMeta(childs, metaVariables) {
    for(let key of Object.keys(childs)){
        if(Array.isArray(childs[key])) {
            for(let child of childs[key]) {
                clearMeta(child, metaVariables)
            }
        }
        if (typeof childs[key]=='object'){
            clearMeta(childs[key],metaVariables)
        }
        else if (typeof childs[key]=='string'){
            delete metaVariables[key]
        }
        delete childs[key]
    }       
}
export {
    clearMeta,
    noOfnotGeneralArgs,
    argumentsIncludesGeneral,
    createBlockStatement,
    statementsIncludesGeneral
}