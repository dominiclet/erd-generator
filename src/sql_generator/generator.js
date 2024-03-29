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

// Returns an array of entities
const entityChildrenHandler = (ents) => {
    let entities = [];

    // Entity with only text as children should create an empty table
    const entityStrHandler = (text) => {
        entities.push({
            tableName: text,
        })
        return entities;
    }

    const entityObjHandler = (obj) => {
        const tableName = obj["#text"];
        const attributes = obj["attribute"];
        const cols = attributeChildrenHandler(attributes);

        entities.push({
            tableName: tableName,
            columns: cols,
        })
        return entities;
    }

    const entityArrHandler = (arr) => {
        // Multiple entities
        let retStr = '';

        arr.forEach((elem, idx) => {
            entityHelper(elem);
        });
        return retStr;
    }

    const entityHelper = getChildrenHandler(entityStrHandler, entityObjHandler, entityArrHandler);

    entityHelper(ents);

    return entities;
}


// Returns an array of column
const attributeChildrenHandler = (attributes) => {
    let cols = [];

    const attributeStrHandler = (text) => {
        // Let VARCHAR(32) be default if type attribute is not given
        cols.push({
            colName: text,
            type: 'varchar(32)',
            isPrimary: false,
            isUnique: false,
            isMandatory: false
        });
        return cols;
    }

    const attributeObjHandler = (obj) => {
        let colName = obj["#text"];
        let type = obj["@_type"] || "varchar(32)";
        let isPrimary = obj["@_primary"];
        let isMandatory = obj["@_mandatory"];
        let isUnique = obj["@_unique"];

        cols.push({
            colName: colName,
            type: type,
            isPrimary: isPrimary === "true",
            isUnique: isUnique === "true",
            isMandatory: isMandatory === "true"
        });

        return cols;
    }

    // More than one children attribute
    const attributeArrHandler = (arr) => {
        arr.forEach((elem) => {
            attrHelper(elem);
        });
        return;
    }

    const attrHelper = getChildrenHandler(attributeStrHandler, attributeObjHandler, attributeArrHandler);
    attrHelper(attributes);

    return cols;
}

// Logic for generating actual SQL from internal representation of ERD
const generateSql = (erd) => {
    const entitySql = [];
    erd.entities.forEach(entity => {
        let colSqlStr = '';
        let sqlCols = [];

        // Generate column names if they exist
        if (entity.columns != undefined) {
            let primaryKeys = []
            entity.columns.forEach(col => {
                if (col.isPrimary) {
                    primaryKeys.push(col.colName);
                }
                sqlCols.push(`    ${col.colName} ${col.type}${col.isUnique ? " UNIQUE" : ""}${col.isMandatory ? " NOT NULL" : ""}`);
            });
            if (primaryKeys.length > 0) {
                sqlCols.push(`    PRIMARY KEY (${primaryKeys.join(", ")})`);
            }
        }

        if (sqlCols.length > 0) {
            colSqlStr = `\n${sqlCols.join(",\n")}\n`;
        }

        entitySql.push(`CREATE TABLE ${entity.tableName} (${colSqlStr});`);
    })

    return entitySql.join("\n\n");
}

// Generate from xml string
export const generate = (xmlStr) => {
    let parser = new XMLParser({
        ignoreAttributes: false
    });
    let output = parser.parse(xmlStr);

    return generateFromObject(output);
}

// Generate from parsed xml object
export const generateFromObject = (xml) => {
    // Convert to internal representation of erd
    let xmlEntities = xml["erd"]["entity"];
    const erd = {
        entities: entityChildrenHandler(xmlEntities),
        // Can add relationships here
    };

    // Convert erd to sql
    const sql = generateSql(erd);

    console.log(sql);
    return sql;
}

