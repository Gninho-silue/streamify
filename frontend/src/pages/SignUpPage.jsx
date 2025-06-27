"use client"

import { useState } from "react"
import { ShipWheelIcon, User, Mail, Lock, Shield, ArrowRight, Sparkles, CheckCircle } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signup } from "../lib/api"

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [clientError, setClientError] = useState(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("authUser"),
      })
      navigate("/login")
    },
  })

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    setClientError(null)

    if (signupData.password !== signupData.confirmPassword) {
      setClientError("Passwords do not match.")
      return
    }

    if (signupData.password.length < 6) {
      setClientError("Password must be at least 6 characters long.")
      return
    }

    if (!agreedToTerms) {
      setClientError("Please agree to the Terms and Conditions.")
      return
    }

    signupMutation(signupData)
  }

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" }
    if (password.length < 6) return { strength: 1, text: "Weak", color: "text-error" }
    if (password.length < 10) return { strength: 2, text: "Good", color: "text-warning" }
    return { strength: 3, text: "Strong", color: "text-success" }
  }

  const passwordStrength = getPasswordStrength(signupData.password)

  return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center p-4">
        <div className="card bg-base-100 w-full max-w-6xl shadow-2xl border border-base-300 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* SIGN UP FORM */}
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

              {/* ERROR MESSAGES */}
              {(error || clientError) && (
                  <div className="alert alert-error mb-6 shadow-lg animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-error-content rounded-full flex items-center justify-center">
                        <span className="text-error text-xs font-bold">!</span>
                      </div>
                      <span>{clientError || error?.response?.data?.message || "An error occurred during sign up."}</span>
                    </div>
                  </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Join Streamify
                  </h1>
                  <p className="text-base-content/70 text-lg">
                    Start your language learning adventure with a global community
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        className="input input-bordered input-lg focus:input-primary"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </span>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="input input-bordered input-lg focus:input-primary"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
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
                        placeholder="Create a strong password"
                        className="input input-bordered input-lg focus:input-primary"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                    />
                    {signupData.password && (
                        <div className="label">
                      <span className={`label-text-alt ${passwordStrength.color} font-medium`}>
                        Password strength: {passwordStrength.text}
                      </span>
                          <div className="flex gap-1">
                            {[1, 2, 3].map((level) => (
                                <div
                                    key={level}
                                    className={`w-2 h-2 rounded-full ${
                                        level <= passwordStrength.strength
                                            ? level === 1
                                                ? "bg-error"
                                                : level === 2
                                                    ? "bg-warning"
                                                    : "bg-success"
                                            : "bg-base-300"
                                    }`}
                                />
                            ))}
                          </div>
                        </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Confirm Password
                    </span>
                    </label>
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        className="input input-bordered input-lg focus:input-primary"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                    />
                    {signupData.confirmPassword && (
                        <div className="label">
                      <span
                          className={`label-text-alt font-medium ${
                              signupData.password === signupData.confirmPassword ? "text-success" : "text-error"
                          }`}
                      >
                        {signupData.password === signupData.confirmPassword ? (
                            <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Passwords match
                          </span>
                        ) : (
                            "Passwords don't match"
                        )}
                      </span>
                        </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          required
                      />
                      <span className="label-text">
                      I agree to the{" "}
                        <a href="#" className="link link-primary font-medium">
                        Terms and Conditions
                      </a>{" "}
                        and{" "}
                        <a href="#" className="link link-primary font-medium">
                        Privacy Policy
                      </a>
                    </span>
                    </label>
                  </div>

                  <button
                      type="submit"
                      className="btn btn-primary btn-lg w-full gap-2 group"
                      disabled={isPending || !agreedToTerms}
                  >
                    {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Creating Account...
                        </>
                    ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                    )}
                  </button>

                  <div className="divider">or</div>

                  <div className="text-center">
                    <p className="text-base-content/70">
                      Already have an account?{" "}
                      <Link to="/login" className="link link-primary font-medium hover:link-hover">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* WELCOME IMAGE SECTION */}
            <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-secondary/20 to-accent/20 items-center justify-center p-12">
              <div className="text-center space-y-8 max-w-md">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl"></div>
                  <img
                      src="/signup-image.png"
                      alt="Join Language Learning Community"
                      className="relative w-80 h-80 object-cover rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-secondary" />
                    <span className="font-bold text-lg">Welcome to Streamify</span>
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold">Your Language Journey Starts Here</h2>
                  <p className="text-base-content/70 leading-relaxed">
                    Join thousands of language learners, connect with native speakers, and make learning fun through
                    meaningful conversations and cultural exchange.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="badge badge-secondary badge-lg">🎯 Personalized Learning</div>
                    <div className="badge badge-accent badge-lg">🤝 Real Connections</div>
                    <div className="badge badge-primary badge-lg">🌟 Progress Tracking</div>
                    <div className="badge badge-success badge-lg">🎉 Fun Community</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default SignUpPage
