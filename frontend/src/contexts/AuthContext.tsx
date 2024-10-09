import { useContext, createContext, useState, ReactNode } from "react";

export type UserData = {
    username: string;
    token: string;
};

interface IAuthContext {
    user?: UserData,
    setUser: (newState: UserData) => void;
};

const initialState = {
    user: undefined,
    setUser: () => {} 
}

const AuthContext = createContext<IAuthContext>(initialState);

type Props = {
    children?: ReactNode
}

const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserData | undefined>(initialState.user);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;
export const useAuth = () => {
    return useContext(AuthContext);
}