import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { getStreamToken } from '../lib/api';
import { StreamChat } from 'stream-chat';
import { useQuery } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser';
import PageLoader from '../components/PageLoader';
import { Chat, MessageList, MessageInput, ChannelHeader, Window, Channel } from 'stream-chat-react';
import CallButton from '../components/CallButton';

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const { authUser } = useAuthUser();
  const { data: streamToken } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  useEffect(() => {
    const initChat = async () => {
      if (!authUser || !streamToken?.token) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }, streamToken.token);

        const channelId = [authUser._id, id].sort().join("_");

        const channel = client.channel("messaging", channelId, {
          name: `${authUser.fullName} - ${id}`,
          members: [authUser._id, id],
        });

        await channel.watch();

        setChannel(channel);
        setChatClient(client);
        setIsConnected(true);
        setIsDisconnected(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initChat();
  }, [streamToken, authUser, id])
  if (isLoading || !chatClient || !channel) return <PageLoader />;

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text:"Join here "+callUrl
      })
      navigate(`/call/${channel.id}`);
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <Chat client={chatClient} >
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
