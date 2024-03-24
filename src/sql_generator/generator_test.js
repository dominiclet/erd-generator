import { generate } from "./generator.js";

const entityTest = '\
    <erd>\
        <entity>\
            Table1\
            <attribute type="varchar(32)" primary="true">col1</attribute>\
            <attribute type="integer">col2</attribute>\
            <attribute type="text" primary="true">col3</attribute>\
        </entity>\
        <entity>\
            Table2\
            <attribute primary="true">col1</attribute>\
        </entity>\
    </erd>';

generate(entityTest);
