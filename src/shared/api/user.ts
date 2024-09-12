import { redirect } from "react-router-dom";
import { GET, POST, PUT } from ".";
import { CurrentUser, UpdateUser, User } from "../models";
import { throwAnyErrors } from "../utils";

export async function getUserDataByName(username: string) {
  return await throwAnyErrors(GET("/profiles/{username}", {
    params: {
      path: { username }
    }
  }));
}
export async function getUserFavouriteArticles(username: string) {
  const result = await GET("/articles", {
    params: {
      query: { favorited: username }
    }
  });
  return result.data;
}
export async function getUserCreatedArticles(username: string) {
  return await throwAnyErrors(GET("/articles", {
    params: {
      query: { author: username }
    }
  }));
}

export async function followUser(username: string) {
  return await throwAnyErrors(POST("/profiles/{username}/follow", {
    params: {
      path: { username }
    }
  }));
}
export async function updateUser(userData: UpdateUser, currentUser: User) {
  return await throwAnyErrors(PUT("/user", {
    body: { user: userData },
    headers: {
      "Authorization": currentUser.token !== undefined ? `Token ${currentUser.token}` : undefined
    }
  }));
}

export async function requireUser() {
  const user = CurrentUser;
  if (user === null) {
    throw redirect("/login");
  }

  return user;
}