import useGetConversations from "../../hooks/useGetConversation";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();

	return (
		<div className="py-2 flex flex-col overflow-auto">
			{conversations.map((conversation) => (
				<Conversation
					key={conversation.id}
					conversation={conversation}
					emoji={getRandomEmoji()}
				/>
			))}

			{loading ? <span className="loading loading-spinner mx-auto" /> : null}
		</div>
	);
};
export default Conversations;
