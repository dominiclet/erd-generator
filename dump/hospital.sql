CREATE TABLE Hospital (                 
    HID bigint,                         
    HNAME varchar(255),                 
    HLOCATION varchar(255),             
    HNUMBER bigint,                     
    PRIMARY KEY (HID)                   
);                                      
                                        
CREATE TABLE Patient (                  
    PID bigint,                         
    DID bigint,                         
    PNAME varchar(255),                 
    PADDRESS varchar(255),              
    PSEX varchar(31),                   
    PRIMARY KEY (PID)                   
);                                      
    
CREATE TABLE Nurse (                    
    NID bigint,                         
    HID bigint,                         
    NNAME varchar(255),                 
    NADDRESS varchar(255),              
    SEX varchar(31),                    
    PRIMARY KEY (NID)                   
);
                                        
CREATE TABLE Record (                   
    PID bigint,                         
    DID bigint,                         
    APPOINTMENT timestamp,              
    PRIMARY KEY (PID, DID,              
    APPOINTMENT)                        
);
                                        
CREATE TABLE Treats (                   
  DID bigint,                           
  PID bigint UNIQUE,                    
  PRIMARY KEY (DID,PID),                
  FOREIGN KEY (DID)                     
  REFERENCES Doctor(DID),
  FOREIGN KEY (PID)                     
  REFERENCES Patient(PID)               
);                                      
                                        
CREATE TABLE Assigned (                 
  PID bigint,                           
  RID bigint,                           
  PRIMARY KEY (PID,RID),                
  FOREIGN KEY (PID)                     
  REFERENCES Patient(PID),
  FOREIGN KEY (RID) 
  REFERENCES Rooms(RID)
);

CREATE TABLE Doctor (
    DID bigint,
    HID bigint,
    DNAME varchar(255),
    SPECIALIZATION varchar(255),
    DSEX varchar(31),
    PRIMARY KEY (DID)
);  

CREATE TABLE Medicine name (
    CODE bigint,
    PID bigint,
    DID bigint,
    PRICE money,
    QUANTITY integer,
    PRIMARY KEY (CODE)
);
                                 
CREATE TABLE Rooms (
    RID bigint,
    PID bigint,
    NID bigint,
    RTYPE varchar(31),
    PRIMARY KEY (RID)
);
                                 
CREATE TABLE Receptionist (
    RE_ID bigint,
    HID bigint,
    RE_NAME varchar(255),
    RE_ADDRESS varchar(255),
    PRIMARY KEY (RE_ID, HID)
);
                                 
CREATE TABLE Bill (
    PID bigint,
    PRIMARY KEY (PID),
    FOREIGN KEY (PID) 
    REFERENCES Patient(PID)
);
                                 
CREATE TABLE Governs (
    NID bigint,
    RID bigint UNIQUE,
    PRIMARY KEY (NID,RID),
    FOREIGN KEY (NID)
    REFERENCES Nurse(NID),
    FOREIGN KEY (RID)
    REFERENCES Rooms(RID)
);

CREATE TABLE Has (
  HID bigint,
  DID bigint,
  NID bigint,
  RE_ID bigint,
  HID bigint,
  PRIMARY KEY (HID,DID,NID,RE_ID,HID),
  FOREIGN KEY (HID) REFERENCES Hospital(HID),
  FOREIGN KEY (DID) REFERENCES Doctor(DID),
  FOREIGN KEY (NID) REFERENCES Nurse(NID),
  FOREIGN KEY (RE_ID,HID) REFERENCES Receptionist(RE_ID,HID)
);

CREATE TABLE Maintain (
  PID bigint UNIQUE,
  DID bigint UNIQUE,
  APPOINTMENT timestamp UNIQUE,
  RE_ID bigint,
  HID bigint,
  PRIMARY KEY (PID,DID,APPOINTMENT,RE_ID,HID),
  FOREIGN KEY (PID,DID,APPOINTMENT) REFERENCES Record(PID,DID,APPOINTMENT),
  FOREIGN KEY (RE_ID,HID) REFERENCES Receptionist(RE_ID,HID)
);

