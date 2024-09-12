import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FeedPage } from '../pages/feed';
import { Header } from '../shared/ui';
import { RegisterPage, SignInPage } from '../pages/sign-in';
import { CurrentUser } from '../shared/models';
import { User } from '../shared/models';
import { ProfilePage } from '../pages/profile';
import { SettingsPage } from '../pages/settings';
import { ArticleEditPage } from '../pages/article-edit';
import { ArticleReadPage } from '../pages/article-read';
import { getUserDataByName } from '../shared/api';
import { NotFoundPage } from '../shared/ui';

export const UserProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const setUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("email", user.email);
      localStorage.setItem("username", user.username);
      localStorage.setItem("token", user.token);
    } else if (user === null) {
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (currentUser === null && username !== null) {
      getUserDataByName(username).then(res => {
        const {username, bio, image} = res.profile;
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        setCurrentUser({
          username, bio, image, email: email!, token: token!
        });
      });
    }
  })

  return (
    <CurrentUser.Provider value={{ user: currentUser, setUser }}>
      {props.children}
    </CurrentUser.Provider>
  );
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:profileId" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/edit/:slug?" element={<ArticleEditPage />} />
          <Route path="/article/:slug" element={<ArticleReadPage />} />

          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App
