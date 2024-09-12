import { GET } from "../../../shared/api";
import { throwAnyErrors } from "../../../shared/utils";

export const LIMIT = 20;

export async function getTags() {
  return await throwAnyErrors(GET("/tags"));
}
export async function getArticles(pageNumber: number, activeTag?: string, userToken?: string) {
  return await throwAnyErrors(GET("/articles", {
    params: {
      query: {
        tag: activeTag,
        limit: LIMIT,
        // TODO bug here, offset = page - 1
        offset: !Number.isNaN(pageNumber) ? Math.max(0, pageNumber - 1) * LIMIT : undefined,
      },
    },
    headers: {
      "Authorization": userToken !== undefined ? `Token ${userToken}` : undefined
    }
  }));
}
export async function getFollowedArticles(userToken: string | undefined, pageNumber: number) {
  return await throwAnyErrors(GET("/articles/feed", {
    params: {
      query: {
        limit: LIMIT,
        // TODO bug here, offset = page - 1
        offset: !Number.isNaN(pageNumber) ? Math.max(0, pageNumber - 1) * LIMIT : undefined,
      },
    },
    headers: {
      "Authorization": userToken !== undefined ? `Token ${userToken}` : undefined
    }
  }));
}