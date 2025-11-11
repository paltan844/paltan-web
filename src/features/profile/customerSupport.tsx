import React, { useState, useEffect, useRef } from "react";
import * as Ionicons from "react-icons/io5";
import { useAuthStore } from "@state/authStore";
import { mmkvStorage } from "@state/storage";
import {
  getMessagesByPhoneNumber,
  sendMessageToBackend,
} from "@service/productService";
import { Fonts } from "@utils/Constants";
import CustomHeader from "@components/ui/CustomHeader";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
  phonenumber?: string;
}

const CustomerSupport: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();

  /* 🧭 Scroll to bottom whenever messages update */
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  useEffect(scrollToBottom, [messages]);

  /* 📨 Load messages */
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const userPhone = String(user?.phone || "");
        const backendMessages = await getMessagesByPhoneNumber(userPhone);
        const formattedBackendMessages = backendMessages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        }));
        const localMessages = mmkvStorage.getItem("chat_messages");
        const local = localMessages ? JSON.parse(localMessages) : [];
        const merged = [...local, ...formattedBackendMessages].reduce(
          (acc: Message[], curr: Message) => {
            if (!acc.some((m) => m.id === curr.id)) acc.push(curr);
            return acc;
          },
          []
        );
        setMessages(merged);
        mmkvStorage.setItem("chat_messages", JSON.stringify(merged));
      } catch (error) {
        console.error("❌ Failed to load messages:", error);
      }
    };

    loadMessages();
  }, []);

  /* 👋 Add first welcome message */
  useEffect(() => {
    const saved = mmkvStorage.getItem("chat_messages");
    if (!saved || JSON.parse(saved).length === 0) {
      const firstMsg: Message = {
        id: Date.now().toString(),
        text: "👋 Hello! How can we help you today?",
        sender: "support",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        phonenumber: String(user?.phone || ""),
      };
      setMessages([firstMsg]);
      mmkvStorage.setItem("chat_messages", JSON.stringify([firstMsg]));
    }
  }, []);

  /* 📨 Send message */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      phonenumber: String(user?.phone || ""),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    mmkvStorage.setItem("chat_messages", JSON.stringify(updated));
    setInput("");

    // Reset textarea height after sending
    if (inputRef.current) {
      inputRef.current.style.height = "40px";
    }

    try {
      const response = await sendMessageToBackend(newMsg);
      if (response && response.text) {
        const reply: Message = {
          id: `${Date.now()}-r`,
          text: response.text,
          sender: "support",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          phonenumber: String(user?.phone || ""),
        };
        const finalMsgs = [...updated, reply];
        setMessages(finalMsgs);
        mmkvStorage.setItem("chat_messages", JSON.stringify(finalMsgs));
      }
    } catch (e) {
      console.error("❌ Error sending message", e);
    }
  };

  /* 🧩 Adjust height only when line breaks (not on every keypress) */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "4px"; // reset before measuring
    const scrollHeight = textarea.scrollHeight;

    // Max height = approx 4 lines (100px)
    const newHeight = Math.min(scrollHeight, 100);
    textarea.style.height = `${newHeight}px`;

    setInput(textarea.value);
  };

  return (
    <div style={styles.wrapper}>
      <CustomHeader title="Customer Support 💬" />

      {/* Chat Window */}
      <div style={styles.chatContainer}>
        <div ref={listRef} style={styles.messageList}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.messageBubble,
                ...(msg.sender === "user"
                  ? styles.userBubble
                  : styles.supportBubble),
              }}
            >
              <p style={styles.messageText}>{msg.text}</p>
              <span style={styles.timestamp}>{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            placeholder="Type a message..."
            style={styles.input}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              ...styles.sendButton,
              opacity: input.trim() ? 1 : 0.6,
              cursor: input.trim() ? "pointer" : "not-allowed",
            }}
          >
            <Ionicons.IoPaperPlane size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------- STYLES ---------------------------- */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #e0f7fa, #80deea, #00acc1)",
    overflow: "hidden",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    maxWidth: 600,
    margin: "0 auto",
    width: "89%",
    background: "rgba(255,255,255,0.3)",
    borderRadius: 16,
    backdropFilter: "blur(14px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 5px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    scrollbarWidth: "thin",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "7px 10px",
    borderRadius: 14,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    whiteSpace: "pre-line",
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
    color: "white",
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#333",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    margin: 1,
    fontSize: 15,
    lineHeight: 1,
    fontFamily: Fonts.Regular,
  },
  timestamp: {
    display: "block",
    marginTop: 6,
    fontSize: 11,
    opacity: 0.6,
    textAlign: "right",
  },
  inputArea: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: "5px 7px",
    borderRadius: 50,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
   // marginTop: 16,
  },
  input: {
    flex: 1,
    border: "none",
    borderRadius: 20,
    padding: "1px 1px",
    fontSize: 15,
    outline: "none",
    fontFamily: Fonts.Regular,
    backgroundColor: "transparent",
    color: "#222",
    resize: "none",
    overflowY: "auto",
    maxHeight: "100px", // prevent infinite growth
  },
  sendButton: {
    border: "none",
    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
    borderRadius: "50%",
    padding: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
};

export default CustomerSupport;
