// ChatPage.jsx
import React from 'react'
import { useState } from 'react';
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { getStreamToken } from '../lib/api.js';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import TranslatedMessage from './TranslatedMessage.jsx' // Make sure the path is correct
import CallButton from '../components/CallButton.jsx';
import { StreamChat } from "stream-chat";
import ChatLoader from '../components/ChatLoader.jsx';

const ChatPage = () => {
    const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
    const LIBRE_TRANSLATE_API_URL = import.meta.env.VITE_LIBRE_TRANSLATE_API_URL;

    const { id: targetUserId } = useParams();
    const [preferredLang, setPreferredLang] = useState(() => {
        return localStorage.getItem("preferredLang") || "en";
    });

    const languages = [
        { code: "en", label: "English" },
        { code: "hi", label: "Hindi" },
        { code: "fr", label: "French" },
        { code: "es", label: "Spanish" },
        // Add more languages supported by your LibreTranslate instance
    ];

    const [chatClient, setChatClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [channel, setChannel] = useState(null);
    const { authUser } = useAuthUser();

    const { data: tokenData } = useQuery({
        queryKey: ['streamToken'],
        queryFn: getStreamToken,
        enabled: Boolean(authUser),
    });

    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser) {
                console.log(tokenData.token);
                return;
            }
            try {
                console.log("Initializing chat client with token:", tokenData.token);
                const client = StreamChat.getInstance(STREAM_API_KEY);

                await client.connectUser(
                    {
                        id: authUser._id,
                        name: authUser.name,
                        image: authUser.profilePicture,
                    },
                    tokenData.token
                );
                const channelId = [authUser._id, targetUserId].sort().join("-");
                const currChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserId],
                });
                await currChannel.watch();
                setChatClient(client);
                setChannel(currChannel);
            } catch (error) {
                toast.error("Error initializing chat client: " + error.message);
                console.error("Error initializing chat client:", error);
            } finally {
                setLoading(false);
            }
        };
        initChat();
    }, [tokenData, authUser, targetUserId, STREAM_API_KEY]);

    if (loading || !chatClient || !channel) {
        return <ChatLoader />;
    }

    const handleVideoCall = () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;

            channel.sendMessage({
                text: `I've started a video call. Join me here: ${callUrl}`,
            });

            toast.success("Video call link sent successfully!");
        }
    };

    const handleLangChange = (e) => {
        const selectedLang = e.target.value;
        setPreferredLang(selectedLang);
        localStorage.setItem("preferredLang", selectedLang);
    };

    return (
        <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
    );
};

export default ChatPage;