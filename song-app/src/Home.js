
/** @jsxImportSource @emotion/react */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { css } from "@emotion/react";

const Home = () => {
  const handle = () => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <App className="app1" />
    );
  };

  // Emotion CSS Styles
  const containerStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  background-color:rgba(219, 224, 220, 0.48);
    font-family: "Roboto", sans-serif;
    text-align: center;
  `;

  const titleStyle = css`
    font-size: 2.5rem;
    color: #007bff;
    margin-bottom: 2rem;
    text-transform: uppercase;
  `;

  const buttonStyle = css`
    background-color:rgb(53, 133, 71);
    color: #fff;
    border: none;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #218838;
    }
  `;

  return (
    <div css={containerStyle}>
      <h1 css={titleStyle}>Welcome to Song Application Site</h1>
      <div>
        <button onClick={handle} css={buttonStyle}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
