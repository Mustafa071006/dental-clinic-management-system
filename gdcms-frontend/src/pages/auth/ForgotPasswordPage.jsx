import { useState } from 'react';
import { Mail, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const WHATSAPP_NUMBER = '6281222620166';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');

      const res = await api.post('/auth/forgot-password', {
        email,
      });

      setUserRole(res.data.role);
      setVerified(true);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          'Email not found.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappMessage =
    userRole === 'ADMIN'
      ? `Halo Developer, saya lupa password akun admin dengan email ${email}.`
      : `Halo Admin, saya lupa password akun dokter dengan email ${email}. Mohon bantu reset password saya.`;

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-fadeIn">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80')",
          }}
        />

        <div className="absolute inset-0 bg-[#0d1e35]/75" />

        <div className="relative z-10 flex flex-col justify-end p-14 pb-16 w-full">
          <h1 className="text-white font-bold text-5xl leading-tight mb-5">
            Golden Dental
            <br />
            Center
          </h1>

          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            Password recovery assistance for clinic staff and administrators.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 sm:px-10">
        <div className="w-full max-w-md animate-fadeInUp">

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#12223a] transition-colors duration-150 mb-8"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          <div className="mb-8">
            <h2 className="text-[#12223a] font-bold text-3xl mb-2">
              Forgot Password
            </h2>

            <p className="text-gray-500 text-sm">
              Enter your registered email address.
            </p>
          </div>

          {!verified ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-[#12223a] mb-1.5">
                  Email Address
                </label>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="example@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#12223a]/20 transition-colors duration-150"
                  />
                </div>
              </div>

              {message && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-slideDown">
                  <p className="text-red-600 text-sm">
                    {message}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                size="lg"
                className="w-full py-3.5"
              >
                {isLoading
                  ? 'Verifying...'
                  : 'Verify Email'}
              </Button>
            </form>
          ) : (
            <div className="space-y-5 animate-fadeInUp">

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-700 text-sm font-medium">
                  Email verified successfully.
                </p>
              </div>

              <div className="bg-[#f8f9fb] border border-gray-200 rounded-xl p-5">

                <h3 className="font-semibold text-[#12223a] mb-2">
                  {userRole === 'ADMIN'
                    ? 'Contact Developer'
                    : 'Contact Administrator'}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {userRole === 'ADMIN'
                    ? 'Please contact the developer to recover your administrator account.'
                    : 'Only administrators can reset doctor passwords. Please contact the administrator.'}
                </p>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white py-3.5 rounded-xl font-semibold transition-all duration-150"
              >
                <MessageCircle size={18} />
                Open WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;