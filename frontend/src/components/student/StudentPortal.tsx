import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../types';
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
import ChatView from '../common/ChatView.tsx';
import SportsView from './SportsView.tsx';
import AntiRaggingView from '../common/AntiRaggingView.tsx';
import ProfilePage from '../common/ProfilePage.tsx';
import HealthRecordView from './HealthRecordView.tsx';

const StudentPortal: React.FC<{ 
    user: User; 
    onLogout: () => void;
    isDarkMode: boolean;
    setIsDarkMode: (val: boolean) => void;
}> = ({ user, onLogout, isDarkMode, setIsDarkMode }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [studentData, setStudentData] = useState<any | null>(null);

    const fetchData = useCallback(async () => {
        const data = await api.getStudentData(user.id);
        setStudentData(data);
    }, [user.id]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderView = () => {
        switch (activeView) {
            case 'profile': return <ProfilePage user={studentData?.user || user} room={studentData?.room} />;
            case 'health': return <HealthRecordView user={studentData?.user || user} />;
            case 'gatepass': return <GatePassView user={studentData?.user} gatePass={studentData?.gatePass} room={studentData?.room} refreshData={fetchData} />;
            case 'leave': return <LeaveRequestView user={user} leaves={studentData?.leaves} refreshData={fetchData} />;
            case 'complaint': return <ComplaintView user={user} complaints={studentData?.complaints} refreshData={fetchData} />;
            case 'payment': return <FeePaymentView user={user} />;
            case 'mess': return <MessMenuView menu={studentData?.messMenu} />;
            case 'parcel': return <ParcelView user={user} parcels={studentData?.parcels} refreshData={fetchData}/>;
            case 'emergency': return <EmergencyView user={user} alerts={studentData?.emergencyAlerts} refreshData={fetchData} />;
            case 'lost-found': return <LostAndFoundView user={user} items={studentData?.lostAndFoundItems} refreshData={fetchData} />;
            case 'chat': return <ChatView user={user} />;
            case 'sports': return <SportsView user={user} />;
            case 'antiragging': return <AntiRaggingView user={user} />;
            default: return <StudentDashboard user={studentData?.user || user} notifications={studentData?.notifications} />;
        }
    };
    
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
                activeView={activeView}
                setActiveView={setActiveView}
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
                    {studentData ? renderView() : (
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