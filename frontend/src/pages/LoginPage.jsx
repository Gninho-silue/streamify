"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { login } from "../lib/api"
import { ShipWheelIcon, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"
import { Link, useNavigate } from "react-router"

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
      navigate("/")
    },
  })

  const handleLoginChange = (e) => {
    e.preventDefault()
    loginMutation(loginData)
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center p-4">
        <div className="card bg-base-100 w-full max-w-6xl shadow-2xl border border-base-300 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* LOGIN FORM SECTION */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              {/* LOGO */}
              <div className="mb-8 flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <ShipWheelIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
                  <p className="text-sm text-base-content/60 font-medium">Language Exchange Platform</p>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                  <div className="alert alert-error mb-6 shadow-lg animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-error-content rounded-full flex items-center justify-center">
                        <span className="text-error text-xs font-bold">!</span>
                      </div>
                      <span>{error.response?.data?.message || "An error occurred during login."}</span>
                    </div>
                  </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Welcome Back!
                  </h1>
                  <p className="text-base-content/70 text-lg">
                    Continue your language learning journey with friends from around the world
                  </p>
                </div>

                <form onSubmit={handleLoginChange} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </span>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="input input-bordered input-lg focus:input-primary"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </span>
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="input input-bordered input-lg focus:input-primary"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                    />
                    <label className="label">
                      <a href="#" className="label-text-alt link link-hover link-primary">
                        Forgot password?
                      </a>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-full gap-2 group" disabled={isPending}>
                    {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Signing in...
                        </>
                    ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                    )}
                  </button>

                  <div className="divider">or</div>

                  <div className="text-center">
                    <p className="text-base-content/70">
                      Don't have an account?{" "}
                      <Link to="/signup" className="link link-primary font-medium hover:link-hover">
                        Create one now
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* WELCOME IMAGE SECTION */}
            <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center p-12">
              <div className="text-center space-y-8 max-w-md">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
                  <img
                      src="/login-image.png"
                      alt="Language Learning Community"
                      className="relative w-80 h-80 object-cover rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Join Our Community</span>
                    <Sparkles className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold">Connect with Language Partners Worldwide</h2>
                  <p className="text-base-content/70 leading-relaxed">
                    Practice languages with native speakers, make friends, and accelerate your learning journey in a
                    supportive community.
                  </p>
                  <div className="flex justify-center gap-4 pt-4">
                    <div className="badge badge-primary badge-lg">🌍 Global Community</div>
                    <div className="badge badge-secondary badge-lg">💬 Real Conversations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default LoginPage
