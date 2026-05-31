import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({

    currentUser: null,
    loading: false,
    isAuthenticated: false,
    error: null,

    registeruser: async (data) => {

        try {

            const formData = new FormData()

            formData.append("firstname", data.firstname)
            formData.append("lastname", data.lastname)
            formData.append("email", data.email)
            formData.append("password", data.password)
            formData.append("phoneNo", data.phoneNo)
            formData.append("gender", data.gender)
            formData.append("campus", data.campus)

            formData.append(
                "profileImageUrl",
                data.profileImageUrl[0]
            )

            const res = await axios.post(
                "http://localhost:5000/user-api/register",
                formData,
                {
                    withCredentials: true
                }
            )

            return res

        }
        catch (err) {

            console.log(err)
            throw err

        }

    },
    login: async (data) => {

        set({
            loading: true,
            error: null
        });

        try {
            const res = await axios.post(
                "http://localhost:5000/common-api/login",
                data, { withCredentials: true }
            );

            if (res) {
                set({
                    currentUser: res.data.payload,
                    isAuthenticated: true,
                    loading: false
                });
            }

            return res;

        } catch (err) {

            set({
                error: err.message,
                loading: false,
                isAuthenticated: false
            });

            console.log(err);
        }
    },
    logout: async () => {
        set({
            loading: true,
            error: null
        });
        try {
            const res = await axios.get('http://localhost:5000/common-api/logout', {
                withCredentials: true
            })
            set({
                currentUser: null,
                isAuthenticated: false,
                error: null,
                loading: false
            })
        }
        catch (err) {
            set({
                error: err.message,
                loading: false,
                isAuthenticated: false
            })
            console.log(err);
        }
    },
    refresh: async () => {
        set({
            loading: true,
            error: null
        });
        try {
            const res = await axios.get('http://localhost:5000/common-api/refresh', {
                withCredentials: true
            })
            console.log(res)
            set({
                currentUser: res.data.payload,
                isAuthenticated: true,
                error: null,
                loading: false
            })
        }
        catch (err) {
            set({
                error: err.message,
                loading: false,
                isAuthenticated: false
            })
            console.log(err);
        }
    }

}));