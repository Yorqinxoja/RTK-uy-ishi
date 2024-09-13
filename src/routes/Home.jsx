import { useGetProductsQuery, useUpdateProductMutation, } from "../api/productsApi";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Card,
  Form,
  Button,
  Spin,
  Row,
  Col,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const Home = () => {
  const { data, isLoading } = useGetProductsQuery();
  const [updateProduct, { isLoading: isUpdating, isError, error }] =
    useUpdateProductMutation();
  const [updatedTitles, setUpdatedTitles] = useState({});
  const [search, setSearch] = useState("");

  const handleTitleChange = (e, productId) => {
    setUpdatedTitles({
      ...updatedTitles,
      [productId]: e.target.value,
    });
  };

  const handleUpdate = async (values, product) => {
    const newTitle = values.title || product.title;

    if (!newTitle.trim()) return;

    try {
      await updateProduct({ id: product.id, title: newTitle }).unwrap();
      setUpdatedTitles({ ...updatedTitles, [product.id]: "" });
      message.success("Product updated successfully");
    } catch (err) {
      message.error("Update failed");
    }
  };

  // Filtrlash va yarmi ko'rsatish
  const filteredProducts = data?.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // Mahsulotlar ro'yxatining faqat yarmi
  const halfProducts = filteredProducts?.slice(
    0,
    Math.ceil(filteredProducts.length / 100)
  );

  const menuItems = [
    {
      key: "1",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "2",
      label: <Link to="/login">Login</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" items={menuItems} />
      </Header>

      <Content
        className="site-layout-background"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <Input
              size="large"
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
          </div>

          {isLoading ? (
            <div className="text-center">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {halfProducts.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img alt={product.title} src={product.category.image} />
                    }
                    actions={[
                      <Form onFinish={(values) => handleUpdate(values, product)}>
                        <Form.Item
                          name="title"
                          initialValue={updatedTitles[product.id] || ""}
                        >
                          <Input
                            onChange={(e) => handleTitleChange(e, product.id)}
                            placeholder="Update title"
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Update"}
                          </Button>
                        </Form.Item>
                      </Form>,
                    ]}
                  >
                    <Card.Meta
                      title={product.title}
                      description={`$${product.price}`}
                    />
                    {isError && (
                      <p className="text-red-500 mt-2">
                        Update failed: {error.message}
                      </p>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Home;

