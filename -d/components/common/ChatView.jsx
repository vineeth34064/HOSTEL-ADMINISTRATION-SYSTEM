import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as api from "../../services/api";
import { SearchIcon, MessageSquareIcon } from "../Icons";

const ChatView = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadRecentChats();
    loadAllUsers();
  }, []);
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
      const interval = setInterval(() => loadMessages(selectedUser.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadRecentChats = async () => {
    try {
      setRecentChats(await api.getRecentChats());
    } catch {}
  };
  const loadAllUsers = async () => {
    try {
      setAllUsers(await api.searchUsers(""));
    } catch {}
  };
  const loadMessages = async (id) => {
    try {
      setMessages(await api.getChatMessages(id));
    } catch {}
  };
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 1) {
      setIsSearching(true);
      try {
        setSearchResults(await api.searchUsers(q));
      } catch {
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    await api.sendChatMessage(selectedUser.id, newMessage);
    setNewMessage("");
    loadMessages(selectedUser.id);
    if (!recentChats.find((c) => c.id === selectedUser.id)) loadRecentChats();
  };

  const UserRow = ({ u, active }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0.625rem 0.875rem",
        borderRadius: 10,
        cursor: "pointer",
        transition: "background 0.12s",
        background: active ? "var(--gold-bg)" : "transparent",
        borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "var(--bg3)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          flexShrink: 0,
          background: active ? "var(--gold)" : "var(--bg3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 800,
          color: active ? "#fff" : "var(--text)",
        }}
      >
        {u.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: active ? "var(--gold)" : "var(--text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {u.name}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginTop: 1,
          }}
        >
          {u.role}
          {u.rollNumber ? ` · ${u.rollNumber}` : ""}
        </div>
      </div>
      {u.unreadCount > 0 && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--accent)",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );

  const sidebarLabel = (text) => (
    <div
      style={{
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--muted)",
        padding: "0.5rem 0.875rem 0.25rem",
      }}
    >
      {text}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
      }}
    >
      {/* Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--gold), var(--gold-l))",
          borderRadius: 20,
          padding: "1.25rem 1.75rem",
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MessageSquareIcon style={{ width: 22, height: 22, color: "#fff" }} />
        </div>
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Messaging Center
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
              marginTop: 2,
            }}
          >
            Secure encrypted channel
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: -30,
            top: -30,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 260,
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg2)",
            flexShrink: 0,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem 1rem 0.75rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text)",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Messages
              </div>
              <button
                onClick={() => setShowDiscover(!showDiscover)}
                className="hms-btn hms-btn-sm"
                style={{
                  background: showDiscover ? "var(--gold)" : "var(--bg3)",
                  color: showDiscover ? "#fff" : "var(--muted)",
                  border: "none",
                  fontSize: 10,
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                {showDiscover ? "Back" : "Discover"}
              </button>
            </div>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <SearchIcon
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 14,
                  height: 14,
                  color: "var(--muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search people…"
                className="hms-input"
                style={{ paddingLeft: 32, fontSize: 12 }}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* List */}
          <div
            className="custom-scrollbar"
            style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.25rem" }}
          >
            <AnimatePresence mode="wait">
              {searchQuery.trim().length >= 1 ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {sidebarLabel("Search Results")}
                  {searchResults.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u);
                        setSearchQuery("");
                        setShowDiscover(false);
                      }}
                    >
                      <UserRow u={u} active={selectedUser?.id === u.id} />
                    </div>
                  ))}
                  {searchResults.length === 0 && !isSearching && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        fontSize: 12,
                        color: "var(--muted)",
                      }}
                    >
                      No matches found
                    </div>
                  )}
                </motion.div>
              ) : showDiscover ? (
                <motion.div
                  key="discover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {sidebarLabel("Discover Teammates")}
                  {allUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u);
                        setShowDiscover(false);
                      }}
                    >
                      <UserRow u={u} active={selectedUser?.id === u.id} />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="recent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {sidebarLabel("Recent Activity")}
                  {recentChats.map((u) => (
                    <div key={u.id} onClick={() => setSelectedUser(u)}>
                      <UserRow u={u} active={selectedUser?.id === u.id} />
                    </div>
                  ))}
                  {recentChats.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        fontSize: 12,
                        color: "var(--muted)",
                      }}
                    >
                      No recent activity
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "var(--bg)",
            minWidth: 0,
          }}
        >
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "var(--bg2)",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background:
                      "linear-gradient(135deg, var(--gold), var(--gold-l))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {selectedUser.name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {selectedUser.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 2,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "var(--green)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--green)",
                      }}
                    >
                      Active Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                className="custom-scrollbar"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1.5rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                <AnimatePresence>
                  {messages.map((m, idx) => {
                    const isMine = m.sender === user.id;
                    return (
                      <motion.div
                        key={m.id || idx}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        style={{
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "72%",
                            padding: "0.75rem 1rem",
                            fontSize: 13,
                            lineHeight: 1.6,
                            borderRadius: isMine
                              ? "18px 18px 4px 18px"
                              : "18px 18px 18px 4px",
                            background: isMine
                              ? "linear-gradient(135deg, var(--gold), var(--gold-l))"
                              : "var(--bg2)",
                            color: isMine ? "#fff" : "var(--text)",
                            border: isMine ? "none" : "1px solid var(--border)",
                            boxShadow: isMine
                              ? "0 4px 14px rgba(184,149,46,0.25)"
                              : "none",
                          }}
                        >
                          {m.content}
                          <div
                            style={{
                              fontSize: 10,
                              marginTop: 4,
                              opacity: 0.7,
                              color: isMine
                                ? "rgba(255,255,255,0.8)"
                                : "var(--muted)",
                            }}
                          >
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                style={{
                  padding: "0.875rem 1.25rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "6px 6px 6px 12px",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <input
                    type="text"
                    placeholder="Type a message…"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontSize: 13,
                      color: "var(--text)",
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: newMessage.trim()
                        ? "linear-gradient(135deg, var(--gold), var(--gold-l))"
                        : "var(--bg3)",
                      border: "none",
                      cursor: newMessage.trim() ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.15s, opacity 0.15s",
                      opacity: newMessage.trim() ? 1 : 0.5,
                    }}
                  >
                    <svg
                      style={{
                        width: 16,
                        height: 16,
                        transform: "rotate(90deg)",
                        fill: "#fff",
                      }}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 24,
                  background: "var(--gold-bg)",
                  border: "1px solid rgba(184,149,46,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageSquareIcon
                  style={{ width: 40, height: 40, color: "var(--gold)" }}
                />
              </motion.div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: 6,
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  Your Inbox
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--muted)", maxWidth: 200 }}
                >
                  Select a contact to start chatting
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatView;
