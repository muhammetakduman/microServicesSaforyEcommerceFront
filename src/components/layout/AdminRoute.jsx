import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute({ children }) {
    const { isAuthenticated, role } = useSelector(state => state.auth);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (role !== 'ADMIN') return <Navigate to="/" replace />;
    return children;
}
