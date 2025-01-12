import React, { useEffect, useState } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { format } from "date-fns";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return unsubscribe;
  }, []);

  // Handle message send
  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        await addDoc(collection(db, "messages"), {
          text: newMessage,
          createdAt: new Date(),
          uid: auth.currentUser.uid,
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start mb-4 ${
              msg.uid === auth.currentUser.uid ? "justify-end" : "justify-start"
            }`}
          >
            {msg.uid !== auth.currentUser.uid && (
              <img
                src={`https://ui-avatars.com/api/?name=${msg.uid}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div className="max-w-xs bg-white p-3 rounded-lg shadow-md">
              <span className="block text-sm text-gray-500 mb-1">
                {msg.uid === auth.currentUser.uid ? "You" : msg.uid}
              </span>
              <p>{msg.text}</p>
              <span className="block text-xs text-gray-400 mt-1">
                {msg.createdAt && format(msg.createdAt.toDate(), "p, MMM dd, yyyy")}
              </span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex p-4 bg-white border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-3 border rounded-lg"
          required
        />
        <button type="submit" className="ml-4 bg-blue-500 text-white p-3 rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
