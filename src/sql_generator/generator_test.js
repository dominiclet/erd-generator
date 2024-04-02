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


    const hospitalSystem = "\
        <erd>\
            <entity>\
                Hospital\
                <attribute type='bigint' primary='true'>HID</attribute>\
                <attribute type='varchar(255)'>HNAME</attribute>\
                <attribute type='varchar(255)'>HLOCATION</attribute>\
                <attribute type='bigint'>HNUMBER</attribute>\
            </entity>\
            <entity>\
                Doctor\
                <attribute type='bigint' primary='true'>DID</attribute>\
                <attribute type='bigint'>HID</attribute>\
                <attribute type='varchar(255)'>DNAME</attribute>\
                <attribute type='varchar(255)'>SPECIALIZATION</attribute>\
                <attribute type='varchar(31)'>DSEX</attribute>\
            </entity>\
            <entity>\
                Patient\
                <attribute type='bigint' primary='true'>PID</attribute>\
                <attribute type='bigint'>DID</attribute>\
                <attribute type='varchar(255)'>PNAME</attribute>\
                <attribute type='varchar(255)'>PADDRESS</attribute>\
                <attribute type='varchar(31)'>PSEX</attribute>\
            </entity>\
            <entity>\
                Medicine name\
                <attribute type='bigint' primary='true'>CODE</attribute>\
                <attribute type='bigint'>PID</attribute>\
                <attribute type='bigint'>DID</attribute>\
                <attribute type='money'>PRICE</attribute>\
                <attribute type='integer'>QUANTITY</attribute>\
            </entity>\
            <entity>\
                Nurse\
                <attribute type='bigint' primary='true'>NID</attribute>\
                <attribute type='bigint'>HID</attribute>\
                <attribute type='varchar(255)'>NNAME</attribute>\
                <attribute type='varchar(255)'>NADDRESS</attribute>\
                <attribute type='varchar(31)'>SEX</attribute>\
            </entity>\
            <entity>\
                Rooms\
                <attribute type='bigint' primary='true'>RID</attribute>\
                <attribute type='bigint'>PID</attribute>\
                <attribute type='bigint'>NID</attribute>\
                <attribute type='varchar(31)'>RTYPE</attribute>\
            </entity>\
            <entity>\
                Record\
                <attribute type='bigint' primary='true'>PID</attribute>\
                <attribute type='bigint' primary='true'>DID</attribute>\
                <attribute type='timestamp' primary='true'>APPOINTMENT</attribute>\
            </entity>\
            <entity>\
                Receptionist\
                <attribute type='bigint' primary='true'>RE_ID</attribute>\
                <attribute type='bigint' primary='true'>HID</attribute>\
                <attribute type='varchar(255)'>RE_NAME</attribute>\
                <attribute type='varchar(255)'>RE_ADDRESS</attribute>\
            </entity>\
            <relationship>\
                Treats\
                <entity max-cardinality='1'>\
                    Patient\
                </entity>\
                <entity max-cardinality='N'>\
                    Doctor\
                </entity>\
            </relationship>\
            <relationship>\
                Bill\
                <entity>\
                    Medicine Name\
                </entity>\
                <entity max-cardinality='N'>\
                    Patient\
                </entity>\
            </relationship>\
            <relationship>\
                Assigned\
                <entity>\
                    Patient\
                </entity>\
                <entity>\
                    Rooms\
                </entity>\
            </relationship>\
            <relationship>\
                Governs\
                <entity max-cardinality='N'>\
                    Nurse\
                </entity>\
                <entity max-cardinality='1'>\
                    Rooms\
                </entity>\
            </relationship>\
            <relationship>\
                Has\
                <entity max-cardinality='M'>\
                    Hospital\
                </entity>\
                <entity max-cardinality='M'>\
                    Doctor\
                </entity>\
                <entity max-cardinality='M'>\
                    Nurse\
                </entity>\
                <entity max-cardinality='M'>\
                    Receptionist\
                </entity>\
            </relationship>\
            <relationship>\
                Maintain\
                <entity max-cardinality='N'>\
                    Receptionist\
                </entity>\
                <entity max-cardinality='1'>\
                    Record\
                </entity>\
            </relationship>\
        </erd>\
    ";

    generate(hospitalSystem);