import { Link, useLocation, useNavigate } from "react-router-dom";
import { SyntheticEvent, useContext, useState } from "react";

import { signIn } from "../api/auth";
import { CurrentUser } from "../../../shared/models";

function SignInPage() {
  const { user, setUser } = useContext(CurrentUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<string[]>([]);
  
  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();

    signIn({email, password})
    .then(res => {
      setUser(res.user);
      navigate(location?.state?.prevUrl || "/");
    })
    .catch(async err => {
      const errs = await err.json();
      const errors = [];
      for (const key in errs.errors) {
        const errorString = `${key}: ${errs.errors[key]}`;
        errors.push(errorString);
      }
      setErrors(errors);
    })
  }

  const isFormDisabled = email.length === 0 || password.length === 0;

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            {user &&
            <p className="text-xs-center">
              You are already logged in as <span style={{fontWeight: "bold"}}>{user.username}</span>  <a href="" onClick={() => setUser(null)}>Log out?</a>
            </p>}
            <p className="text-xs-center">
              Need an account? <Link to="/register">Register</Link>
            </p>
            <form onSubmit={onSubmit}>
                <input
                  className="form-group form-control form-control-lg"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.currentTarget.value)}
                />
                <input
                  className="form-group form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.currentTarget.value)}
                />

                {errors.length > 0 && (
                  <ul className="error-messages" style={{padding: 0}}>
                    {errors.map((error) => (
                      <li key={error}>Error: {error}</li>
                    ))}
                  </ul>
                )}

              <button disabled={isFormDisabled} type="submit" className="btn btn-lg btn-primary pull-xs-right">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SignInPage };