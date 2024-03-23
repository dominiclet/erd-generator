import { XMLParser } from "fast-xml-parser";

export const generate = (xmlStr) => {
    let parser = new XMLParser({
        ignoreAttributes: false
    });
    let output = parser.parse(xmlStr);

    generateFromObject(output);
}

export const generateFromObject = (xml) => {
    let entityLevel = xml["erd"]["entity"];
    let entityRet = entityChildrenHandler(entityLevel);
    console.log(entityRet);
}

// Common handle children function
// Triage to specific handlers depending on type of object
// Child/children are represented as either string, object, or array of [string|object]
const getChildrenHandler = (strHandler, objHandler, arrHandler) => ((children) => {
    if (typeof children === "string") {
        return strHandler(children);
    }
    if (Array.isArray(children)) {
        return arrHandler(children);
    }
    if (typeof children === "object") {
        return objHandler(children);
    }
    return undefined;
})

// Entity with only text as children should create an empty table
const entityStrHandler = (text) => {
    return `CREATE TABLE ${text} ();`
}

const entityObjHandler = (obj) => {
    const tableName = obj["#text"];
    const attributes = obj["attribute"];
    let attrSql = attributeChildrenHandler(attributes);

    return `CREATE TABLE ${tableName} (${attrSql});`;
}

const entityArrHandler = (arr) => {
    // Multiple entities
    let retStr = '';

    arr.forEach(elem => {
        retStr += entityChildrenHandler(elem) + "\n\n";
    });
    return retStr;
}

// Entity generation
const entityChildrenHandler = getChildrenHandler(entityStrHandler, entityObjHandler, entityArrHandler);

const attributeStrHandler = (text) => {
    // Let VARCHAR(32) be default if type attribute is not given
    return `${text} VARCHAR(32)`
}

const attributeObjHandler = (obj) => {
    let colName = obj["#text"];
    let type = obj["@_type"];

    return `${colName} ${type}`;
}

const attributeArrHandler = (arr) => {
    let retStr = '\n';

    arr.forEach((elem, idx) => {
        retStr += "    " + attributeChildrenHandler(elem) + (idx != arr.length - 1 ? "," : "") + "\n";
    });
    return retStr;
}

const attributeChildrenHandler = getChildrenHandler(attributeStrHandler, attributeObjHandler, attributeArrHandler);
