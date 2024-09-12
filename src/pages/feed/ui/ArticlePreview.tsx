import { Link } from "react-router-dom";
import { useContext } from "react";

import { CurrentUser, Article } from "../../../shared/models";

interface ArticlePreviewProps {
  article: Article;
}

export function ArticlePreview({article}: ArticlePreviewProps) {
  const { user } = useContext(CurrentUser);

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`}>
          <img src={article.author.image} alt="author-image" />
        </Link>
        <div className="info">
          <Link
            to={`/profile/${article.author.username}`}
            className="author"
          >
            {article.author.username}
          </Link>
          <span className="date" suppressHydrationWarning>
            {new Date(article.createdAt).toLocaleDateString(undefined, {
              dateStyle: "long",
            })}
          </span>
        </div>
        {user !== null && 
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>}
      </div>
      <Link
        to={`/article/${article.slug}`}
        className="preview-link"
      >
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}