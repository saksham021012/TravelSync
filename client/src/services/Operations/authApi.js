import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../apis";
import toast from "react-hot-toast";
import { setUser, setSignupData, setLoading, setToken } from "../../slices/authSlice";

const {
  LOGIN_API,
  SIGNUP_API,
  SENDOTP_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API
} = authEndpoints;


// ============ SEND OTP ===========
export const sendOtp = (email, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENTOTP API RESPONSE.......", response);

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP sent successfully");
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR....", error);
      toast.error("Could not send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId)

  }
}

//======== SIGNUP ==============
export const signUp = (
  firstName,
  lastName,
  email,
  password,
  otp,
  navigate
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        otp
      })
      console.log("SIGNUP API RESPONSE....", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("SignUp Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR........", error);
      toast.error("SignUp Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}

// ============ LOGIN ==========
export const login = (email, password, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in..");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password
      })
      console.log("LOGIN API RESPONSE....", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login Successful");
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR......", error)
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}

// ============ RESET PASSWORD TOKEN ==============
export const getPasswordResetToken = (email) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      console.log("RESETPASSTOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error)
      toast.error("Failed To Send Reset Email")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

// ============ RESET PASSWORD ==============
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      setTimeout(() => {  //  Delay navigation slightly
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      toast.error("Failed To Reset Password")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

// ============ logout =============
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}