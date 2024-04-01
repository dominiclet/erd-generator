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


const relationshipTest = '\
    <erd>\
        <entity>\
            person\
            <attribute type="varchar(31)" primary="true">first_name</attribute>\
            <attribute type="varchar(31)" primary="true">last_name</attribute>\
            <attribute type="varchar(255)">address</attribute>\
        </entity>\
        <entity>\
            company\
            <attribute type="varchar(31)" primary="true">name</attribute>\
            <attribute type="varchar(255)">address</attribute>\
        </entity>\
        <relationship>\
            contract\
            <entity min-cardinality="0" max-cardinality="n">\
                person\
            </entity>\
            <entity min-cardinality="0" max-cardinality="n">\
                company\
            </entity>\
            <attribute type="date">start</attribute>\
            <attribute type="date">end</attribute>\
            <attribute type="varchar(255)">object</attribute>\
        </relationship>\
    </erd>';

generate(relationshipTest);


const relationshipTestOneToMany = '\
    <erd>\
        <entity>\
            employee\
            <attribute type="varchar(31)">name</attribute>\
            <attribute type="varchar(31)" primary="true">number</attribute>\
        </entity>\
        <entity>\
            company\
            <attribute type="varchar(31)" primary="true">name</attribute>\
            <attribute type="varchar(255)">address</attribute>\
        </entity>\
        <relationship>\
            work_for\
            <entity min-cardinality="0" max-cardinality="1">\
                employee\
            </entity>\
            <entity min-cardinality="0" max-cardinality="n">\
                company\
            </entity>\
            <attribute type="date">start</attribute>\
            <attribute type="date">end</attribute>\
        </relationship>\
    </erd>';

generate(relationshipTestOneToMany);


const facultyInformation = "\
    <erd>\
        <entity>\
            Faculty_Information\
            <attribute type='bigint' primary='true'>id</attribute>\
            <attribute type='varchar(255)'>Name</attribute>\
            <attribute type='varchar(255)'>Department</attribute>\
            <attribute type='varchar(255)'>School</attribute>\
            <attribute type='varchar(31)'>Telephone_Number</attribute>\
        </entity>\
        <entity>\
            Common_User\
            <attribute type='bigint' primary='true'>id</attribute>\
            <attribute type='varchar(255)'>User_Name</attribute>\
            <attribute type='varchar(255)'>Password</attribute>\
        </entity>\
        <entity>\
            Teacher_User\
            <attribute type='bigint' primary='true'>id</attribute>\
            <attribute type='varchar(255)'>User_Name</attribute>\
            <attribute type='varchar(255)'>Password</attribute>\
        </entity>\
        <entity>\
            Administrator\
            <attribute type='bigint' primary='true'>id</attribute>\
            <attribute type='varchar(255)'>User_Name</attribute>\
            <attribute type='varchar(255)'>Password</attribute>\
        </entity>\
        <relationship>\
            Inquiry\
            <entity max-cardinality='1'>\
                Common_User\
            </entity>\
            <entity max-cardinality='N'>\
                Faculty_Information\
            </entity>\
        </relationship>\
        <relationship>\
            Modify\
            <entity max-cardinality='1'>\
                Teacher_User\
            </entity>\
            <entity max-cardinality='N'>\
                Faculty_Information\
            </entity>\
        </relationship>\
        <relationship>\
            Service\
            <entity max-cardinality='1'>\
                Administrator\
            </entity>\
            <entity>\
                Faculty_Information\
            </entity>\
        </relationship>\
    </erd>";

    generate(facultyInformation);