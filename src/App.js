import "./App.css";
import { Route,Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/common/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import OpenRoute from "./components/core/Auth/OpenRoute";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import ContactUs from "./pages/ContactUs";
import Settings from "./components/core/Dashboard/Settings";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import { ViewCourse } from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import { getUserDetails } from "./services/operations/profileAPI";
import CreateCategory from "./components/core/Dashboard/CreateCategory";

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/> }></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/contact' element={<ContactUs/>}></Route>
        <Route path="/course/:courseId" element={<CourseDetails/>}></Route>
        <Route path="/catalog/:catalogName" element={<Catalog/>}></Route>

        <Route path='/login' element={<OpenRoute><Login/></OpenRoute> }></Route>
        <Route path='/signup' element={<OpenRoute><Signup/></OpenRoute>}></Route>
        <Route path='/forgot-password' element={<OpenRoute><ForgotPassword/></OpenRoute>}></Route>
        <Route path='/update-password/:id' element={<OpenRoute><UpdatePassword/></OpenRoute>}></Route>
        <Route path='/verify-email' element={<OpenRoute><VerifyEmail/></OpenRoute>}></Route>

        <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
          <Route path='/dashboard/my-profile' element={<MyProfile/>}/>
          <Route path='/dashboard/settings' element={<Settings/>}/>
          {
            user?.accountType === ACCOUNT_TYPE.ADMIN && (
              <>
                <Route path="/dashboard/create-category" element={<CreateCategory/>}/>
              </>
            )
          }
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
                <Route path="/dashboard/cart" element={<Cart/>}/>
              </>
            )
          }
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="/dashboard/add-course" element={<AddCourse/>}/>
                <Route path="/dashboard/instructor" element={<Instructor/>}/>
                <Route path="/dashboard/my-courses" element={<MyCourses/>}/>
                <Route path="/dashboard/edit-course/:courseId" element={<EditCourse/>}/>
              </>
            )
          }
          
        </Route>
        <Route element={<PrivateRoute><ViewCourse/></PrivateRoute>}>
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT &&(
              <>
                <Route path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<VideoDetails/>}/>
              </>
            )
          }
        </Route>
        <Route path="*" element={<Error/>}/>

      </Routes>
    </div>
  );
}

export default App;
