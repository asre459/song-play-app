

/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Modal, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import styled from "@emotion/styled";
import { space, layout, typography, color } from "styled-system";

const { confirm } = Modal;

const UpdateWrapper = styled.div`
  ${space}
  ${layout}
  ${typography}
  ${color}
  padding: 20px;
  width: 100vw;
  height: 100vh;
  background-color:rgb(58, 184, 79);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
`;

const AudioPlayerWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  width: 400px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 400px;
  outline: none;
  ${space}
  ${layout}
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  max-width: 40vw
`;

const StyledButton = styled(Button)`
  width: 45%;
  font-size: 16px;
  border-radius: 10px
`;

const Update = ({ song, onUpdateComplete }) => {
  const [newTitle, setNewTitle] = useState(song?.title || "");
  const [newDesc, setNewDesc] = useState(song?.desc || "");

  useEffect(() => {
    setNewTitle(song?.title || "");
    setNewDesc(song?.desc || "");
  }, [song]);

  const handleUpdate = () => {
    if (!newTitle.trim() || !newDesc.trim()) {
      message.error("Both title and description are required.");
      return;
    }

    confirm({
      title: `Are you sure you want to update "${song.title}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, update",
      okType: "primary",
      cancelText: "Cancel",
      onOk: async () => {
        const formData = new FormData();
        formData.append("title", newTitle);
        formData.append("desc", newDesc);

        try {
          await axios.put(`http://localhost:5000/api/songs/${song.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          message.success("Song updated successfully.");
          onUpdateComplete(); // Notify parent component of update completion
        } catch (error) {
          console.error("Error updating song:", error);
          message.error(`Error updating song: ${error.message}`);
        }
      },
    });
  };

  return (
    <UpdateWrapper>
      <h2>Update Song</h2>

      <AudioPlayerWrapper>
        <audio controls>
          <source
            src={`http://localhost:5000/api/songs/files/${song.title}`}
            type="audio/mpeg"
          />
          Your browser does not support the audio element.
        </audio>
      </AudioPlayerWrapper>

      <FormGroup>
        <Label htmlFor="title">Title:</Label>
        <Input
          type="text"
          id="title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New Title"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="desc">Description:</Label>
        <Input
          type="text"
          id="desc"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="New Description"
        />
      </FormGroup>

      <ButtonGroup>
        <StyledButton onClick={handleUpdate} type="primary">
          Update
        </StyledButton>
        <StyledButton onClick={onUpdateComplete} type="default">
          Cancel
        </StyledButton>
      </ButtonGroup>
    </UpdateWrapper>
  );
};

export default Update;
