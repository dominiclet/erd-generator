import { XMLParser } from "fast-xml-parser";

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
    const { generate } = attributeChildrenHandler(attributes);
    const attrSql = generate();

    return `CREATE TABLE ${tableName} (\n${attrSql}\n);`;
}

const entityArrHandler = (arr) => {
    // Multiple entities
    let retStr = '';

    arr.forEach((elem, idx) => {
        retStr += entityChildrenHandler(elem) + (idx != arr.length - 1 ? "\n\n" : "");
    });
    return retStr;
}

// Entity generation
const entityChildrenHandler = getChildrenHandler(entityStrHandler, entityObjHandler, entityArrHandler);


const attributeChildrenHandler = (attributes) => {
    let cols = [];
    let primaryKeys = [];

    const attributeStrHandler = (text) => {
        // Let VARCHAR(32) be default if type attribute is not given
        let col = `    ${text} varchar(32)`;
        cols.push(col);
        return col;
    }

    const attributeObjHandler = (obj) => {
        let colName = obj["#text"];
        let type = obj["@_type"] || "varchar(32)";
        let isPrimary = obj["@_primary"];
        let isMandatory = obj["@_mandatory"];

        if (isPrimary == "true") {
            primaryKeys.push(colName);
        }

        let col = `    ${colName} ${type}${isMandatory === "true" ? " NOT NULL" : ""}`
        cols.push(col);

        return col;
    }

    // More than one children attribute
    const attributeArrHandler = (arr) => {
        arr.forEach((elem) => {
            handler(elem);
        });
        return;
    }

    const handler = getChildrenHandler(attributeStrHandler, attributeObjHandler, attributeArrHandler);

    const generate = () => {
        handler(attributes);
        let colSql = cols.join(",\n")
        if (primaryKeys.length > 0) {
            colSql += ",\n" + `    PRIMARY KEY (${primaryKeys.join(", ")})`
        }
        return colSql;
    }

    return {
        generate
    }
}

export const generate = (xmlStr) => {
    let parser = new XMLParser({
        ignoreAttributes: false
    });
    let output = parser.parse(xmlStr);

    generateFromObject(output);
}

export const generateFromObject = (xml) => {
    let xmlEntities = xml["erd"]["entity"];
    let sql = entityChildrenHandler(xmlEntities);
    console.log(sql);
    return sql;
}

