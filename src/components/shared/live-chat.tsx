import EmojiPicker, {
  Theme,
  EmojiClickData,
  EmojiStyle,
} from "emoji-picker-react";
import { Separator } from "../ui/separator";
import { Smile, SendHorizonal } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";
import useToast from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { chatActions } from "@/store/redux/actions";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { getAccessToken } from "@/utils/axios";
import { useInView } from "react-intersection-observer";
import { getUserRandomAvatar } from "@/utils/utils";

export type HistoryItemProps = {
  name: string;
  time: string;
  message: string;
  avatar: string;
};

const HistoryItem = ({ name, message, avatar, time }: HistoryItemProps) => {
  return (
    <div className="flex items-center gap-1 px-3 py-1">
      <div className="relative"></div>
      <div className="flex flex-1 flex-row justify-start gap-3 rounded-lg px-2 py-1">
        <img
          src={avatar || "/assets/avatar.png"}
          alt="avatar"
          className="h-8 w-8 border border-black shadow-card-shadow"
        />
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-1">
            <span className="font-primary text-sm font-medium text-black">
              {name ?? "user"}
            </span>
            <span className="text-gray500 text-xs font-medium">{time}</span>
          </div>
          <p className="max-w-[234px] overflow-hidden text-ellipsis font-secondary text-[13px] font-medium text-black">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

const LiveChat = () => {
  const [inputStr, setInputStr] = useState("");
  const [emojiIsOpened, setEmojiIsOpened] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const userData = useAppSelector((store: any) => store.user.userData);
  const { ref: lastMessageRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });
  const toast = useToast();
  const chatState = useAppSelector((state: any) => state.chat);
  const firstChatSentAt =
    chatState?.chatHistory?.length > 0 ? chatState.chatHistory[0].sentAt : null;
  const dispatch = useAppDispatch();
  const toggleIsOpened = (isOpened: boolean) => {
    setEmojiIsOpened(!isOpened);
  };
  const [getMoreChat, setGetMoreChat] = useState(false);

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setInputStr((prevInput) => prevInput + emojiObject.emoji);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const sendMessage = () => {
    if (!inputStr) return;
    if (userData.username === "") {
      toast.error("Please login to chat");
      return;
    }

    const message = inputStr;
    try {
      dispatch(chatActions.sendMsg(message));
      setInputStr("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(chatActions.loginChatServer());
  }, [getAccessToken()]);

  useEffect(() => {
    dispatch(chatActions.subscribeChatServer());
  }, []);

  useEffect(() => {
    if (getMoreChat) {
      setGetMoreChat(false);
    } else {
      if (
        chatState?.chatHistory &&
        Array.isArray(chatState?.chatHistory) &&
        chatState?.chatHistory.length > 0
      ) {
        setTimeout(() => {
          ref.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 200);
      }
    }
  }, [chatState?.chatHistory]);

  useEffect(() => {
    if (inView) {
      dispatch(chatActions.getChatHistory(firstChatSentAt));
      setGetMoreChat(true);
    }
  }, [inView]);

  return (
    <div className="flex h-[calc(100vh-74px)] max-h-full w-[278px] flex-col items-stretch gap-0 border border-x-black bg-white">
      <div className="flex items-center justify-between gap-3 p-3">
        <span className="font-secondary text-base text-black">Live Chat</span>
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 bg-[#FF868E]"
            style={{
              transform: "scale(1)",
              animation:
                "2s ease 0s infinite normal none running animation-bubble",
            }}
          />
          {/* <span className="font-secondary text-sm text-[#FF868E]">1</span> */}
        </div>
      </div>
      <Separator className="bg-black" />
      <div className="flex flex-1 flex-col items-stretch gap-4">
        <ScrollArea
          className={`py-3 ${emojiIsOpened ? " max-h-[calc(80vh-300px)]" : " max-h-[calc(80vh)]"}`}
        >
          <div className="flex w-full flex-col">
            <div ref={lastMessageRef}></div>
            {chatState?.chatHistory &&
              Array.isArray(chatState?.chatHistory) &&
              chatState?.chatHistory?.map((chat, key) => (
                <React.Fragment key={key}>
                  <HistoryItem
                    name={chat.user?.username}
                    avatar={getUserRandomAvatar(chat.user?.username)}
                    time={formatTime(chat.sentAt.toString())}
                    message={chat.message}
                  />
                  <div ref={ref}></div>
                </React.Fragment>
              ))}
          </div>
        </ScrollArea>
      </div>
      <div className="w-full border-t border-black bg-white px-2 text-gray-400">
        <div className="flex h-full flex-col">
          <div className="flex h-full w-full items-center gap-2">
            <Smile
              className={`cursor-pointer ${emojiIsOpened ? "text-yellow" : ""}`}
              onClick={() => {
                toggleIsOpened(emojiIsOpened);
              }}
            />
            <Input
              className="!focus:ring-0 !focus:ring-offset-0 !focus:ring w-full resize-none overflow-hidden rounded-none !border-none !bg-transparent p-0 text-black !outline-none !ring-0 !ring-offset-0"
              value={inputStr}
              onChange={(e) => {
                setInputStr(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  sendMessage();
                  e.preventDefault();
                }
              }}
            />
            <SendHorizonal
              className="hover: cursor-pointer text-blue2"
              onClick={sendMessage}
            />
          </div>
          <div className="flex w-full items-center">
            <EmojiPicker
              height={"300px"}
              width={"100%"}
              theme={Theme.LIGHT}
              emojiStyle={EmojiStyle.GOOGLE}
              previewConfig={{
                defaultEmoji: "",
                defaultCaption: "",
                showPreview: false,
              }}
              skinTonesDisabled={true}
              open={emojiIsOpened}
              onEmojiClick={onEmojiClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
