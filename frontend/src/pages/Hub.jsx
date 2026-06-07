import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';
import SubscribeBar from '../components/SubscribeBar';
import VideoGrid from '../components/VideoGrid';
import VideoModal from '../components/VideoModal';
import Leaderboard from '../components/Leaderboard';
import Profile from '../components/Profile';

const API = import.meta.env.VITE_API_URL;

export default function Hub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('hub');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API}/api/videos`, { withCredentials: true })
      .then(res => setVideos(res.data))
      .catch(console.error);
  }, []);

  const handleSelectVideo = (video) => {
    const index = videos.findIndex(v => v._id === video._id);
    setSelectedIndex(index);
    setSelectedVideo(video);
  };

  return (
    <div style={{ background: '#0e0e0e', minHeight: '100vh' }}>
      <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {!user?.subscribed && <SubscribeBar />}

      {activeTab === 'hub' && (
        <>
          <VideoGrid videos={videos} onSelect={handleSelectVideo} />
          {selectedVideo && (
            <VideoModal
              video={selectedVideo}
              index={selectedIndex}
              onClose={() => setSelectedVideo(null)}
            />
          )}
        </>
      )}

      {activeTab === 'leaderboard' && <Leaderboard />}
      {activeTab === 'profile' && <Profile />}
    </div>
  );
}