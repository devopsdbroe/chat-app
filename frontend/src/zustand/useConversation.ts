import { create } from "zustand";

type ConversationType = {
	id: string;
	fullName: string;
	profilePic: string;
};

type MessageType = {
	id: string;
	body: string;
	senderId: string;
	// TODO: Add shouldShake for animation
};

interface ConversationState {
	selectedConversation: ConversationType | null;
	messages: MessageType[];
	setSelectedConversation: (conversation: ConversationType | null) => void;
	setMessages: (messages: MessageType[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
	selectedConversation: null,
	setSelectedConversation: (conversation) =>
		set({ selectedConversation: conversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
}));

export default useConversation;
