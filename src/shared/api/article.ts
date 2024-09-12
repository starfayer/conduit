import { GET } from ".";
import { throwAnyErrors } from "../utils";

export async function getArticleData(slug: string) {
  return await throwAnyErrors(GET("/articles/{slug}", {
    params: {
      path: { slug }
    }
  }));
}