import { useContext, useState } from "react";
import { CurrentUser, UpdateUser } from "../../../shared/models";
import { Link, useNavigate } from "react-router-dom";
import { updateUser } from "../../../shared/api";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(CurrentUser);
  const [userData, setUserData] = useState<UpdateUser | null>(user);

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            {user !== null ?
            <>
              <form>
                <fieldset>
                  <fieldset className="form-group">
                    <legend>Profile picture URL</legend>
                    <input className="form-control form-control-lg" type="text" placeholder="URL of profile picture" value={user.image}
                      onChange={e => setUserData({...userData, image: e.currentTarget.value}) }
                      />
                  </fieldset>
                  <fieldset className="form-group">
                    <legend>Username</legend>
                    <input className="form-control form-control-lg" type="text" placeholder="Your Name" value={user.username}
                      onChange={e => setUserData({...userData, username: e.currentTarget.value}) }
                      />
                  </fieldset>
                  <fieldset className="form-group">
                    <legend>Bio</legend>
                    <textarea
                      className="form-control form-control-lg"
                      rows={8}
                      placeholder="Short bio about you"
                      value={user.bio ?? ""}
                      onChange={e => setUserData({...userData, bio: e.currentTarget.value}) }
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <legend>Email</legend>
                    <input className="form-control form-control-lg" type="text" placeholder="Email" value={user.email}
                      onChange={e => setUserData({...userData, email: e.currentTarget.value}) }
                      />
                  </fieldset>
                  <fieldset className="form-group">
                    <legend>Password</legend>
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="New Password"
                      onChange={e => setUserData({...userData, password: e.currentTarget.value}) }
                    />
                  </fieldset>
                </fieldset>
              </form>
              <button className="btn btn-lg btn-primary pull-xs-right"
                  onClick={e => {
                    e.preventDefault();
                    updateUser(userData!, user!).then(() => navigate("/"));
                  }}
                  >Update Settings</button>
              <button className="btn btn-outline-danger" onClick={() => {
                setUser(null);
                navigate("/signin");
              }}>Or click here to logout.</button>
            </> :
            <>
              <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h4>It seems like you are logged out.</h4>
                <p> Maybe you need to <Link to={"/register"}>register</Link> or <Link to={"/signin"}>sign in</Link>?</p>
              </div>
            </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}