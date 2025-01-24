/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/entities/user-entity";
import cookie from "js-cookie";

export const initialUser = new User();

export interface UserReducerAction {
  type: string;
  payload: any;
}
export const UserReducer = (_prevState: any, action: UserReducerAction) => {
  const cookieStore = cookie;
  const payload = action.payload;
  switch (action.type) {
    case "RESTORE": {
      // restore the user data from the cookie store
      const userCookie = cookieStore.get("user");
      if (!userCookie) {
        // /console.log("no user cookie found");
        cookieStore.set("user", JSON.stringify(initialUser));
        return initialUser;
      }
      const userObject = JSON.parse(userCookie);
      // /console.log("restoring user", userObject);
      const newUser = new User(
        userObject.documentId,
        userObject.username,
        userObject.email,
        userObject.phone_number,
        userObject.location
      );
      return newUser;
    }

    case "SET_DEFAULT": {
      // set the default user data
      const userObject = payload.userData;
      const newUser = new User(
        userObject.documentId,
        userObject.username,
        userObject.email,
        userObject.phone_number,
        userObject.location
      );
      cookieStore.set("user", JSON.stringify(newUser));
      return newUser;
    }

    case "LOGIN": {
      // create a new User instance from the new user data
      const { jwt, user } = payload.userData;
      // /console.log("logging in user ===>", user);
      const newUser = new User(
        user.documentId,
        user.username,
        user.email,
        user.phone_number,
        user.location
      );
      // localStorage.setItem("user", JSON.stringify(newUser));
      cookieStore.set("user", JSON.stringify(newUser));
      // localStorage.setItem("jwt", jwt);
      cookieStore.set("jwt", jwt);

      return newUser;
    }

    case "LOGOUT": {
      // clear the user data
      // localStorage.setItem("user", JSON.stringify(initialUser));
      // localStorage.removeItem("jwt");
      cookieStore.set("user", JSON.stringify(initialUser));
      cookieStore.remove("jwt");
      return initialUser;
    }

    default:
      return initialUser;
  }
};
