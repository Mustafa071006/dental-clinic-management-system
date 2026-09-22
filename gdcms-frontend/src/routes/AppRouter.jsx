import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useAuth from '../hooks/useAuth';

// Auth
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() =>import('../pages/auth/ForgotPasswordPage'));

// Admin
const AdminDashboard = lazy(() => import('../pages/admin/DashboardPage'));
const AdminPatients = lazy(() => import('../pages/admin/PatientsPage'));
const AdminAddPatient = lazy(() => import('../pages/admin/AddPatientPage'));
const AdminPatientDetail = lazy(() => import('../pages/admin/PatientDetailPage'));
const AdminExaminations = lazy(() => import('../pages/admin/ExaminationsPage'));
const AdminControlSchedule = lazy(() => import('../pages/admin/ControlSchedulePage'));
const AdminDoctors = lazy(() => import('../pages/admin/DoctorsPage'));
const AdminTransfers = lazy(() => import('../pages/admin/TransfersPage'));

// Doctor
const DoctorDashboard = lazy(() => import('../pages/doctor/DashboardPage'));
const DoctorPatients = lazy(() => import('../pages/doctor/MyPatientsPage'));
const DoctorAddPatient = lazy(() => import('../pages/doctor/AddPatientPage'));
const DoctorPatientDetail = lazy(() =>import('../pages/doctor/PatientDetailPage'));
const DoctorAddExamination = lazy(() => import('../pages/doctor/AddExaminationPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#f5f6fa]">
    <LoadingSpinner size="lg" />
  </div>
);

const RootRedirect = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/doctor/dashboard" replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password"element={<ForgotPasswordPage />}/>
          <Route element={<ProtectedRoute />}>

            {/* Admin */}
            <Route element={<RoleRoute allowedRole="ADMIN" />}>
            <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/patients/add" element={<AdminAddPatient />} />
            <Route path="/admin/patients/:id"element={<AdminPatientDetail />}/>
            <Route path="/admin/examinations" element={<AdminExaminations />} />
            <Route path="/admin/control-schedule" element={<AdminControlSchedule />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/transfers" element={<AdminTransfers />} />
                  </Route>
                </Route>

            {/* Doctor */}
            <Route element={<RoleRoute allowedRole="DOCTOR" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/patients" element={<DoctorPatients />} />
                <Route path="/doctor/patients/add" element={<DoctorAddPatient />} />
                <Route path="/doctor/patients/:id"element={<DoctorPatientDetail />}/>
                <Route path="/doctor/patients/:id/add-examination"element={<DoctorAddExamination />}/>
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;