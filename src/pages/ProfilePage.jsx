import React, { useState } from 'react';
import { ProfileCard } from '../components/ProfileCard';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Save } from 'lucide-react';
export const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);
    if (!user)
        return null;
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUser({ name, phone, address });
            showToast('Profile Saved', 'Your user profile has been updated.', 'success');
        }
        catch (err) {
            showToast('Save Error', err.message || 'Could not update profile.', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Profile & Account Settings</h1>
        <p className="text-sm text-slate-400">Manage your personal credentials, contact info, and medical metadata.</p>
      </div>

      <ProfileCard user={user}/>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="font-bold text-white text-base">Edit Contact Details</h3>

        <FormInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required/>

        <FormInput label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}/>

        <FormInput label="Residential Address" value={address} onChange={(e) => setAddress(e.target.value)}/>

        <div className="pt-2 text-right border-t border-slate-800">
          <Button type="submit" isLoading={loading} variant="primary" icon={<Save className="w-4 h-4"/>}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>);
};
