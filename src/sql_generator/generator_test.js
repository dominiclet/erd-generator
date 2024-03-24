import { generate } from "./generator.js";

const entityTest = '\
    <erd>\
        <entity>\
            Table1\
            <attribute type="varchar(32)">col1</attribute>\
            <attribute type="integer">col2</attribute>\
        </entity>\
        <entity>\
            Table2\
            <attribute>col1</attribute>\
        </entity>\
    </erd>';

generate(entityTest);
