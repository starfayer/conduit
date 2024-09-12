import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { CurrentUser } from "../../../shared/models";
import type { NewArticle } from "../../../shared/models";
import { createNewArticle } from "../api/loader";
import { useNavigate, useParams } from "react-router-dom";
import { getArticleData } from "../../../shared/api";

const defaultArticleData: NewArticle = {
  title: "",
  description: "",
  body: "",
  tagList: []
}

export function ArticleEditPage() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const { user } = useContext(CurrentUser);
  const [articleData, setArticleData] = useState<NewArticle>(defaultArticleData);

  useEffect(() => {
    if (slug) {
      getArticleData(slug).then(res => {
        const {title, description, body, tagList, author} = res.article;
        if (user?.username === author.username) {
          setArticleData({title, description, body, tagList});
        } else {
          console.error("You don't have access to edit this article");
          // TODO dialog
        }
      });
    }
  }, []);

  function createArticle(e: SyntheticEvent) {
    e.preventDefault();

    if (articleData && user) {
      createNewArticle(user, articleData).then(() => {
        // TODO add succes dialog
        navigate("/");
      });
    } else {
      // TODO dialog window
    }
  }

  const isFormValid = Object.values(articleData).every((value) => value.length > 0);

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {/* <ul className="error-messages">
              <li>That title is required</li>
            </ul> */}

            <form onSubmit={createArticle}>
              <fieldset>
                <fieldset className="form-group">
                  <input required type="text" className="form-control form-control-lg" placeholder="Article Title" value={articleData?.title}
                    onChange={(e) => {
                      const newData = articleData ?? defaultArticleData;
                      setArticleData({...newData, title: e.currentTarget.value})
                    }}
                   />
                </fieldset>
                <fieldset className="form-group">
                  <input required type="text" className="form-control" placeholder="What's this article about?" value={articleData?.description}
                    onChange={(e) => {
                      const newData = articleData ?? defaultArticleData;
                      setArticleData({...newData, description: e.currentTarget.value})
                    }}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    required
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={articleData?.body}
                    onChange={(e) => {
                      const newData = articleData ?? defaultArticleData;
                      setArticleData({...newData, body: e.currentTarget.value})
                    }}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input type="text" className="form-control" placeholder="Enter tags (with commas)" value={articleData?.tagList?.join(" ")}
                    onChange={(e) => {
                      const newData = articleData ?? defaultArticleData;
                      setArticleData({...newData, tagList: e.currentTarget.value !== "" ? e.currentTarget.value.split(" ") : []});
                    }}
                  />
                  <div className="tag-list">
                    {articleData.tagList?.map(tag => (
                      tag !== "" && <span className="tag-default tag-pill">{tag}</span>
                    ))
                    }
                  </div>
                </fieldset>
                <button disabled={!isFormValid} className="btn btn-lg pull-xs-right btn-primary" type="submit">
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}