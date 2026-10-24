import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  

useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => {
    setError('');
  }, 5000);

  return () => clearTimeout(timer);
}, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/doctor/dashboard', {
        replace: true,
      });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const data = await authService.login(formData.email, formData.password);
      if (data.success && data.token && data.user) {
        login(data.token, data.user);
        navigate(
          data.user.role === 'ADMIN' ? '/admin/dashboard' : '/doctor/dashboard',
          { replace: true }
        );
      } else {
        setError('Login gagal. Periksa kembali email dan password Anda.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Login gagal. Silakan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* ── KIRI — hero dengan foto background ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-fadeIn">

        {/* Layer 1 — foto background dental */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80')`,
          }}
        />

        {/* Layer 2 — overlay navy gelap */}
        <div className="absolute inset-0 bg-[#0d1e35]/75" />

        {/* Layer 3 — konten teks, posisi tengah-bawah */}
        <div className="relative z-10 flex flex-col justify-end p-14 pb-16 w-full">
          <h1 className="text-white font-bold text-5xl leading-tight mb-5">
            Golden Dental
            <br />
            Center
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            Sistem manajemen klinik premium. Permudah operasional
            praktik Anda dengan fitur yang modern dan intuitif.
          </p>
        </div>
      </div>

      {/* ── KANAN — form login ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 sm:px-10">
        <div className="w-full max-w-md animate-fadeInUp">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[#12223a] font-bold text-3xl mb-2">
              Selamat Datang Kembali
            </h2>
            <p className="text-gray-500 text-sm">
              Silakan masukkan data Anda untuk login.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#12223a] mb-1.5"
              >
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={16} strokeWidth={1.8} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@goldendental.com"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                    text-[#12223a] placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[#12223a]/20
                    focus:border-gray-300 transition-colors
                    ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
                  `}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#12223a]">
                  Password
                </label>
                <button
  type="button"
  onClick={() => navigate('/forgot-password')}
  className="text-sm font-semibold text-[#12223a] hover:text-[#d4af37] transition-colors">
  Lupa password?
</button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} strokeWidth={1.8} />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                    text-[#12223a] placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[#12223a]/20
                    focus:border-gray-300 transition-colors
                    ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
                  `}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-slideDown">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full py-3.5"
            >
              {isLoading ? (
                'Sedang login...'
              ) : (
                <>
                  Login
                  <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </Button>

            {/* Tip */}
            <p className="text-center text-xs text-gray-400 pt-1">
              Tips: Gunakan kata &apos;admin&apos; pada email untuk peran Admin,
              selain itu untuk peran Dokter.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;