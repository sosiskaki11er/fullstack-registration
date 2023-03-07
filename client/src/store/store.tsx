import { IUser } from "../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../service/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool:boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user =  user;
    }

    setLoading(bool:boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try{
            const response = await AuthService.login(email, password);
            localStorage.setItem('user', response.data.user.email);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    async registration(email: string, password: string) {
        try{
            const response = await AuthService.registration(email, password);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', response.data.user.email);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    async logout() {
        try{
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user')
            this.setAuth(false);
            this.setUser({} as IUser)
        } catch (e) {
            
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            if(this.user.status === 'blocked') {
                await AuthService.logout
            }
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e){

        } finally {
            this.setLoading(false)
        }
    }

    async blockUser(email:string) {
        try{
            const response = await AuthService.blockUser(email);
        } catch (e) {

        }
    }

    async unblockUser(email:string) {
        try{
            const response = await AuthService.unblockUser(email)
        } catch(e) {

        }
    }

    async deleteUser(email: string) {
        try{
            const response = await AuthService.deleteUser(email);
        } catch (e) {
            
        }
    }
}