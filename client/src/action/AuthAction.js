import *as  AuthApi from '../api/AuthRequest.js'
export const signUp=(formData,navigate)=>async (dispatch)=>{
    dispatch({type:"RegisterRequest"});
    try {
    const {data}=await AuthApi.signUp(formData);
        dispatch({type:'RegisterSuccess',payload:data});
        navigate('../',{replace:true});
    } catch (error) {
        console.log(error) 
        dispatch({type:"RegisterFailure",payload:error.response.data.message});
    }
}

export const login=(formData,navigate)=>async (dispatch)=>{
    dispatch({type:"LoginRequest"});
    try {
    const {data}=await AuthApi.login(formData);
        dispatch({type:'LoginSuccess',payload:data});
        navigate('../',{replace:true});
    } catch (error) {
        console.log(error) 
        dispatch({type:"LoginFailure",payload:error.response.data.message});
    }
}

export const getAllUser=()=>async(dispatch)=>{
    dispatch({type:"GetAllUserRequest"});
    try {
    const {data}=await AuthApi.getAllUser();
        dispatch({type:'GetAllUserSuccess',payload:data});
    } catch (error) {
        console.log(error) 
        dispatch({type:"GetAllUserFailure",payload:error.response.data.message});
    }
}

export const followAndUnFollow =(id)=>async(dispatch)=>{
	dispatch({type:"followAndUnFollowRequest"});
	try {
		const {data}=await AuthApi.followAndUnFollow(id);
		dispatch({type:"followAndUnFollowSuccess",payload:data});
		// navigate('../',{replace:true});

	} catch (error) {
		console.log(error) 
        dispatch({type:"followAndUnFollowFailure",payload:error.response.data.message});
	}
}

export const getMyProfile=()=>async(dispatch)=>{
    dispatch({type:"ProfileRequest"});
    try {
        const {data}=await AuthApi.getMyProfile();
		dispatch({type:"ProfileSuccess",payload:data});
    } catch (error) {
        console.log(error) 
        dispatch({type:"ProfileFailure",payload:error.response.data.message});
    }
}
export const editProfile=(formData,navigate)=>async(dispatch)=>{
	dispatch({type:"EditProfileRequest"});
	try {
		const {data}=await AuthApi.editProfile(formData);
		dispatch({type:"EditProfileSuccess",payload:data});
        navigate('../',{replace:true});
	} catch (error) {
		console.log(error) 
        dispatch({type:"EditProfileFailure",payload:error.response.data.message});
	}
}

export const searchFriends=(query)=>async(dispatch)=>{
    dispatch({type:"SearchRequest"});
    try {
        const {data}=await AuthApi.searchFriends(query);
        dispatch({type:"SearchSuccess",payload:data})
    } catch (error) {
        console.log(error) 
        dispatch({type:"SearchFailure",payload:error.response.data.message});
    }
}
export const logout=(navigate)=>async(dispatch)=>{
    dispatch({ type: "LogoutRequest" });
    try {
      const { data } = await AuthApi.logout();
      dispatch({ type: "LogoutSuccess", payload: data });
      navigate('../auth',{replace:true});

    } catch (error) {
      console.log(error);
      dispatch({
        type: "LogoutFailure",
        payload: error.response.data.message,
      });
    }
  }

  export const forgotPassword=(formData)=>async(dispatch)=>{
    dispatch({type:"ForgotPasswordRequest"});
    try {
        const {data}=await AuthApi.forgotPassword(formData);
        dispatch({type:"ForgotPasswordSuccess",payload:data.user});

    } catch (error) {
        console.log(error) 
        dispatch({type:"ForgotPasswordFailure",payload:error.response.data.message});
    }
}
  
export const resetPassword = ({token, password},navigate) => async (dispatch) => {
    dispatch({ type: "ResetPasswordRequest" });
    try {
      const { data } = await AuthApi.resetPassword(token, { password });
      dispatch({ type: "ResetPasswordSuccess", payload: data.user });
      navigate("../auth",{replace:true});
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ResetPasswordFailure",
        payload: error.response.data.message,
      });
    }
  };