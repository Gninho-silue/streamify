import { axiosInstance } from "./axios.js";

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

export const getStreamToken = async () => {
    const response = await axiosInstance.get('/auth/stream-token');
    return { token: response.data.chatToken };
};

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

export const getUserPublicProfile = async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
};

// Group APIs
export const createGroup = async (groupData) => {
    const response = await axiosInstance.post('/groups', groupData);
    return response.data;
};

export const getPublicGroups = async () => {
    const response = await axiosInstance.get('/groups/public');
    return response.data;
};

export const getUserGroups = async () => {
    const response = await axiosInstance.get('/groups/my-groups');
    return response.data;
};

export const getGroupById = async (groupId) => {
    const response = await axiosInstance.get(`/groups/${groupId}`);
    return response.data;
};

export const joinGroup = async (groupId) => {
    const response = await axiosInstance.post(`/groups/${groupId}/join`);
    return response.data;
};

export const leaveGroup = async (groupId) => {
    const response = await axiosInstance.post(`/groups/${groupId}/leave`);
    return response.data;
};

export const updateGroup = async (groupId, updateData) => {
    const response = await axiosInstance.put(`/groups/${groupId}`, updateData);
    return response.data;
};

export const deleteGroup = async (groupId) => {
    const response = await axiosInstance.delete(`/groups/${groupId}`);
    return response.data;
};

export const searchGroups = async (params) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/groups/search?${queryParams}`);
      return response.data;
};

export const getAvailableRoles = async () => {
    const response = await axiosInstance.get('/groups/roles');
    return response.data;
};

// Promouvoir un membre
export const promoteMember = async (groupId, memberId, newRole) => {
    const response = await axiosInstance.post(`/groups/${groupId}/members/promote`, {
        memberId,
        newRole
    });
    return response.data;
};

// Rétrograder un membre
export const demoteMember = async (groupId, memberId, newRole) => {
    const response = await axiosInstance.post(`/groups/${groupId}/members/demote`, {
        memberId,
        newRole
    });
    return response.data;
};

// Supprimer un membre
export const removeMember = async (groupId, memberId) => {
    const response = await axiosInstance.post(`/groups/${groupId}/members/remove`, {
        memberId
    });
    return response.data;
};
