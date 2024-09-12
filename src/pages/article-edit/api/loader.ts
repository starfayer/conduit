import { POST } from "../../../shared/api";
import { NewArticle, User } from "../../../shared/models";
import { throwAnyErrors } from "../../../shared/utils";

export async function createNewArticle(user: User, articleData: NewArticle) {
  return await throwAnyErrors(POST("/articles", {
    body: { article: articleData },
    headers: {
      "Authorization": user.token !== undefined ? `Token ${user.token}` : undefined
    }
  }));
}