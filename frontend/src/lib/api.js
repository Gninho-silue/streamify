import { axiosInstance } from "../lib/axios";

export const signup = async (signupData) => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
}

export const login = async (loginData) => {
      const response = await axiosInstance.post("/auth/login", loginData);
      return response.data;
}

export const logout = async () => {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
}

export const completeOnboarding = async (onboardingData) => {
      const response = await axiosInstance.post('/auth/onboarding', onboardingData);
      return response.data;
}

export const getAuthUser =  async () => {
      try {
            const response = await axiosInstance.get('/auth/me');
            return response.data;    
      } catch (error) {
            console.error("Error fetching auth user:", error);
            return null; // or handle the error as needed
            
      }
}

export const getMyFriends = async () => {
      const response = await axiosInstance.get('/users/friends');
      return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users/recommended");
  return response.data;
}

export const getOutgoingFriendRequests = async () => {
      const response = await axiosInstance.get('/users/outgoing-friend-requests');
      return response.data;
}

export const sendFriendRequest = async (userId) => {
      const response = await axiosInstance.post(`/users/friend-request/${userId}`);
      return response.data;
}

export const getFriendRequests = async () => {
      const response = await axiosInstance.get("/users/friend-requests");
      return response.data;
}
export const acceptFriendRequest = async (requestId) => {
      const response = await axiosInstance.post(`/users/friend-request/${requestId}/accept`);
      return response.data;
}

export const getStreamToken = async() => {
      const response = await axiosInstance.get('/chat/token');
      return response.data;
}

export const getProfile = async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
};

export const updatePreferences = async (data) => {
    const response = await axiosInstance.put('/users/preferences', data);
    return response.data;
};

export const getUnreadNotificationCount = async () => {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data.count;
};

export const getNotifications = async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data.notifications;
};

export const markAsRead = async (notificationId) => {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
};

export const markAllAsRead = async () => {
    const response = await axiosInstance.put('/notifications/mark-all-read');
    return response.data;
};

export const getBlockedUsers = async () => {
  const response = await axiosInstance.get('/users/blocked');
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await axiosInstance.post(`/users/block/${userId}`);
  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await axiosInstance.delete(`/users/block/${userId}`);
  return response.data;
};