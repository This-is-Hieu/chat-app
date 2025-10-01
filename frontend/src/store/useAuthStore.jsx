import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import {io} from "socket.io-client"

const BASE_URL = "http://localhost:5001"

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isCheckingAuth: true,
    isLoggingIng: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket:null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check");
            
            set({authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth",error)
            set({ authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});
        try {   
            const res = await axiosInstance.post("/auth/signup",data);
            get().connectSocket();
            alert("Tạo tài khoản thành công");
            set({authUser: true});
        } catch (error) {
            alert("Có lỗi xảy ra: ", error);
        } finally {
            set({isSigningUp: false});
        }
    },

    login: async (data) => {
        set({isLoggingIng: true});
        try {
            const res = await axiosInstance.post('auth/login',data);
            set({authUser: res.data});
            alert("Đăng nhập thành công");
            get().connectSocket();
        } catch (error) {
            alert("Đăng nhập không thành công: " + error.message);
        } finally {
            set({isLoggingIng: false});
        }

    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null });
            alert("Đăng xuất thành công");
        } catch (error) {
            alert("Đăng xuất không thành công");
        }
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile : true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({ authUser: res.data});
            alert("Cập nhật ảnh đại diện thành công");
        } catch {
            alert("Cập nhật ảnh đại diện không thành công");
        } finally {
            set({isUpdatingProfile : false});
        }
    },

    connectSocket: async () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: { userId: authUser._id },
        });

        socket.connect();
        set({ socket });

        // Cập nhật danh sách online users
        socket.on("getOnlineUser", (userIds) => {
            set({ onlineUsers: userIds });
        });

        // Realtime khi có lời mời kết bạn mới
        socket.on("friendRequestReceived", (requests) => {
            set({ pendingRequests: requests });
        });

        // Realtime khi lời mời được chấp nhận
        socket.on("friendRequestAccepted", (newFriend) => {
            set((state) => ({ friends: [...state.friends, newFriend] }));
        });

        // Realtime khi bạn bị từ chối (nếu muốn)
        socket.on("friendRequestDenied", (userId) => {
            set((state) => ({
                pendingRequests: state.pendingRequests.filter((id) => id !== userId)
            }));
        });
    },

    disconnectSocket: async () => {
        if (get().socket?.connected) get().socket.disconnect();
        set({ socket: null, onlineUsers: [], pendingRequests: [], friends: [] });
    }
    
}));