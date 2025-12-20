import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Landing } from '@/routes/Landing';
import { Subscribe } from '@/routes/Subscribe';
import { Payment } from '@/routes/Payment';
import { SetupPassword } from '@/routes/SetupPassword';
import { Login } from '@/routes/Login';
import { Dashboard } from '@/routes/Dashboard';
import { BillingPortal } from '@/routes/BillingPortal';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/setup-password/:token" element={<SetupPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/billing" element={<BillingPortal />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
