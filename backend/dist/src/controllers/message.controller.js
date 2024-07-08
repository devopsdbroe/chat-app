import prisma from "../db/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        // Check if there is an existing conversation
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                },
            },
        });
        // Create a new conversation if one does not already exist
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId],
                    },
                },
            });
        }
        // Create a new message in Prisma
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        // Add new message to conversation
        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId],
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        // Return empty array if there are no messages to show
        if (!conversation) {
            return res.status(200).json([]);
        }
        res.status(200).json(conversation.messages);
    }
    catch (error) {
        console.error("Error in getMessages: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getUsersForSidebar = async (req, res) => {
    try {
        const authUserId = req.user.id;
        // Only fetch other users
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
