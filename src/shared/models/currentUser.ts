import { createContext } from "react"
import { type User } from "."

interface UserContext {
  user: User | null,
  setUser: (user: User | null) => void,

  // isOfflineMode: boolean,
  // setIsOfflineMode: (user: boolean) => void,
}
export const CurrentUser = createContext<UserContext>({user: null, setUser: () => {}});