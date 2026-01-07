import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if(!context){
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context;
}

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    // guard against stringified 'undefined' or 'null' values
    const validToken = token && token !== 'undefined' && token !== 'null'
    if(validToken && userData){
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)

      // backend may send token under different keys; handle common variants
      const {
        user: userData,
        access_token,
        accessToken,
        token: tokenField,
        acces_token // handle potential misspelling
      } = response || {}

      const token = access_token || accessToken || tokenField || acces_token

      if(token){
        localStorage.setItem('token', token)
      } else {
        // don't store undefined/null strings
        console.warn('Login response did not include a token')
      }

      if(userData){
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login Failed'
      }
    }
  }

  const face_login = async (credentials) => {
    try {
      const response = await authService.face_login(credentials)

      // backend may send token under different keys; handle common variants
      const {
        user: userData,
        access_token,
        accessToken,
        token: tokenField,
        acces_token // handle potential misspelling
      } = response || {}

      const token = access_token || accessToken || tokenField || acces_token

      if(token){
        localStorage.setItem('token', token)
      } else {
        // don't store undefined/null strings
        console.warn('Login response did not include a token')
      }

      if(userData){
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login Failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    login,
    face_login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )

}