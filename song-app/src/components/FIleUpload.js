

// export default FileUpload;
/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import styled from "@emotion/styled";
import { space, layout, typography, color } from "styled-system";

// Styled Components
const UploadWrapper = styled.div`
  ${space}
  ${layout}
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const Title = styled.h2`
  ${typography}
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const Subtitle = styled.h3`
  ${typography}
  font-size: 20px;
  margin-bottom: 15px;
  text-align: center;
`;

const InputGroup = styled.div`
  ${space}
  ${layout}
  margin-bottom: 15px;
  width: 100%;
  max-width: 500px;
`;

const TextInput = styled.input`
  ${space}
  ${layout}
  ${typography}
  width: 100%;
  padding: 10px;
  text-align: center;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const Actions = styled.div`
  ${layout}
  ${space}
  ${color}
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn {
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    height: 40px;
    cursor: pointer;
    font-size: 16px;
  }

  .select-btn {
    background-color: gold;
    &:hover {
      background-color: rgb(36, 132, 235);
    }
  }

  .upload-btn {
    background-color: rgb(36, 132, 235);
    &:hover {
      background-color: gold;
    }
  }

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  input[type="file"] {
    display: none;
  }
`;

const FileUpload = ({ fetchSongs }) => {
  const [file, setFile] = useState(null);
  const [songDesc, setSongDesc] = useState("");

  const handleUpload = async () => {
    if (!file) {
      message.warning("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("desc", songDesc);

    try {
      await axios.post("http://localhost:5000/api/songs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("File uploaded successfully.");
      setFile(null);
      setSongDesc("");

      if (fetchSongs) fetchSongs();
    } catch (error) {
      if (error.response) {
        message.error(`Server Error: ${error.response.data.message}`);
      } else if (error.request) {
        message.error("No response from server. Please try again later.");
      } else {
        message.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <UploadWrapper>
      <Title>Song Management List</Title>
      <Subtitle>Upload a New Song</Subtitle>
      <InputGroup>
        <TextInput
          type="text"
          placeholder="Enter song description here"
          aria-label="Song description"
          value={songDesc}
          onChange={(e) => setSongDesc(e.target.value)}
        />
        <Actions>
          <label className="select-btn btn">
            <input
              type="file"
              accept=".mp3, .wav"
              onChange={(e) => setFile(e.target.files[0])}
            />
            Add Song
          </label>
          <button
            onClick={handleUpload}
            className="btn upload-btn"
            aria-label="Upload song"
          >
            Upload
          </button>
        </Actions>
      </InputGroup>
    </UploadWrapper>
  );
};

export default FileUpload;
