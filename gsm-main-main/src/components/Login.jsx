import React, { useState, useEffect } from 'react';
import axios from 'axios';
import gsmLogo from '../assets/gsm_logo.png';
import gsmbg from '../assets/gsmbg.png';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');

    // Update date and time
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            setCurrentDateTime(now.toLocaleDateString('en-US', options));
        };
        updateDateTime();
        const interval = setInterval(updateDateTime, 1000); // Update every second
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/login.php', {
                action: 'login',
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                // Call success callback (no localStorage storage)
                onLoginSuccess(response.data.data.user);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.code === 'ERR_NETWORK') {
                setError('Network Error: Unable to connect to the server. Please make sure your PHP server is running.');
            } else {
                setError('An error occurred during login. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative" style={{ 
            backgroundColor: '#FBFBFB',
            background: 'linear-gradient(135deg, rgba(240, 240, 240, 0.4) 0%, rgba(230, 230, 230, 0.4) 50%, rgba(220, 220, 220, 0.3) 100%)'
        }}>
            {/* Background Image */}
            <div 
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `url(${gsmbg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.08,
                    zIndex: 0,
                    top: '72px'
                }}
            />

            {/* Animated background particles */}
            <div 
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(253, 168, 17, 0.05) 0%, transparent 50%)
                    `,
                    zIndex: 1
                }}
            />

            {/* Header */}
            <header className="py-2 bg-white sticky top-0 z-50" style={{
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '3px solid #FDA811'
            }}>
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <img src={gsmLogo} alt="GSM Logo" className="h-10 w-auto" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold" style={{ fontWeight: 700 }}>
                                <span style={{ color: '#4A90E2' }}>Go</span>
                                <span style={{ color: '#4CAF50' }}>Serve</span>
                                <span style={{ color: '#4A90E2' }}>PH</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold">
                                {currentDateTime}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 pt-4 pb-12 flex-1 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Section - Tagline */}
                    <div className="text-center lg:text-left mt-2">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4 ml-2 lg:ml-4 animated-gradient-text">
                            Abot-Kamay mo ang Serbisyong Publiko!
                        </h2>
                        <style>{`
                            @keyframes gradientShift {
                                0% {
                                    background-position: 0% 50%;
                                }
                                50% {
                                    background-position: 100% 50%;
                                }
                                100% {
                                    background-position: 0% 50%;
                                }
                            }
                            
                            .animated-gradient-text {
                                background: linear-gradient(90deg, #4CAF50 0%, #4A90E2 50%, #4CAF50 100%);
                                background-size: 200% 200%;
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                                background-clip: text;
                                animation: gradientShift 3s ease infinite;
                            }
                        `}</style>
                    </div>

                    {/* Right Section - Login Form */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-auto w-full mt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Email Input */}
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter e-mail address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#4A90E2' }}
                            >
                                {loading ? 'Signing in...' : 'Login'}
                            </button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            {/* Google Button */}
                            <div>
                                <button
                                    type="button"
                                    className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                                        <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                                        <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                                        <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>
                            </div>

                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-gray-600">
                                    No account yet?{' '}
                                    <button type="button" className="font-semibold hover:underline" style={{ color: '#4A90E2' }}>
                                        Register here
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-white py-4 mt-8 relative z-10" style={{ backgroundColor: '#4CAF50' }}>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row justify-between items-center">
                        <div className="text-center lg:text-left mb-2 lg:mb-0">
                            <h3 className="text-lg font-bold mb-1">Government Services Management System</h3>
                            <p className="text-xs opacity-90">
                                For any inquiries, please call 122 or email helpdesk@gov.ph
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-3">
                                <button type="button" className="text-xs hover:underline">TERMS OF SERVICE</button>
                                <span>|</span>
                                <button type="button" className="text-xs hover:underline">PRIVACY POLICY</button>
                            </div>
                            <div className="flex space-x-2">
                                <a href="#" className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;
