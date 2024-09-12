import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import { CurrentUser } from "../models/currentUser";

export function Header() {
  const { user } = useContext(CurrentUser);
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link
              className={`nav-link ${pathname == "/" ? "active" : ""}`}
              to="/"
            >
              Home
            </Link>
          </li>
          {/* {false ? ( */}
          {user == null ? (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname == "/signin" ? "active" : ""}`}
                  to="/signin"
                  state={{prevUrl: pathname}}
                >
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname == "/register" ? "active" : ""}`}
                  to="/register"
                  state={{prevUrl: pathname}}
                >
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname == "/edit" ? "active" : ""}`}
                  to="/edit"
                >
                  <i className="ion-compose"></i>&nbsp;New Article{" "}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname == "/settings" ? "active" : ""}`}
                  to="/settings"
                >
                  {/* {" "} */}
                  <i className="ion-gear-a"></i>&nbsp;Settings{" "}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname.includes("/profile") ? "active" : ""}`}
                  to={`/profile/${user?.username}`}
                >
                  {user?.image && (
                    <img
                      width={25}
                      height={25}
                      src={user.image}
                      className="user-pic"
                      alt="user-pic"
                    />
                  )}
                  {user?.username}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}