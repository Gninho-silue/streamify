import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";


const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [clientError, setClientError] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signupMutation, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("authUser"),
      });
      navigate("/login");
    },
  });

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setClientError(null);

    if (signupData.password !== signupData.confirmPassword) {
      setClientError("Passwords do not match.");
      return;
    }

    signupMutation(signupData);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGN UP FORM */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>
            
            {error && (
              <div className="alert alert-error shadow-lg mb-4">
                {error.response?.data?.message ||
                  "An error occurred during sign up."}
              </div>
            )}

          {/* SIGN UP FORM */}
          <div className="w-full">
            <form onSubmit={handleSignupSubmit}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join us to start your learning language journey
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      required
                    />
                    <small className="text-xs opacity-70">
                      Password must be at least 6 characters long
                    </small>
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      className="input input-bordered w-full"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({ ...signupData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="label-text">
                        I agree to the{" "}
                        <a href="#" className="link link-primary">
                          Terms and Conditions
                        </a>
                      </span>
                    </label>
                  </div>
                </div>

                {/* 🔴 Error messages */}
                {clientError && (
                  <div className="text-sm text-red-500">{clientError}</div>
                )}

                {/* ✅ Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing Up...
                    </>
                  ):(
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="link link-primary">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGN UP IMAGE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/signup-image.png"
                alt="Sign Up"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-semibold">Welcome to Streamify</h2>
              <p className="text-sm opacity-70">
                Join our community and start learning languages with ease.
              </p>
              <p className="text-xs opacity-50">
                Your journey to fluency starts here!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
