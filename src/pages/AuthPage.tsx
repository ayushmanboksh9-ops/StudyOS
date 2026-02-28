import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import OTPInput from "@/components/features/OTPInput";
import { toast } from "sonner";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, loginWithGoogle, verifyOTP, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // OAuth redirects automatically
    } catch (error) {
      setLoading(false);
      console.error('Google login error:', error);
    }
  };

  // Send OTP to email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      await login(email);
      setStep("otp");
      setCountdown(60);
    } catch (error) {
      console.error('Send OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      await login(email);
      setCountdown(60);
      toast.success('New code sent!');
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (code: string) => {
    setLoading(true);
    try {
      await verifyOTP(email, code);
      navigate('/dashboard');
    } catch (error) {
      console.error('Verify OTP error:', error);
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen paper-texture flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50 to-white opacity-70" />
      
      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <Card className="shadow-2xl border-2 border-white/50 backdrop-blur-sm animate-fade-in">
          <CardHeader className="space-y-1 pb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg animate-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              {step === "email" ? "Welcome to StudyOS" : "Check Your Email"}
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              {step === "email" 
                ? "Login or create your account to get started" 
                : `We sent a 4-digit code to ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email Step */}
            {step === "email" && (
              <>
                {/* Google Login Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 border-2 hover:border-violet-300 hover:bg-violet-50 transition-all text-base font-medium"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">Or continue with email</span>
                  </div>
                </div>

                {/* Email OTP Form */}
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 text-base">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="mt-2 h-12 text-base"
                      autoComplete="email"
                      autoFocus
                      disabled={loading}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 gradient-primary text-white text-base font-medium" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      "Send Login Code"
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 pt-2">
                    We'll email you a secure 4-digit code
                  </p>
                </form>
              </>
            )}

            {/* OTP Verification Step */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-violet-600" />
                  </div>
                </div>

                <OTPInput
                  length={4}
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                  disabled={loading}
                />

                {loading && (
                  <div className="flex items-center justify-center gap-2 text-violet-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Verifying...</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Didn't receive the code?
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || loading}
                      className="text-violet-600 hover:text-violet-700 font-medium"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setCountdown(0);
                    }}
                    className="w-full"
                    disabled={loading}
                  >
                    Change Email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <p className="text-center text-xs text-gray-500 mt-6">
          🔒 Secure authentication powered by OnSpace Cloud
        </p>
      </div>
    </div>
  );
}
