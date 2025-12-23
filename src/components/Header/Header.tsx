import { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAuthorizationStatus, selectFavoriteCount, selectUser } from '../../store/selectors';
import { logoutAction, requireLogout } from '../../store/slices/user-slice';
import { dropToken } from '../../services/token';

type HeaderProps = {
  /**
   * If true, the logo link has "active" modifier class (as in markup).
   * For login page the logo is not highlighted.
   */
  logoLinkActive?: boolean;
};

export default function Header({ logoLinkActive = true }: HeaderProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectUser);
  const favoritesCount = useAppSelector(selectFavoriteCount);

  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  const handleLogout = useCallback(() => {
    // Drop token and update state immediately; also try to notify server.
    dropToken();
    dispatch(requireLogout());
    void dispatch(logoutAction());
    if (pathname === '/favorites') {
      navigate('/');
    }
  }, [dispatch, navigate, pathname]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              className={`header__logo-link ${logoLinkActive ? 'header__logo-link--active' : ''}`}
              to="/"
            >
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width={81}
                height={41}
              />
            </Link>
          </div>

          <nav className="header__nav">
            <ul className="header__nav-list">
              {!isAuth ? (
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to="/login">
                    <span className="header__login">Sign in</span>
                  </Link>
                </li>
              ) : (
                <>
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                      <div className="header__avatar-wrapper user__avatar-wrapper">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt="avatar" width={20} height={20} />
                        ) : null}
                      </div>

                      <span className="header__user-name user__name">{user?.email}</span>
                      <span className="header__favorite-count">{favoritesCount}</span>
                    </Link>
                  </li>

                  <li className="header__nav-item">
                    <button className="header__nav-link" type="button" onClick={handleLogout}>
                      <span className="header__signout">Sign out</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
