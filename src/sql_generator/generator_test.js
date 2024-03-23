import { generate } from "./generator.js";

const entityTest = '\
    <erd>\
        <entity>\
            Table1\
            <attribute type="VARCHAR(32)">col1</attribute>\
            <attribute type="INT">col2</attribute>\
        </entity>\
        <entity>\
            Table2\
            <attribute>col1</attribute>\
        </entity>\
    </erd>';

generate(entityTest);
