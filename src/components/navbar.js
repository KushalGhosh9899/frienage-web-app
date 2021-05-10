import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { userContext } from '../App';
import M from 'materialize-css';

const Navbar = () => {
  const [colorChange, setColorchange] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    }
    else {
      setColorchange(false);
    }
  };
  window.addEventListener('scroll', changeNavbarColor);

  const searchModal = useRef(null)
  const logoutModal = useRef(null)
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    M.Modal.init(searchModal.current)
    M.Modal.init(logoutModal.current)
  }, [])

  const location = useLocation();
  const renderList = () => {
    if (state) {
      return [
        <div className="nav-btn">
          <Link to="/" title="Home" className={location.pathname == '/' ? "active-btn" : ""}> <i class="material-icons">home</i></Link>
          <Link to="/profile" title="My Profile" className={location.pathname == '/profile' ? "active-btn" : ""}><i class="material-icons">person</i></Link>
          <Link title="Search" data-target="modal1" className="material-icons modal-trigger" >
            <i data-target="modal1" className="material-icons modal-trigger">search</i></Link>
          <Link to="/myfollowingpost" title="Following" className={location.pathname == '/myfollowingpost' ? "active-btn" : ""}>
            <i class="material-icons">supervisor_account</i></Link>
          <Link to="/messages" title="Messages" className={location.pathname == '/messages' ? "active-btn" : ""}><i class="material-icons">message</i></Link>
          <Link to="/settings" title="Settings" className={location.pathname == '/settings' ? "active-btn" : ""}><i class="material-icons">settings</i></Link>
        </div>,
        <div className="profile-details">
          <Link to="/notifications">
            <i class="material-icons notification">notifications_none
          <span class="new-badge">4</span></i>
          </Link>
          <Link to='/profile' className="profile-details">
            <img className="author-pic-nav"
              src={state ? state.pic : "loading.."}
            />
            <h2>{state.name}</h2>
          </Link>
          <i onClick={() => {
            dropDown ?
              setDropDown(false) :
              setDropDown(true)
          }}
            class="material-icons">arrow_drop_down_circle</i>
        </div>,
        <div className={dropDown ? "dropdown-menu z-depth-5" : "dropdown-menu z-depth-5 hide"}>
          <span><i class="material-icons">person_outline</i>My Profile</span>
          <div className="divider"></div>
          <span><i class="material-icons">settings</i>Settings</span>
          <div className="divider"></div>
          <span data-target="logoutModal" className="modal-trigger">
            <i class="material-icons">power_settings_new</i>Logout</span>
        </div>
      ]
    } else {
      return [
        <Link to="/login"><button className="btn-default light waves-effect waves-light right-top">sign in</button></Link>
      ]
    }
  }

  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query
      })
    }).then(res => res.json())
      .then(results => {
        setUserDetails(results.user)
      })
  }



  return (
    <nav className={state ? "nav-wrapper white" : "" || colorChange ? 'custom-header fixed' : 'z-depth-0 custom-header'}>
      <div>

        <Link to={state ? "/" : "/startup"} className="brand-logo logo-txt">
          Friengage
        </Link>

        <ul id="nav-mobile">
          {renderList()}
        </ul>


        {/* <!-- Modal Structure --> */}
        <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
          <div className="modal-content">
            <input
              type="text"
              placeholder="search users"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection">
              {userDetails.map(item => {
                return <Link to={item._id !== state._id ? "/profile/" + item._id : "/profile"} onClick={() => {
                  M.Modal.getInstance(searchModal.current).close()
                  setSearch('')
                }}><li className="collection-item" style={{ color: "black" }}>{item.email}</li></Link>
              })}
            </ul>
          </div>

          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
          </div>
        </div>

        {/* <!-- Logout Modal Structure --> */}
        <div id="logoutModal" className="modal logout-modals" ref={logoutModal}>
          <div className="modal-content logout-modal">
            <h2>
              Are you sure you want to Logout?
            </h2>
            <div className="logout-buttons">
              <button className="modal-close btn-default light waves-effect waves-light"> No </button>
              <button className="btn-default dark waves-effect waves-light" onClick={() => {
                setDropDown(false)
                localStorage.clear()
                dispatch({ type: "CLEAR" })
                history.push('/login')
                M.Modal.getInstance(logoutModal.current).close()

              }}
              > Yes </button>
            </div>
          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar;