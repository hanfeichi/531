import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions';
import './Main.css';

function Main() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [userStatus, setUserStatus] = useState('');
  const [status, setStatus] = useState('');
  const [newFollowed, setNewFollowed] = useState('');
  const [followedUsersList, setFollowedUsersList] = useState([]);
  const [errorInput, setErrorInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newArticleText, setNewArticleText] = useState('');
  const [articles, setArticles] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const currentUsername = useSelector(state => state.username);


  const hardCodeImage = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/58aafd59-3bfc-480b-8e80-3602c320a0ad/dfxq74u-a333ca64-593b-4703-817e-ecea5220738f.jpg/v1/fit/w_448,h_252,q_70,strp/ask_loopy_anything_by_esure456_dfxq74u-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjUyIiwicGF0aCI6IlwvZlwvNThhYWZkNTktM2JmYy00ODBiLThlODAtMzYwMmMzMjBhMGFkXC9kZnhxNzR1LWEzMzNjYTY0LTU5M2ItNDcwMy04MTdlLWVjZWE1MjIwNzM4Zi5qcGciLCJ3aWR0aCI6Ijw9NDQ4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.1_PvzsJmrbqJ5ZAhM3qEYYt1jornMugvfnKZllmRjxo';

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
    // console.log(storedUser);
    // console.log(currentUser);

    // fetch("https://jsonplaceholder.typicode.com/posts")
    //   .then(response => response.json())
    //   .then(data => setArticles(data));

    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  // set current user's status
  useEffect(() => {
    if (currentUser && currentUser.company) {
      setUserStatus(currentUser.status || currentUser.company.catchPhrase);
    }
  }, [currentUser]);

  // set initial followed users
  useEffect(() => {
    const followedIds = [(currentUser.id + 1) % 10, (currentUser.id + 2) % 10, (currentUser.id + 3) % 10];
    const followed = users.filter(user => followedIds.includes(user.id));
    setFollowedUsersList(followed);
  }, [users, currentUser]);

  // set articles according to current user and followed users
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(data => {
        const userIds = followedUsersList.map(user => user.id);
        if (currentUser && currentUser.id) {
          userIds.push(currentUser.id);
        }
        const filteredArticles = data.filter(article => userIds.includes(article.userId));
        setArticles(filteredArticles);
      });
  }, [followedUsersList, currentUser]);

  // after button 'LogOut' clicked
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("currentUser");
  };

  // after button 'Update' at profile section clicked
  const handleStatusUpdate = () => {
    setUserStatus(status);
    currentUser.status = status;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    setStatus('');
  };

  // unfollow the user selected when button 'Unfollow' clicked
  const handleUnfollow = (id) => {
    setFollowedUsersList(prevList => prevList.filter(user => user.id !== id));
  };

  // add folloewed user when button 'Add' clicked
  const addFollowedUser = () => {
    if (newFollowed) {
      const userToAdd = users.find(user => user.name.toLowerCase() === newFollowed.toLowerCase());

      if (!userToAdd) {
        setErrorInput('User not found. Please enter a valid name.');
      }
      else if (followedUsersList.some(user => user.id === userToAdd.id)) {
        setErrorInput('You are already following this user.');
      }
      else {
        setFollowedUsersList([...followedUsersList, userToAdd]);
        setNewFollowed('');
        setErrorInput('');
      }
    }
  }

  // Post new articles when button 'Post' clicked
  const handlePost = () => {
    if (newArticleText.trim() !== '') {
      const newArticle = {
        userId: currentUser.id,
        id: articles.length + 1, //id: articles.length + 1,
        title: 'New Article',
        body: newArticleText
      };
      setArticles([newArticle, ...articles]);
      setNewArticleText('');
    }
  };

  const showComment = (article) => {
    article.showComment = true;
    setArticles([...articles]);
  }

  const handleCommentChange = (article, comment) => {
    article.comment = comment;
    setArticles([...articles]);
  }

  const handleCommentCancel = (article) => {
    article.showComment = false;
    article.comment = "";
    setArticles([...articles]);
  }

  const handleCommentConfirm = (article) => {
    if (!article.comments) {
      article.comments = [];
    }

    const date = new Date();
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    article.comments.push({ currentUser, comment: article.comment, datetime: formattedDate });
    article.showComment = false;
    article.comment = "";
    setArticles([...articles]);
  }

  return (
    <div className="main-container container-fluid">
      <div className="row">
        {/* Sidebar including user-section and followed-users */}
        <div className="col-md-3 sidebar">
          {/* User Section with Top Bar and User Info */}
          <div className="top-section">
            {/* Top Bar */}
            <div className="nav-bar">
              <Link to="/" className="nav-link" data-testid="logout-button" onClick={handleLogout}>Log Out</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </div>

            {/* User Info */}
            <div className="user-info">
              <img src={hardCodeImage} alt="User profile" className="img-fluid rounded-circle" />
              <div data-testid="username" className="username">{currentUser.name || 'Unknown'}</div>
              <div className="current-status">{userStatus || 'Unknown'}</div>
              <textarea value={status} onChange={(e) => setStatus(e.target.value)} className="form-control update-text mb-2" placeholder="Update your status..."></textarea>
              <button onClick={handleStatusUpdate} className="btn btn-outline-success">Update Status</button>
            </div>
          </div>

          {/* List of followed users */}
          <div className="followed-users-section">
            <div className="followed-users-scrollable">
              {followedUsersList.map(user => (
                <div key={user.id} className="followed-user mb-2">
                  <img src={hardCodeImage} alt="Followed user profile" className="img-fluid rounded-circle" />
                  <div className="followed-user-name">{user.name}</div>
                  <div className="followed-status">{user.company.catchPhrase}</div>
                  <button data-testid="unfollow" className="btn btn-outline-danger" onClick={() => handleUnfollow(user.id)}>Unfollow</button>
                </div>
              ))}
            </div>

            <div className='add-new-followed mt-2'>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the name of the user you wish to follow"
                value={newFollowed}
                onChange={e => setNewFollowed(e.target.value)}
              />
              {errorInput && <div className="text-danger">{errorInput}</div>}
              <button data-testid="follow" className="btn btn-outline-success mt-2" onClick={addFollowedUser}>Follow</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 main-content">
          {/* Top Section with Add New Article and Logo Zone */}
          <div className="row mb-2">
            {/* Add New Article */}
            <div className="col-md-6 post-new-article">
              <input type="file" className="form-control mb-2" />
              <textarea value={newArticleText} onChange={e => setNewArticleText(e.target.value)} className="form-control mb-2" placeholder="Write your new article here..."></textarea>
              <button onClick={handlePost} className="btn btn-success">Post</button>
              <button onClick={() => setNewArticleText('')} className="btn btn-warning">Cancel</button>
            </div>
            {/* Logo Zone */}
            <div className="col-md-5 logo-zone" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="https://brand.rice.edu/sites/g/files/bxs2591/files/2019-08/190308_Rice_Mechanical_Brand_Standards_Logos-9.png" alt="FolkZone" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>

          {/* Articles Display */}
          <div className="articles-zone">
            <div className='search-input'>
              <input type="text" className="form-control mb-3" placeholder="Search Posts" onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="articles articles-scrollable">
              {articles.filter(article => {
                if (searchTerm === '') return true;
                return article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.body.toLowerCase().includes(searchTerm.toLowerCase());
              }).map(article => (
                <div key={article.id} className="article mb-3" title="article">
                  <h5>{article.title}</h5>
                  <p>{article.body}</p>
                  <img src={hardCodeImage} alt="Article image" className="img-fluid mb-2" />
                  <button className="btn btn-outline-secondary mr-2">Edit</button>
                  {
                    article.showComment ? (
                      <>
                        <button className="btn btn-outline-primary" onClick={() => handleCommentConfirm(article)}>Save</button>
                        <button className="btn btn-outline-secondary" onClick={() => handleCommentCancel(article)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-outline-primary" onClick={() => showComment(article)}>Comment</button>
                    )
                  }
                  {
                    article.showComment && (
                      <input type="text" className="form-control mb-3" placeholder="Enter comments..." value={article.comment} onChange={e => handleCommentChange(article, e.target.value)} />
                    )
                  }
                  <ul className="list-group">
                    {
                      article.comments && article.comments.map(comment => (
                        <li className="list-group-item">
                          <div>{comment.comment}</div>
                          <div className="comment-name">{comment.currentUser.name} {comment.datetime}</div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
