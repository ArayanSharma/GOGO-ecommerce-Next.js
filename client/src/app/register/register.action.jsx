'use server'
import { db } from '@/config/db';

export const registerAction = async (formData) => {
    try {
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const password = formData.get('password');

        await db.execute(
            'INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)',
            [fullName, email, phone, password]
        );

        return { success: true };

    } catch (err) {
        console.error('❌ Registration failed:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return { success: false, message: '⚠️ This email is already registered. Please sign in instead.' };
        }
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
};