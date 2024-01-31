import AbstractSyntaxTree from "abstract-syntax-tree";
export default function parse(source)
{
    try {
        return AbstractSyntaxTree.parse(source, {
            loc: true
        })
    }catch(err) {
        console.log(err)
    }
}