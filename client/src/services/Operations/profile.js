import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";
import { setLoading, setUser } from "../../slices/authSlice"; // Add setUser import
import { setProfile } from "../../slices/profileSlice";

const {
  GET_USER_PROFILE_API,
  UPDATE_PROFILE_API,
  UPDATE_DISPLAY_PICTURE_API,
  DELETE_ACCOUNT_API,
} = profileEndpoints;

// ========== GET USER PROFILE ==========
export const getUserProfile = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_USER_PROFILE_API);
      console.log("GET_USER_PROFILE RESPONSE:", response);
      
      if (!response.data.success) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = response.data.profile;
      
      // Update both auth and profile states
      dispatch(setUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        image: profileData.image,
        profile: {
          gender: profileData.gender,
          dateOfBirth: profileData.dateOfBirth,
          about: profileData.about,
          contactNumber: profileData.contactNumber,
        }
      }));
      
      dispatch(setProfile(profileData));
      
      return profileData;
    } catch (error) {
      console.error("GET_USER_PROFILE ERROR:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== UPDATE PROFILE ==========
export const updateProfile = (formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      // Capitalize gender for backend compatibility
      const backendFormData = {
        ...formData,
        gender: formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : formData.gender
      };
      
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, backendFormData);
      console.log("UPDATE_PROFILE RESPONSE:", response);

      if (!response.data.success) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = response.data.profile;
      
      // Update both states
      dispatch(setUser({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        image: updatedProfile.image,
        profile: {
          gender: updatedProfile.gender,
          dateOfBirth: updatedProfile.dateOfBirth,
          about: updatedProfile.about,
          contactNumber: updatedProfile.contactNumber,
        }
      }));
      
      dispatch(setProfile(updatedProfile));
      
      return updatedProfile;
    } catch (error) {
      console.error("UPDATE_PROFILE ERROR:", error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== UPDATE DISPLAY PICTURE ==========
export const updateDisplayPicture = (imageFile) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await apiConnector("PUT", UPDATE_DISPLAY_PICTURE_API, formData, {
        "Content-Type": "multipart/form-data",
      });

      console.log("UPDATE_DISPLAY_PICTURE RESPONSE:", response);

      if (!response.data.success) {
        throw new Error("Failed to update display picture");
      }

      const updatedUser = response.data.user;
      
      // Update auth state with new image
      dispatch(setUser(updatedUser));
      
      // Return the updated user data
      return updatedUser;
    } catch (error) {
      console.error("UPDATE_DISPLAY_PICTURE ERROR:", error);
      // Re-throw the error so it can be caught in the component
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== DELETE ACCOUNT ==========
export const deleteAccount = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("DELETE", DELETE_ACCOUNT_API);
      console.log("DELETE_ACCOUNT RESPONSE:", response);

      if (!response.data.success) {
        throw new Error("Failed to delete account");
      }

      // Clear all states
      dispatch(setUser(null));
      dispatch(setProfile(null));
      
      return response.data.message;
    } catch (error) {
      console.error("DELETE_ACCOUNT ERROR:", error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};