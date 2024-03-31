"use client";

import { useState, createRef, useEffect } from "react";
import { shapes } from "jointjs";
import {
  UserOutlined,
  UserAddOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
import { Layout, theme, Menu, Button, Modal } from "antd";

import JointJSCanvas from "./canvas";
import { generate } from "@/sql_generator/generator";

const { Header, Sider, Content } = Layout;

export const doc = document.implementation.createDocument("", "", null);
export const erd = doc.createElement("erd");

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const canvasRef = createRef();

  const [entityCount, setEntityCount] = useState(0);
  const [sqlModalContent, setSqlModalContent] = useState("");
  const [sqlModalOpen, setSqlModalOpen] = useState(false);

  const onPress = (e) => {
    if (e.key === "entityMenuItem") {
      const rect = new shapes.standard.Rectangle({
        position: { x: 100, y: 100 },
        size: { width: 150, height: 75 },
        attrs: {
          label: {
            text: `Entity_${entityCount}`,
          },
        },
      });
      canvasRef.current.addShape(rect);
      //attach entity type property after adding
      rect.prop("custom/type", "entity");

      let entity = doc.createElement("entity");
      entity.className = `Entity_${entityCount}`;
      entity.id = `Entity_${entityCount}`;
      entity.innerHTML = `Entity_${entityCount}`;
      erd.appendChild(entity);
      console.log(new XMLSerializer().serializeToString(erd));

      setEntityCount(entityCount+1);
    };
    if (e.key === "relationshipMenuItem") {
      const rhombus = new shapes.standard.Polygon({
        size: { width: 150, height: 100 },
        attrs: {
          label: {
            text: "relationship",
          },
          body: {
            refPoints: '0,0 1,1 2,0 1,-1',
          },
        },
      });
      canvasRef.current.addShape(rhombus);
      //attach relationship type property after adding
      rhombus.prop("custom/type", "relationship");
    };
    if (e.key === "attributeMenuItem") {
      const cylinder = new shapes.standard.Cylinder({
        size: { width: 20, height: 20 },
        attrs: {
          label: {
            text: "attribute",
          },
        },
      });
      canvasRef.current.addShape(cylinder);
      //attach attribute type property after adding
      cylinder.prop("custom/type", "attribute");
    };
  };

  const exportSqlHandler = () => {
    const erdStr = new XMLSerializer().serializeToString(erd);
    const sql = generate(erdStr);
    setSqlModalContent(sql);
    setSqlModalOpen(true);
  }

  return (
    <Layout>
      <Sider trigger={null}>
        <Menu
          onClick={onPress}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "entityMenuItem",
              icon: <CodeSandboxOutlined />,
              label: "Create Entity",
            },
            {
              key: "relationshipMenuItem",
              icon: <UserOutlined />,
              label: "Create Relationship",
            },
            {
              key: "attributeMenuItem",
              icon: <UserAddOutlined />,
              label: "Create attribute",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            style={{
              marginLeft: 16,
            }}
            type="primary"
            onClick={exportSqlHandler}
          >
            Export to SQL
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            height: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <JointJSCanvas ref={canvasRef} />
        </Content>
      </Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}></Sider>
      <Modal 
        open={sqlModalOpen}
        onOk={() => setSqlModalOpen(false)}
        onCancel={() => setSqlModalOpen(false)}
      >
        <p style={{whiteSpace: "pre"}}>
          {sqlModalContent && sqlModalContent}
        </p>
      </Modal>
    </Layout>
  );
}
