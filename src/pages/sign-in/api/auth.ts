import { POST } from "../../../shared/api";
import type { LoginUser, NewUser } from "../../../shared/models";
import { throwAnyErrors } from "../../../shared/utils";


export async function signIn(userInfo: LoginUser) {
  return await throwAnyErrors(POST("/users/login", {
    body: { user: userInfo },
  }));
}

export async function register(userInfo: NewUser) {
  return await throwAnyErrors(POST("/users", {
    body: { user: userInfo },
  }));
}