import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import { Article, CurrentUser, Profile } from "../../../shared/models"
import { getUserDataByName, getUserCreatedArticles, followUser } from "../../../shared/api";
import { NotFoundPage, Pagination, TabsList } from "../../../shared/ui";

import { MyTabs, UserTabs } from "../lib";
// TODO !!! move it to shared
import { ArticlePreview } from "../../feed/ui/ArticlePreview";
import { ARTICLES_PER_PAGE } from "../../../shared/utils";
import { DotLoaderComponent } from "../../../shared/ui";

export function ProfilePage() {
  const { user } = useContext(CurrentUser);
  const { profileId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [fetchedUserData, setFetchedUserData] = useState<Profile>();
  const [fetchedUserArticles, setFetchedUserArticles] = useState<Article[]>();

  const [tabs, setTabs] = useState<string[]>();
  const [activeTab, setActiveTab] = useState<string>();

  const [pageAmount, setPageAmount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getUserDataByName(profileId!).then(res => {
      if (res) {
        if (user !== null && res.profile.username === user.username) {
          setTabs(Object.values(MyTabs));
          setActiveTab(MyTabs.user);
        } else {
          setTabs(Object.values(UserTabs));
          setActiveTab(UserTabs.user);
        }
        getUserCreatedArticles(profileId!).then(articlesData => {
          setFetchedUserData(res.profile);
          if (articlesData) {
            setPageAmount(Math.ceil(articlesData.articlesCount / ARTICLES_PER_PAGE));
            setFetchedUserArticles(articlesData.articles);
            setIsLoading(false);
          }
        });
      }
    });
  }, []);

  function followUserRequest(username: string) {
    followUser(username).then(res => {
      if (res) {
        setFetchedUserData({
          ...fetchedUserData!,
          following: true
        });
      } else {
        // TODO add notification, dialog notification
      }
    });
  }

  return (
    <>
      {isLoading ?
      <DotLoaderComponent loading={isLoading} /> :
      <>
        {!fetchedUserData ?
        <NotFoundPage target="Profile" /> :
        <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                {fetchedUserData !== undefined ?
                <div>
                  <img src={fetchedUserData?.image ?? ""} className="user-img" alt="user-image"/>
                  <h4>{fetchedUserData?.username}</h4>
                  <p>{fetchedUserData?.bio}</p>
                  {fetchedUserData.username !== user?.username ?
                  <button className="btn btn-sm btn-outline-secondary action-btn" onClick={() => followUserRequest(fetchedUserData.username)}>
                    <i className="ion-plus-round"></i> &nbsp; {fetchedUserData.following ? "Follow" : "Unfollow" }
                  </button> :
                  <button className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-gear-a"></i> &nbsp; Edit my profile 
                  </button>}
                </div> :
                <div>
                  <h4>Profile <b>{profileId}</b> not found</h4>
                  <p> Maybe you need to register? <Link to={"/register"} >register</Link> </p>
                </div>
                }
              </div>
            </div>
          </div>
        </div>
        
        {fetchedUserData &&
        <div className="container">
          <div className="row">
            <TabsList tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="col-xs-12 col-md-10 offset-md-1">
              {fetchedUserArticles?.map((article) => (
                <ArticlePreview key={article.slug} article={article} />
              ))}
              <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageAmount={pageAmount} />
            </div>
          </div>
        </div>
        }
        </div>
        }
      </>
      }
    </>
  )
}