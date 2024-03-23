"use client";

import { useState, createRef } from "react";
import { shapes } from "jointjs";
import {
  UserOutlined,
  UserAddOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
import { Layout, theme, Menu, Button } from "antd";

import JointJSCanvas from "./canvas";

const { Header, Sider, Content } = Layout;
export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const canvasRef = createRef();

  const onPress = (e) => {
    if (e.key === "entityMenuItem") {
      const rect = new shapes.standard.Rectangle({
        position: { x: 100, y: 100 },
        size: { width: 100, height: 50 },
        attrs: {
          label: {
            text: "",
          },
        },
      });
      canvasRef.current.addShape(rect);
    }
    if (e.key === "relationshipMenuItem") {
      const rhombus = new shapes.basic.Path({
        size: { width: 100, height: 100 },
        attrs: {
          path: { d: "M 50 0 L 100 50 L 50 100 L 0 50 Z" },
          label: {
            text: "",
          },
        },
      });
      canvasRef.current.addShape(rhombus);
    }
  };
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
    </Layout>
  );
}
