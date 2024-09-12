import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"

import { createArticleComment, deleteArticle, deleteArticleComment, getArticleComments } from "../api/loader";
import { getArticleData } from "../../../shared/api";
import { Article, ArticleComment, CurrentUser } from "../../../shared/models";
import { DotLoaderComponent, NotFoundPage } from "../../../shared/ui";

export function ArticleReadPage() {
  const { slug } = useParams();
  const { user } = useContext(CurrentUser);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [articleData, setArticleData] = useState<Article>();
  const [articleComments, setArticleComments] = useState<ArticleComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  function addNewComment() {
    if (newComment) {
      return createArticleComment(newComment, articleData?.slug!, user!)
      // TODO set loading
      .then((res) => setArticleComments([res.comment, ...articleComments]))
      // .then(() => getArticleComments(slug!, user))
    } else {
      return Promise.resolve();
      // TODO dialog
    }
  }
  function deleteComment(commentId: number) {
    deleteArticleComment(commentId, articleData?.slug!, user!).then(() => {
      setArticleComments(articleComments?.filter(comment => comment.id !== commentId));
    });
  }

  useEffect(() => {
    getArticleData(slug!).then(res => {
      setArticleData(res.article);
      getArticleComments(slug!, user).then(res => {
        if (res) {
          setArticleComments(res.comments);
        }
        setIsLoading(false);
      });
    });
  }, []);

  return (
    <div className="article-page">
      {isLoading ?
      <DotLoaderComponent loading={isLoading} /> :
      <>
        {!articleData ?
        <NotFoundPage target={"Article"} /> :
        <>
          <div className="banner">
            <div className="container">
              <h1>{articleData?.title}</h1>
              <div className="article-meta">
                <Link to={`/profile/${articleData?.author.username}`}>
                  <img src={articleData?.author.image} alt="author-image" />
                </Link>
                <div className="info">
                  <Link to={`/profile/${articleData?.author.username}`}>{articleData?.author.username}</Link>
                  <span className="date">{(new Date(articleData?.updatedAt!)).toDateString()}</span>
                </div>
                {user?.username === articleData?.author.username &&
                <>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/edit/${articleData?.slug}`)}>
                    <i className="ion-edit"></i> Edit Article
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => {
                    deleteArticle(articleData?.slug!, user!).then(() => navigate("/"));
                  }}>
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </>
                }
              </div>
            </div>
          </div>

          <div className="container page">
            <div className="row article-content">
              <div className="col-md-12">
                <p>{articleData?.description}</p>
                <p>{articleData?.body}</p>
                <ul className="tag-list">
                  {articleData?.tagList.map(tag => (
                    <li key={tag} className="tag-default tag-pill tag-outline">{tag}</li>
                  ))}
                </ul>
              </div>
            </div>

            <hr />

            <div className="article-actions">
              <div className="article-meta">
                {/* <Link to={`/profile/${articleData?.author.username}`}>
                  <img src={articleData?.author.image} alt="author-image" />
                </Link>
                <div className="info">
                  <Link to={`/profile/${articleData?.author.username}`}>{articleData?.author.username}</Link>
                  <span className="date">{(new Date(articleData?.updatedAt!)).toDateString()}</span>
                </div> */}

                {/* <button className="btn btn-sm btn-outline-secondary" >
                  <i className="ion-plus-round"></i>
                  &nbsp; Follow {articleData?.author.username} <span className="counter">{articleData?.author.username}</span>
                </button>
                &nbsp;
                <button className="btn btn-sm btn-outline-primary">
                  <i className="ion-heart"></i>
                  &nbsp; Favorite Article <span className="counter">{articleData?.favoritesCount}</span>
                </button> */}
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2">
                {articleData &&
                (user ?
                <form className="card comment-form">
                  <div className="card-block">
                    <textarea className="form-control" placeholder="Write a comment..." rows={3}
                    onChange={e => setNewComment(e.currentTarget.value)}
                    value={newComment}
                    ></textarea>
                  </div>
                  <div className="card-footer">
                    <img src={user.image} className="comment-author-img" />
                    &nbsp;
                    <div className="comment-author info">{user.username}</div>
                    <button disabled={newComment.length === 0} className="btn btn-sm btn-primary" onClick={e => {
                      e.preventDefault();
                      addNewComment().then(() => setNewComment(""));
                      // setNewComment("");
                    }}>Post Comment</button>
                  </div>
                </form> :
                <p><Link to={"/signin"} state={{prevUrl: pathname}} >Sign in</Link> or <Link to={"/register"} state={{prevUrl: pathname}} >register</Link> to add comments on this article.</p>
                )}

                {articleComments?.map(comment => (
                  <div key={comment.id} className="card">
                    <div className="card-block">
                      <p className="card-text">
                        {comment.body}
                      </p>
                    </div>
                    <div className="card-footer">
                      <Link className="comment-author" to={`/profile/${comment.author.username}`}>
                        <img className="comment-author-img" src={comment.author.image} alt="author-image" />
                      </Link>
                      &nbsp;
                      <Link className="comment-author" to={`/profile/${articleData?.author.username}`}>{comment.author.username}</Link>
                      <span className="date-posted">{(new Date(comment.updatedAt)).toDateString()}</span> 
                      <a href="" className="comment-author" onClick={(e) => {
                        e.preventDefault();
                        deleteComment(comment.id);
                      }}>Delete comment</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
        }
      </>

      }
    </div>
  )
}