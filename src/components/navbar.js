import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { userContext } from '../App';
import M from 'materialize-css';

const Navbar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('');
  const [userDetails,setUserDetails] = useState([]);
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])
  const renderList = () => {
    if (state) {
      return [
        <li key="1"><Link to=""><i data-target="modal1" className="material-icons modal-trigger">search</i></Link></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/createpost">Create Post</Link></li>,
        <li key="4"><Link to="/myfollowingpost">My Following Posts</Link></li>,
        <button className="waves-effect waves-light btn-small red darken-1"
          onClick={() => {
            localStorage.clear()
            dispatch({ type: "CLEAR" })
            history.push('/login')
          }}
        >Logout</button>
      ]
    } else {
      return [
        <Link to="/login"><button className="btn-default dark waves-effect waves-light">sign in</button></Link>
      ]
    }
  }

  const fetchUsers = (query) =>{
    setSearch(query);
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query:query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
  }
  return (
    <nav className="transparent z-depth-0">
    <div className="nav-wrapper">
      <Link to={state ? "/" : "/startup"} className="brand-logo">Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>

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
          {userDetails.map(item=>{
            return <Link to={item._id !== state._id?"/profile/"+item._id : "/profile"} onClick={()=>{
              M.Modal.getInstance(searchModal.current).close()
              setSearch('')
            }}><li className="collection-item" style={{ color: "black" }}>{item.email}</li></Link>
          })}
        </ul>
      </div>

      <div className="modal-footer">
        <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
      </div>
    </div>
    </nav>
  )
}

export default Navbar;