import { DELETE, GET, POST } from "../../../shared/api";
import { User } from "../../../shared/models";
import { throwAnyErrors } from "../../../shared/utils";

export async function getArticleComments(slug: string, currentUser?: User | null) {
  return await throwAnyErrors(GET("/articles/{slug}/comments", {
    params: {
      path: { slug }
    },
    headers: {
      "Authorization": currentUser?.token !== undefined ? `Token ${currentUser.token}` : undefined
    }
  }));
}
export async function createArticleComment(comment: string, slug: string, currentUser: User) {
  return await throwAnyErrors(POST("/articles/{slug}/comments", {
    params: {
      path: { slug }
    },
    body: {
      comment: { body: comment }
    },
    headers: {
      "Authorization": currentUser.token !== undefined ? `Token ${currentUser.token}` : undefined
    }
  }));
}
export async function deleteArticleComment(commentId: number, slug: string, currentUser: User) {
  return await throwAnyErrors(DELETE("/articles/{slug}/comments/{id}", {
    params: {
      path: { slug, id: commentId }
    },
    headers: {
      "Authorization": currentUser.token !== undefined ? `Token ${currentUser.token}` : undefined
    }
  }));
}

export async function deleteArticle(slug: string, currentUser: User) {
  return await throwAnyErrors(DELETE("/articles/{slug}", {
    params: {
      path: { slug }
    },
    headers: {
      "Authorization": currentUser.token !== undefined ? `Token ${currentUser.token}` : undefined
    }
  }));
}
