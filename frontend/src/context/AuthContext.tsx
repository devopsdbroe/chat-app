import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

type AuthUserType = {
	id: string;
	fullName: string;
	email: string;
	profilePic: string;
};

const AuthContext = createContext<{
	authUser: AuthUserType | null;
	setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
	isLoading: boolean;
}>({
	authUser: null,
	setAuthUser: () => {},
	isLoading: true,
});

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Check if user is authenticated or not
	useEffect(() => {
		const fetchAuthUser = async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.message);
				}

				setAuthUser(data.error);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAuthUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				authUser,
				isLoading,
				setAuthUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
