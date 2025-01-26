/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/entities/user-entity";
import cookie from "js-cookie";

export const initialUser = new User();

export interface UserReducerAction {
  type: string;
  payload: any;
}
export const UserReducer = (_prevState: any, action: UserReducerAction) => {
  const payload = action.payload;
  switch (action.type) {
    case "RESTORE": {
      // restore the user data from the cookie store
      const userCookie = cookie.get("user");
      if (!userCookie) {
        // console.log("no user cookie found");
        cookie.set("user", JSON.stringify(initialUser));
        return initialUser;
      }
      const userObject = JSON.parse(userCookie);
      const newUser = new User(userObject);
      return newUser;
    }

    case "SET_DEFAULT": {
      // set the default user data
      const userObject = payload.userData;
      const newUser = new User(userObject);
      cookie.set("user", JSON.stringify(newUser));
      return newUser;
    }

    case "LOGIN": {
      // create a new User instance from the new user data
      const { jwt, user } = payload.userData;
      // /console.log("logging in user ===>", user);
      const newUser = new User(user);
      // localStorage.setItem("user", JSON.stringify(newUser));
      cookie.set("user", JSON.stringify(newUser));
      // localStorage.setItem("jwt", jwt);
      cookie.set("jwt", jwt);

      return newUser;
    }

    case "LOGOUT": {
      // clear the user data
      // localStorage.setItem("user", JSON.stringify(initialUser));
      // localStorage.removeItem("jwt");
      cookie.set("user", JSON.stringify(initialUser));
      cookie.remove("jwt");
      return initialUser;
    }

    default:
      return initialUser;
  }
};
