import React, { useEffect, useState } from "react";
import { useSignInUserMutation } from "../api/authApi";
import { useDispatch } from "react-redux";
import { signIn } from "../slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { FaEnvelope, FaLock } from "react-icons/fa";

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInUserWithApi, { data, isSuccess, isError, error }] =
    useSignInUserMutation();

  const userData = { email, password };

  const handleSubmit = async () => {
    try {
      await signInUserWithApi(userData).unwrap();
    } catch (err) {
      message.error("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(signIn(data));
      message.success("Login successful!");
      navigate("/");
    }

    if (isError) {
      message.error(error?.data?.message || "Something went wrong!");
    }
  }, [isSuccess, isError, data, error, dispatch, navigate]);

  return (
    <div>
      <div>
        <Link to="/">
          <Title level={3}>Our Products</Title>
        </Link>
        <Form layout="vertical" onFinish={handleSubmit} className="space-y-6">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<FaEnvelope className="text-gray-400" />}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<FaLock className="text-gray-400" />}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
