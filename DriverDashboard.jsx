import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Phone, MapPin, Truck, CheckCircle, Clock, DollarSign, User } from 'lucide-react';

const DriverDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch Initial Data
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching bookings:', error);
            else setBookings(data || []);
            setLoading(false);
        };

        fetchBookings();

        // 2. Realtime Subscription
        const channel = supabase
            .channel('public:bookings')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                (payload) => {
                    console.log('Realtime Change:', payload);
                    handleRealtimeChange(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleRealtimeChange = (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        if (eventType === 'INSERT') {
            // Add new pending booking
            if (newRecord.status === 'pending') {
                setBookings((prev) => [newRecord, ...prev]);
            }
        } else if (eventType === 'UPDATE') {
            // If status changed to something else, remove it
            if (newRecord.status !== 'pending') {
                setBookings((prev) => prev.filter((b) => b.id !== newRecord.id));
            } else {
                // Update details if still pending
                setBookings((prev) => prev.map((b) => (b.id === newRecord.id ? newRecord : b)));
            }
        } else if (eventType === 'DELETE') {
            setBookings((prev) => prev.filter((b) => b.id !== oldRecord.id));
        }
    };

    const acceptJob = async (id) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'accepted' })
                .eq('id', id);

            if (error) throw error;
            // Optimistic update handled by realtime subscription, 
            // but we can also remove it locally for instant feedback if connection is slow
            setBookings(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            console.error('Error accepting job:', err);
            alert('Error accepting job: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-20">
            {/* Header */}
            <header className="bg-deep-blue text-white p-5 shadow-lg sticky top-0 z-50">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">Driver Dashboard</h1>
                        <div className="flex items-center text-xs text-green-400 font-bold mt-1">
                            <span className="relative flex h-2 w-2 mr-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Looking for jobs...
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="p-4 max-w-lg mx-auto">
                {loading ? (
                    <div className="flex justify-center pt-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-deep-blue"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center pt-20 text-gray-400">
                        <Truck size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium">No pending jobs available.</p>
                        <p className="text-xs">New bookings will appear here instantly.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                <User size={16} className="mr-1.5 text-gray-400" />
                                                {booking.customer_name || 'Macmiil'}
                                            </h3>
                                            <div className="text-sm text-gray-500 font-medium flex items-center mt-1">
                                                <Clock size={12} className="mr-1" />
                                                {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-extrabold text-deep-blue">${booking.price}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">{booking.trip_type}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100">
                                        <div className="flex items-start">
                                            <MapPin size={18} className="text-bajaaj-yellow mt-0.5 mr-2 shrink-0" fill="#f59e0b" />
                                            <p className="text-sm font-bold text-gray-700 leading-snug">{booking.location}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <a 
                                            href={`tel:${booking.phone}`}
                                            className="flex items-center justify-center bg-green-50 text-green-700 font-bold py-3 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
                                        >
                                            <Phone size={18} className="mr-2" />
                                            Call
                                        </a>
                                        <button 
                                            onClick={() => acceptJob(booking.id)}
                                            className="flex items-center justify-center bg-deep-blue text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
                                        >
                                            Accept Job
                                            <CheckCircle size={18} className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DriverDashboard;
