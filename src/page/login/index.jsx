import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { email });

    const enteredSecretCode = secretCode.join("");
    
    if (email === "admin@gmail.com" && password === "123" && enteredSecretCode === "5050") {
      // Store login state in local storage to match ProtectedRoute check
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("loginTime", new Date().toISOString());
      console.log("Login successful, navigating to admin panel");
      navigate("/admin");
    } else {
      setError("Invalid email, password, or secret code");
      console.log("Login failed: Invalid credentials");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const handleSecretCodeChange = (index, value) => {
    // Only allow single digit
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newSecretCode = [...secretCode];
      newSecretCode[index] = value;
      setSecretCode(newSecretCode);
      
      // Auto-focus next input if current is filled
      if (value && index < 3) {
        const nextInput = document.getElementById(`secret-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const backbtn = ()=>{
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full shadow-lg  px-4 py-3 flex flex-col">
        <div>
          <h2 className="mt-6 text-center text-[30px] font-medium text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleLogin}>
          <div className="rounded-md  flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                maxLength={20}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex  gap-2 py-5 flex-col">
              <div className="w-full  flex items-center justify-center">
                <label className="font-[600]" htmlFor="">
                  {" "}
                  secret code
                </label>
              </div>
              <div className="w-full flex items-center justify-center gap-5">
                {secretCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`secret-${index}`}
                    maxLength={1}
                    className="w-12 text-center focus:border-gray-300 border rounded-xl border-gray-400 h-12"
                    type="text"
                    value={digit}
                    onChange={(e) => handleSecretCodeChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      // Handle backspace to go to previous input
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const prevInput = document.getElementById(`secret-${index - 1}`);
                        if (prevInput) prevInput.focus();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="py-5 flex items-center justify-end">
          <button   onClick={backbtn} className=" border  text-[14px] hover:bg-gray-400 duration-600 hover:text-gray-100  bg-gray-200 px-2 py-1 rounded-md border-gray-400">back to home</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
