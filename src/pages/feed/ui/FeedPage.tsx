import { useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { scrollToTop, ARTICLES_PER_PAGE } from "../../../shared/utils";
import { DotLoaderComponent } from "../../../shared/ui";

import { getArticles, getFollowedArticles, getTags } from "../api/loader";
import type { Article, Tag } from "../../../shared/models";
import { CurrentUser } from "../../../shared/models";

import { ArticlePreview } from "./ArticlePreview";
import { TabsList, Pagination } from "../../../shared/ui";
import { Tabs } from "../lib";

const defaultTab = Tabs.global;

export function FeedPage() {
  const { user } = useContext(CurrentUser);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isArticlesLoading, setIsArticlesLoading] = useState(true);

  const queryPageNumber = parseInt(searchParams.get("page") ?? "1", 10);
  const [currentPage, setCurrentPage] = useState<number>(queryPageNumber);
  const queryTag = searchParams.get("tag") ?? undefined;
  const [activeTag, setActiveTag] = useState<string | undefined>(queryTag);

  const getTabs = () => {
    const tabs = [];
    if (user) {
      tabs.push(Tabs.yours)
    }
    tabs.push(Tabs.global);
    if (activeTag) {
      tabs.push(activeTag);
    }
    return tabs;
  }
  const [tabs, setTabs] = useState<string[]>(getTabs());
  const [activeTab, setActiveTab] = useState<string>(queryTag || defaultTab);

  function activeTagSetter(activeTag: string) {
    setTabs(getTabs());
    setActiveTag(activeTag);
    setActiveTab(activeTag);
    setCurrentPage(1);
  }
  function activeTabSetter(activeTab: string) {
    if (activeTag !== undefined) {
      setActiveTag(undefined);
      setTabs(getTabs());
    }
    setActiveTab(activeTab);
    setCurrentPage(1);
  }

  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {
    getTags().then((res) => setTags(res.tags));
  }, []);
  useEffect(() => {
    setTabs(getTabs());
  }, [user]);

  const [pageAmount, setPageAmount] = useState<number>(0);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (activeTag !== "" && activeTag !== undefined) {
      searchParams.set("tag", activeTag);
    } else {
      searchParams.delete("tag");
    }
    if (currentPage !== 1) {
      searchParams.set("page", `${currentPage}`);
    } else {
      searchParams.delete("page");
    }
    setSearchParams(searchParams);

    scrollToTop();

    setIsArticlesLoading(true);
    let promise;
    if (activeTab === Tabs.global || activeTab === activeTag) {
      promise = getArticles(currentPage, activeTag, user?.token);
    } else if (activeTab === Tabs.yours) {
      promise = getFollowedArticles(user?.token, currentPage);
    } else {
      setIsArticlesLoading(false);
      console.error("Tab is not defined!");
      return;
    }

    promise
    .then((articles) => {
      if (articles) {
        setArticles(articles.articles);
        setPageAmount(Math.ceil(articles.articlesCount / ARTICLES_PER_PAGE));
        setIsArticlesLoading(false);  
      }

      setIsLoading(false);
    })
  }, [currentPage, activeTag, activeTab]);

  return (
    <div className="home-page">
      {user === null && 
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>}

      <div className="container page">
        {isLoading ?
        <DotLoaderComponent loading={isLoading} /> :
        <div className="row">
          <div className="col-md-9" style={{
            display: "flex",
            flexDirection: "column"
          }}>
            <TabsList tabs={Object.values(tabs)} activeTab={activeTab} setActiveTab={activeTabSetter} />
            {isArticlesLoading ?
            <DotLoaderComponent loading={isArticlesLoading} /> :
            <>
              {articles.map((article) => (
                <ArticlePreview key={article.slug} article={article} />
              ))}
            </>
            }
            <Pagination pageAmount={pageAmount} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
    
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
                <div className="tag-list">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      name="tag"
                      value={tag}
                      className="tag-pill tag-default"
                      onClick={() => activeTagSetter(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
}