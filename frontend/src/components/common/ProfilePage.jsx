import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, ShieldCheckIcon, CreditCardIcon } from '../Icons';
const ProfilePage = ({ user, room, isAdmin }) => {
    if (!user)
        return <div className="flex items-center justify-center h-64 dark:text-white">Loading Profile...</div>;
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };
    return (<motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Profile Section */}
      <motion.div variants={itemVariants} className="relative h-64 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row items-end gap-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="relative h-40 w-40 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border-2 border-white/30 flex items-center justify-center text-6xl font-black text-white shadow-[0_0_50px_rgba(255,255,255,0.2)] group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent animate-pulse"/>
            <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10">
              {user.name[0]}
            </motion.span>
            <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/10 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"/>
          </div>
          <div className="flex-1 text-white pb-2">
            <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
            <p className="text-blue-100 flex items-center gap-2 font-medium opacity-90">
              {isAdmin ? 'System Administrator' : `Student • ${user.rollNumber}`}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact Info */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
              <UserIcon className="h-5 w-5 text-blue-500"/>
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <MailIcon className="h-5 w-5"/>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold dark:text-white">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <PhoneIcon className="h-5 w-5"/>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-semibold dark:text-white">{user.contactNumber || 'Not Provided'}</p>
                </div>
              </div>
              {!isAdmin && room && (<div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    <MapPinIcon className="h-5 w-5"/>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hall of Residence</p>
                    <p className="text-sm font-semibold dark:text-white">Block {room.block}, Room {room.roomNumber}</p>
                  </div>
                </div>)}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
              <ShieldCheckIcon className="h-5 w-5 text-green-500"/>
              Status & Security
            </h3>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
              <span className="text-sm font-medium dark:text-slate-300">Account Verified</span>
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse"></span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Detailed Cards */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <CreditCardIcon className="h-5 w-5 text-orange-500"/>
                  Financial Status
                </h3>
                <div className={`text-4xl font-black mb-1 tracking-tighter drop-shadow-sm ${user.feePaid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {user.feePaid ? 'CLEARED' : 'PENDING'}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Current Semester Fees</p>
              </div>
              <CreditCardIcon className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-100 dark:text-slate-700/30 -rotate-12"/>
            </div>

            <div className="glass-card dark:text-white">
              <h3 className="text-lg font-bold mb-4">Membership</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Member Since</span>
                  <span className="font-mono">{new Date(user.createdAt || '').toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Access Level</span>
                  <span className="font-bold uppercase tracking-tighter text-blue-500">{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {!isAdmin && user.guardian && (<div className="glass-card">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                Guardian Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Guardian Name</p>
                  <p className="text-lg font-bold dark:text-white">{user.guardian.name}</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Guardian Contact</p>
                  <p className="text-lg font-bold dark:text-white">{user.guardian.contactNumber}</p>
                </div>
              </div>
            </div>)}
        </motion.div>
      </div>
    </motion.div>);
};
export default ProfilePage;
