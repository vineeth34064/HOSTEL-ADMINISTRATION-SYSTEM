import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as api from '../../services/api';
import { BarChartIcon, QrCodeIcon, FileTextIcon, MessageSquareIcon, BedDoubleIcon, CreditCardIcon, UtensilsIcon, PackageIcon, AlertTriangleIcon, SearchIcon, TrophyIcon, UserIcon, BellIcon, ActivityIcon } from '../Icons';
import Sidebar from '../common/Sidebar';
import AdminDashboard from './AdminDashboard';
import GatePassManagement from './GatePassManagement';
import LeaveManagement from './LeaveManagement';
import ComplaintManagement from './ComplaintManagement';
import RoomAllocation from './RoomAllocation';
import FeeStatus from './FeeStatus';
import MessMenuEditor from './MessMenuEditor';
import ParcelManagement from './ParcelManagement';
import EmergencyManagement from './EmergencyManagement';
import LostAndFoundManagement from './LostAndFoundManagement';
import AdminNotifications from './AdminNotifications';
import ChatView from '../common/ChatView';
import SportsView from '../student/SportsView';
import AntiRaggingView from '../common/AntiRaggingView';
import ProfilePage from '../common/ProfilePage';
import AdminHealthRecords from './AdminHealthRecords';

const AdminPortal = ({ user, onLogout, isDarkMode, setIsDarkMode }) => {
    const [adminData, setAdminData] = useState(null);
    const location = useLocation();

    // Determine active name for header
    const activeView = location.pathname.substring(1) || 'dashboard';

    const fetchData = useCallback(async () => {
        try {
            const data = await api.getAdminData();
            setAdminData(data);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChartIcon },
        { id: 'profile', label: 'Admin Profile', icon: UserIcon },
        { id: 'health', label: 'Health Records', icon: ActivityIcon },
        { id: 'chat', label: 'Messaging', icon: MessageSquareIcon },
        { id: 'sports', label: 'Sports Arena', icon: TrophyIcon },
        { id: 'gatepass', label: 'Gate Pass', icon: QrCodeIcon },
        { id: 'leave', label: 'Leave Requests', icon: FileTextIcon },
        { id: 'complaints', label: 'Complaints', icon: AlertTriangleIcon },
        { id: 'antiragging', label: 'Anti-Ragging', icon: AlertTriangleIcon },
        { id: 'rooms', label: 'Rooms', icon: BedDoubleIcon },
        { id: 'fees', label: 'Fees', icon: CreditCardIcon },
        { id: 'mess', label: 'Dining', icon: UtensilsIcon },
        { id: 'parcels', label: 'Registry', icon: PackageIcon },
        { id: 'notifications', label: 'Broadcasts', icon: BellIcon },
        { id: 'emergency', label: 'Emergency', icon: AlertTriangleIcon },
        { id: 'lost-found', label: 'Lost & Found', icon: SearchIcon },
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
            
            <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '1.5rem' }} className="custom-scrollbar">
                <div key={activeView} className="hms-fade-up" style={{ width: '100%', paddingBottom: '2rem' }}>
                    <div className="hms-page-header">
                        <div>
                            <div className="hms-page-title" style={{ textTransform: 'capitalize' }}>
                                {activeView.replace('-', ' ')}
                            </div>
                        </div>
                    </div>
                    
                    {adminData ? (
                        <Routes>
                            <Route path="/" element={<AdminDashboard analytics={adminData.analytics} />} />
                            <Route path="/dashboard" element={<AdminDashboard analytics={adminData.analytics} />} />
                            <Route path="/profile" element={<ProfilePage user={user} isAdmin />} />
                            <Route path="/health" element={<AdminHealthRecords />} />
                            <Route path="/gatepass" element={<GatePassManagement requests={adminData.gatePassRequests} refreshData={fetchData} />} />
                            <Route path="/leave" element={<LeaveManagement requests={adminData.leaveRequests} refreshData={fetchData} />} />
                            <Route path="/complaints" element={<ComplaintManagement requests={adminData.complaints} refreshData={fetchData} />} />
                            <Route path="/rooms" element={<RoomAllocation rooms={adminData.rooms} students={adminData.students} refreshData={fetchData} />} />
                            <Route path="/fees" element={<FeeStatus students={adminData.students} refreshData={fetchData} />} />
                            <Route path="/mess" element={<MessMenuEditor menu={adminData.messMenu} refreshData={fetchData} />} />
                            <Route path="/parcels" element={<ParcelManagement parcels={adminData.parcels} students={adminData.students} refreshData={fetchData} />} />
                            <Route path="/emergency" element={<EmergencyManagement alerts={adminData.emergencyAlerts} refreshData={fetchData} />} />
                            <Route path="/lost-found" element={<LostAndFoundManagement items={adminData.lostAndFoundItems} refreshData={fetchData} />} />
                            <Route path="/notifications" element={<AdminNotifications />} />
                            <Route path="/chat" element={<ChatView user={user} />} />
                            <Route path="/sports" element={<SportsView user={user} isAdmin />} />
                            <Route path="/antiragging" element={<AntiRaggingView user={user} />} />
                        </Routes>
                    ) : (
                        <div className="h-[60vh] flex items-center justify-center dark:text-white text-lg font-bold animate-pulse">Initializing Systems...</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPortal;
