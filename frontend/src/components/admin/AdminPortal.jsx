import React, { useState, useEffect, useCallback } from 'react';
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
    const [activeView, setActiveView] = useState('dashboard');
    const [adminData, setAdminData] = useState(null);
    const fetchData = useCallback(async () => {
        const data = await api.getAdminData();
        setAdminData(data);
    }, []);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const renderView = () => {
        if (!adminData)
            return <div className="h-[60vh] flex items-center justify-center dark:text-white text-lg font-bold animate-pulse">Initializing Systems...</div>;
        switch (activeView) {
            case 'profile': return <ProfilePage user={user} isAdmin/>;
            case 'health': return <AdminHealthRecords />;
            case 'gatepass': return <GatePassManagement requests={adminData.gatePassRequests} refreshData={fetchData}/>;
            case 'leave': return <LeaveManagement requests={adminData.leaveRequests} refreshData={fetchData}/>;
            case 'complaints': return <ComplaintManagement requests={adminData.complaints} refreshData={fetchData}/>;
            case 'rooms': return <RoomAllocation rooms={adminData.rooms} students={adminData.students} refreshData={fetchData}/>;
            case 'fees': return <FeeStatus students={adminData.students} refreshData={fetchData}/>;
            case 'mess': return <MessMenuEditor menu={adminData.messMenu} refreshData={fetchData}/>;
            case 'parcels': return <ParcelManagement parcels={adminData.parcels} students={adminData.students} refreshData={fetchData}/>;
            case 'emergency': return <EmergencyManagement alerts={adminData.emergencyAlerts} refreshData={fetchData}/>;
            case 'lost-found': return <LostAndFoundManagement items={adminData.lostAndFoundItems} refreshData={fetchData}/>;
            case 'notifications': return <AdminNotifications />;
            case 'chat': return <ChatView user={user}/>;
            case 'sports': return <SportsView user={user} isAdmin/>;
            case 'antiragging': return <AntiRaggingView user={user}/>;
            default: return <AdminDashboard analytics={adminData.analytics}/>;
        }
    };
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
    return (<div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: 'var(--bg2)' }}>
            <Sidebar navItems={navItems} activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} user={user} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
            <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '1.5rem' }} className="custom-scrollbar">
                <div key={activeView} className="hms-fade-up" style={{ width: '100%', paddingBottom: '2rem' }}>
                    <div className="hms-page-header">
                        <div>
                            <div className="hms-page-title" style={{ textTransform: 'capitalize' }}>
                                {activeView.replace('-', ' ')}
                            </div>
                        </div>
                    </div>
                    {renderView()}
                </div>
            </main>
        </div>);
};
export default AdminPortal;
