type ConversationType = {
	id: string;
	fullName: string;
	profilePic: string;
};

type MessageType = {
	id: string;
	body: string;
	senderId: string;
	createdAt: string;
	// TODO: Add shouldShake for animation
};
