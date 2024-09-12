import type { components } from "../api/v1";
export { CurrentUser } from "./currentUser";

export type Article = components["schemas"]["Article"];
export type NewArticle = components["schemas"]["NewArticle"];

export type ArticleComment = components["schemas"]["Comment"];

export type Tag = components["schemas"]["Tag"];

export type User = components["schemas"]["User"];
export type UpdateUser = components["schemas"]["UpdateUser"];
export type Profile = components["schemas"]["Profile"];
export type LoginUser = components["schemas"]["LoginUser"];
export type NewUser = components["schemas"]["NewUser"];