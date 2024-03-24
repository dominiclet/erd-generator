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
            <attribute mandatory="true">mandatorycol2</attribute>\
            <attribute unique="true" type="integer">uniquecol3</attribute>\
        </entity>\
        <entity>\
            Table3\
            <attribute primary="true">t3col1</attribute>\
            <attribute mandatory="true" primary="true">t3col2</attribute>\
            <attribute unique="true" type="integer" primary="true">t3col3</attribute>\
        </entity>\
    </erd>';

generate(entityTest);
