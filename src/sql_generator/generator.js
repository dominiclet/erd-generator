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

// Returns an array of relationships
const relationshipChildrenHandler = (xmlEntities, xmlRelationships) => {
    let relationships = [];

    const relationshipStrHandler = (text) => {
        relationships.push({
            tableName: text,
        })
        return relationships;
    }

    const getForeignAttributes = (xmlEntities, xmlRelationship) => {
        let linkedEntityNames = xmlRelationship['entity'].map((entity) => {
            return entity['#text']
        });
        console.log(`linkedEntityNames: ${linkedEntityNames}`)

        let foreignPrimaryAttributes = [];
        for (let xmlEntity of xmlEntities) {
            if (linkedEntityNames.includes(xmlEntity['#text'])) {
                for (let attribute of xmlEntity['attribute']) {
                    if (attribute['@_primary'] == 'true') {
                        foreignPrimaryAttributes.push(attribute['#text'] + ' ' + attribute['@_type']);
                    }
                }
            }
        }
        return foreignPrimaryAttributes;
    }

    const getPrimaryKey = (xmlEntities, xmlRelationship) => {
        let linkedEntityNames = xmlRelationship['entity'].map((entity) => {
            return entity['#text']
        });

        let foreignPrimaryAttributes = [];
        for (let xmlEntity of xmlEntities) {
            if (linkedEntityNames.includes(xmlEntity['#text'])) {
                for (let attribute of xmlEntity['attribute']) {
                    if (attribute['@_primary'] == 'true') {
                        foreignPrimaryAttributes.push(attribute['#text']);
                    }
                }
            }
        }
        
        let primaryKeyString = "PRIMARY KEY (" + foreignPrimaryAttributes.join(',') + ")";
        return primaryKeyString;
    }

    const getForeignKeys = (xmlEntities, xmlRelationship) => {
        let linkedEntityNames = xmlRelationship['entity'].map((entity) => {
            return entity['#text']
        });

        let foreignKeysStringsArray = [];
        for (let xmlEntity of xmlEntities) {
            let entityStr = "FOREIGN KEY (";
            let entityPrimaryKey = [];
            if (linkedEntityNames.includes(xmlEntity['#text'])) {
                for (let attribute of xmlEntity['attribute']) {
                    if (attribute['@_primary'] == 'true') {
                        entityPrimaryKey.push(attribute['#text']);
                    }
                }
            }
            entityStr += entityPrimaryKey.join(',');
            entityStr += ") REFERENCES ";
            entityStr += xmlEntity['#text'];
            entityStr += "(";
            entityStr += entityPrimaryKey.join(',');
            entityStr += ")";
            foreignKeysStringsArray.push(entityStr);
        }

        console.log(`foreignKeysStringsArray: ${foreignKeysStringsArray}`);
        return foreignKeysStringsArray;
    }

    const relationshipObjHandler = (obj) => {
        const tableName = obj["#text"];
        const attributes = obj["attribute"];
        const foreignAttributes = getForeignAttributes(xmlEntities, obj);
        const primaryKey = getPrimaryKey(xmlEntities, obj);
        const foreignKeys = getForeignKeys(xmlEntities, obj);

        relationships.push({
            tableName: tableName,
            attributes: attributes,
            foreignAttributes: foreignAttributes,
            primaryKey: primaryKey,
            foreignKeys: foreignKeys,
        })
        return relationships;
    }

    const relationshipArrHandler = (arr) => {
        // Multiple entities
        let retStr = '';

        arr.forEach((elem, idx) => {
            entityHelper(elem);
        });
        return retStr;
    }


    const relationshipHelper = getChildrenHandler(relationshipStrHandler, relationshipObjHandler, relationshipArrHandler);
    relationshipHelper(xmlRelationships);

    return relationships;
}

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

    erd.relationships.forEach(relationship => {
        let colSqlStr = '';
        let sqlCols = [];
        
        // Add own attribute of relationship
        for (let attribute of relationship.attributes) {
            sqlCols.push(`  ${attribute['#text']} ${attribute['@_type']} NOT NULL`)
        }

        // Add primary key of linked attributes
        for (let foreignAttribute of relationship.foreignAttributes) {
            sqlCols.push(`  ${foreignAttribute}`);
        }

        // Add in primary key
        sqlCols.push(`  ${relationship.primaryKey}`);

        // Add in foreign keys
        for (let foreignKey of relationship.foreignKeys) {
            sqlCols.push(`  ${foreignKey}`);
        }

        // Join sqlCols into colSqlStr
        if (sqlCols.length > 0) {
            colSqlStr = `\n${sqlCols.join(",\n")}\n`;
        }

        entitySql.push(`CREATE TABLE ${relationship.tableName} (${colSqlStr})`);
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
    let xmlRelationships = xml["erd"]["relationship"];
    console.log(xmlEntities);
    console.log(xmlRelationships);
    
    const erd = {
        entities: entityChildrenHandler(xmlEntities),
        // Can add relationships here
        relationships: relationshipChildrenHandler(xmlEntities, xmlRelationships),
    };
    console.log(erd);

    // Convert erd to sql
    const sql = generateSql(erd);

    console.log(sql);
    return sql;
}

