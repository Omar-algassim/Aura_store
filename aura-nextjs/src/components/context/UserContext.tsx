"use client";
import {
  initialUser,
  UserReducerAction,
  UserReducer,
} from "@/utils/services/user-services";
import React, { createContext, useEffect } from "react";

const UserContext = createContext(initialUser);
const UserDispatcher = createContext<React.Dispatch<UserReducerAction> | null>(
  null
);

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, dispatch] = React.useReducer(UserReducer, initialUser);

  // retrieve user data from local storage first time the component is mounted
  useEffect(() => {
    dispatch({ type: "RESTORE", payload: {} });
  }, [children]);

  return (
    <UserContext.Provider value={user}>
      <UserDispatcher.Provider value={dispatch}>
        {children}
      </UserDispatcher.Provider>
    </UserContext.Provider>
  );
}

export const useUser = () => React.useContext(UserContext);
export const useUserDispatch = () =>
  React.useContext(UserDispatcher) as React.Dispatch<UserReducerAction>;

export default UserContextProvider;
