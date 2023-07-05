import { useSelector } from 'react-redux';
import './App.css';
import NewPost from './component/NewPost/NewPost';
import EditProfile from './component/edit/EditProfile';
import Post from './component/post/Post';
import Profile from './component/profile/Profile';
import Auth from './pages/auth/Auth';
import Home from './pages/home/Home';
import Loading from './pages/loading/Loading';
import { Routes, Route } from "react-router-dom"
import NotFound from './component/notFound/NotFound';
import ForgotPassword from './component/forgotPassword/ForgotPassword';
import ResetPassword from './component/resetPassword/ResetPassword';

function App() {
  // const token=JSON.stringify(localStorage.getItem('token'));
  const {isAuthenticated}=useSelector((state)=>state.user);
  return (
     <>
      <Routes>
        <Route path='/loading' element={<Loading />}/>
        <Route path='/edit' element={<EditProfile />}/>
        {/* <Route path='/forgot/password' element={<For} */}
        <Route path='/api/user/password/reset/:token' element={<ResetPassword />}/>
        <Route path='/newPost' element={isAuthenticated ? <NewPost /> :<Auth />} />
        <Route path='/profile' element={isAuthenticated ?<Profile />:<Auth />} />
        <Route path='/Post' element={<Post />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/' element={isAuthenticated ?<Home /> :<Auth/>} />
        <Route path='*' element={<NotFound />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
      </Routes>
     </>
  );
}

export default App;
