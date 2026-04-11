import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as api from '../../services/api';
import { HomeIcon, UserIcon, QrCodeIcon, FileTextIcon, MessageSquareIcon, CreditCardIcon, UtensilsIcon, PackageIcon, AlertTriangleIcon, SearchIcon, TrophyIcon, ActivityIcon } from '../Icons';
import Sidebar from '../common/Sidebar';
import StudentDashboard from './StudentDashboard';
import GatePassView from './GatePassView';
import LeaveRequestView from './LeaveRequestView';
import ComplaintView from './ComplaintView';
import FeePaymentView from './FeePaymentView';
import MessMenuView from './MessMenuView';
import ParcelView from './ParcelView';
import EmergencyView from './EmergencyView';
import LostAndFoundView from './LostAndFoundView';
import ChatView from '../common/ChatView';
import SportsView from './SportsView';
import AntiRaggingView from '../common/AntiRaggingView';
import ProfilePage from '../common/ProfilePage';
import HealthRecordView from './HealthRecordView';

const StudentPortal = ({ user, onLogout, isDarkMode, setIsDarkMode }) => {
    const [studentData, setStudentData] = useState(null);
    const location = useLocation();
    
    // Determine active name for header
    const activeView = location.pathname.substring(1) || 'dashboard';

    const fetchData = useCallback(async () => {
        try {
            const data = await api.getStudentData(user.id);
            setStudentData(data);
        } catch (err) {
            console.error('Failed to fetch student data:', err);
        }
    }, [user.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'profile', label: 'My Profile', icon: UserIcon },
        { id: 'health', label: 'Health Record', icon: ActivityIcon },
        { id: 'chat', label: 'Direct Chat', icon: MessageSquareIcon },
        { id: 'sports', label: 'Sports Arena', icon: TrophyIcon },
        { id: 'gatepass', label: 'Gate Pass', icon: QrCodeIcon },
        { id: 'leave', label: 'Leave Request', icon: FileTextIcon },
        { id: 'complaint', label: 'Complaints', icon: MessageSquareIcon },
        { id: 'antiragging', label: 'Anti-Ragging', icon: AlertTriangleIcon },
        { id: 'lost-found', label: 'Lost & Found', icon: SearchIcon },
        { id: 'payment', label: 'Fee Payment', icon: CreditCardIcon },
        { id: 'mess', label: 'Mess Menu', icon: UtensilsIcon },
        { id: 'parcel', label: 'Parcel Info', icon: PackageIcon },
        { id: 'emergency', label: 'Emergency', icon: AlertTriangleIcon },
    ];

    return (
        <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: 'var(--bg2)' }}>
            <Sidebar 
                navItems={navItems} 
                onLogout={onLogout} 
                user={user} 
                isDarkMode={isDarkMode} 
                setIsDarkMode={setIsDarkMode} 
            />
            
            <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '1.5rem' }} className="custom-scrollbar print:overflow-visible print:p-0">
                <div key={activeView} className="hms-fade-up" style={{ width: '100%', paddingBottom: '2rem' }}>
                    <div className="hms-page-header print:hidden">
                        <div>
                            <div className="hms-page-title" style={{ textTransform: 'capitalize' }}>
                                {activeView.replace('-', ' ')}
                            </div>
                        </div>
                    </div>

                    {studentData ? (
                        <Routes>
                            <Route path="/" element={<StudentDashboard user={studentData.user || user} notifications={studentData.notifications} />} />
                            <Route path="/dashboard" element={<StudentDashboard user={studentData.user || user} notifications={studentData.notifications} />} />
                            <Route path="/profile" element={<ProfilePage user={studentData.user || user} room={studentData.room} />} />
                            <Route path="/health" element={<HealthRecordView user={studentData.user || user} />} />
                            <Route path="/gatepass" element={<GatePassView user={studentData.user} gatePass={studentData.gatePass} room={studentData.room} refreshData={fetchData} />} />
                            <Route path="/leave" element={<LeaveRequestView user={user} leaves={studentData.leaves} refreshData={fetchData} />} />
                            <Route path="/complaint" element={<ComplaintView user={user} complaints={studentData.complaints} refreshData={fetchData} />} />
                            <Route path="/payment" element={<FeePaymentView user={user} />} />
                            <Route path="/mess" element={<MessMenuView menu={studentData.messMenu} />} />
                            <Route path="/parcel" element={<ParcelView user={user} parcels={studentData.parcels} refreshData={fetchData} />} />
                            <Route path="/emergency" element={<EmergencyView user={user} alerts={studentData.emergencyAlerts} refreshData={fetchData} />} />
                            <Route path="/lost-found" element={<LostAndFoundView user={user} items={studentData.lostAndFoundItems} refreshData={fetchData} />} />
                            <Route path="/chat" element={<ChatView user={user} />} />
                            <Route path="/sports" element={<SportsView user={user} />} />
                            <Route path="/antiragging" element={<AntiRaggingView user={user} />} />
                        </Routes>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--muted)', fontSize: '13px' }}>
                            Loading…
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentPortal;
