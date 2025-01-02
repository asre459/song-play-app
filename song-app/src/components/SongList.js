
/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSongsRequest, deleteSong } from "../redux/songSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Button, message } from "antd";
import axios from "axios";
import FileUpload from "./FIleUpload.js";
import Update from "../Update.js";
import { FaHeart } from "react-icons/fa";
import { MdDeleteForever} from "react-icons/md";
import styled from "@emotion/styled";
import { space, color, layout, typography } from "styled-system";

const { confirm } = Modal;

const SongListWrapper = styled.div`
  ${space}
  ${color}
  ${layout}
  ${typography}
  width: 100%;
  height: 100vh;
  background-color:rgba(0, 54, 179, 0.37);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
 
  .btn{
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;
    padding: 5px 5px;
  }
   .delete-btn{
    background-color: rgb(255, 10, 10);
    color: white;
    &:hover{
      background-color: rgb(204, 37, 28);
    }
  }

  .edit-btn{
    background-color: rgb(36, 132, 235);
     &:hover {
        background-color:rgb(32, 109, 191);
      }
  }
  .favorites-btn{
      background-color: hsl(236, 92.00%, 51.20%);
      cursor: pointer;
       display: flex;
       align-items: center;
       margin-bottom: 20px;
      justify-content: center;
       &:hover {
        background-color:rgba(223, 216, 9, 0.82);
      }
  }
  .loading, .error{
    color: red;
    fontSize: 30px;
  }
`;

const SongContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(237, 233, 225, 0.1);
  padding: 20px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(224, 158, 35, 0.1);
  margin-bottom: 20px;
`;

const AudioPlayer = styled.audio`
  width: 100%;
  max-width: 500px;
  margin-bottom: 10px;
  `;


const ActionButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 30px;
  background-color: rgba(181, 171, 245, 0.83);
  color:rgba(247, 169, 208, 0.87);
`;

const FavoriteButton = styled(FaHeart)`
  color: ${({ isFavorite }) => (isFavorite ? "red" : "white")};
  cursor: pointer;
  font-size: 30px;
  &:hover{
    color: ${({ isFavorite }) => (!isFavorite ? "gold" : "darked")};
  }
`;

const SongList = () => {
  const [songLists, setSongLists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const [prevDisable, setPrevDisable] = useState(true);
  const [nextDisable, setNextDisable] = useState(false);
  const { loading, error } = useSelector((state) => state.songs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSongsRequest());
    fetchSongs();  
      fetchFavorites();
  }, [dispatch]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/songs");
      setSongLists(
        response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
      console.log( "the recent song list store at the top of the list")
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };
  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/songs/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  const handleDelete = (songId) => {
    const song = songLists.find((song) => song.id === songId);

    confirm({
      title: `Are you sure you want to delete "${song.title}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/songs/${songId}`);
          dispatch(deleteSong(songId));
          message.success("File deleted successfully.");
          fetchSongs();
        } catch (error) {
          console.error("Error deleting song:", error);
          message.error(`Error deleting file: ${error.message}`);
        }
      },
    });
  };

  const handleNext = (id) => {
    setPrevDisable(false);
    if(id === 1){
      message.warning("This is Last Song!!!");
      setNextDisable(true);
    }else{
      setNextDisable(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % songLists.length);
    }
  };

  const handlePrevious = (id) => {
    setNextDisable(false);
    if(id === songLists.length){
        message.warning("No Previous Song!!!");
        setPrevDisable(true);
    }else{
      setPrevDisable(false);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + songLists.length) % songLists.length);
    }
  };

  const handleEdit = (song) => {
    setSelectedSong(song);
    setIsUpdating(true);
  };

  const handleUpdateComplete = () => {
    setIsUpdating(false);
    setSelectedSong(null);
    fetchSongs();
  };

  const handleAddToFavorites = async (song) => {
    try {
      const isFavorite = favorites.some((fav) => fav.id === song.id);
  
      if (isFavorite) {
        const favorite = favorites.find((fav) => fav.id=== song.id);
        console.log('Removing favorite:', favorite);
        await axios.delete(`http://localhost:5000/api/songs/favorites/${favorite.id}`);
        message.success(`Removed "${song.title}" from favorites.`);
      } else {
        console.log('Adding to favorites:', song);
        await axios.post("http://localhost:5000/api/songs/favorites", { title: song.title });
        message.success(`Added "${song.title}" to favorites.`);
      }
  
      fetchFavorites(); // Refresh favorites list
    } catch (error) {
      console.error("Error managing favorites:", error);
      message.error("An error occurred while updating favorites.");
    }
  };
  
   const handleShowFavorites = () => {
    setIsFavoritesModalVisible(true);
  };

  const handleCloseFavorites = () => {
    setIsFavoritesModalVisible(false);
  };

  const currentSong = songLists[currentIndex];

  return (
    <SongListWrapper>
      {isUpdating ? (
        <Update song={selectedSong} onUpdateComplete={handleUpdateComplete} />
      ) : (
        <div>
          <FileUpload fetchSongs={fetchSongs} />
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">Error: {error}</div>}
          {(songLists.length > 0 && !error) ? (
            <div>
              <h3>Uploaded Songs</h3>
              {currentSong && (
                <SongContainer key={currentSong.id}>
                  <AudioPlayer controls>
                    <source
                      src={`http://localhost:5000/api/songs/files/${currentSong.title}`}
                      type="audio/mpeg"
                    />
                  </AudioPlayer>
                  <p>{currentSong.desc}</p>
                  <p>
                    {currentSong.title} (Updated:{" "}
                    {new Date(currentSong.updatedAt).toLocaleString()} )
                  </p>
                  <ActionButtonsWrapper>
                    <MdDeleteForever
                      onClick={() => handleDelete(currentSong.id)}
                      className="btn delete-btn"
                    />
                    <FavoriteButton
                      isFavorite={favorites.some((fav) => fav.id === currentSong.id)}
                      onClick={() => handleAddToFavorites(currentSong)}
                    />
                    <button className="btn edit-btn"
                      onClick={() => handleEdit(currentSong)}>
                      Edit
                  </button>
                  </ActionButtonsWrapper>
                  {songLists.length > 1 && (
                    <NavigationButtons>
                      <Button onClick={()=>handlePrevious(currentSong.id)} className="prev" style={{backgroundColor: {prevDisable} && 'gold'}} disabled={prevDisable}>
                        {"<"}
                      </Button>
                      <Button onClick={()=>handleNext(currentSong.id)} className="next" style={{backgroundColor: {nextDisable} && 'gold'}} disabled={nextDisable}>
                        {">"}
                      </Button>
                    </NavigationButtons>
                  )}
                </SongContainer>
              )}
              <button onClick={handleShowFavorites} className="btn favorites-btn">
                View Favorites
              </button>
            </div>
          ) : (
            <p>No songs available.</p>
          )}
        </div>
      )}

      <Modal
        title="Favorite Songs"
        visible={isFavoritesModalVisible}
        onCancel={handleCloseFavorites}
        footer={[
          <Button key="close" onClick={handleCloseFavorites}>
            Close
          </Button>,
        ]}
      >
        {favorites.length > 0 ? (
          <div>
            {favorites.map((fav) => (
              <div key={fav.id} className="favorite-song">
                <AudioPlayer controls>
                  <source
                    src={`http://localhost:5000/api/songs/files/${fav.title}`}
                    type="audio/mpeg"
                  />
                </AudioPlayer>
                <p>{fav.title} - {fav.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorite songs yet.</p>
        )}
      </Modal>
    </SongListWrapper>
  );
};

export default SongList;