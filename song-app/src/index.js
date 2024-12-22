
/** @jsxImportSource @emotion/react */
import React from "react";
import ReactDOM from "react-dom/client";
import { Global, css } from "@emotion/react";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.js";
import Update from "./Update.js";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";

// Define a theme for Styled System
const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    background: "#f8f9fa",
    text: "#343a40",
    danger: "#dc3545",
    success: "#28a745",
  },
  space: [0, 4, 8, 16, 32, 64],
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Roboto Slab', serif",
  },
  fontSizes: [12, 14, 16, 18, 20, 24, 32, 48, 64],
};

// Global Styles with Emotion
const globalStyles = css`
  body {
    margin: 0;
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: ${theme.colors.primary};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    margin: 0;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/update" element={<Update />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
