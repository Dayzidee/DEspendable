"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';

type ProfileFormData = {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    nationality: string;
    taxId: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    employmentStatus: string;
    sourceOfFunds: string;
    annualIncome: string;
};

interface ProfileFormProps {
    initialData?: Partial<ProfileFormData>;
    onSuccess?: () => void;
}

export default function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
    const t = useTranslations('profile_data');
    const tValidation = useTranslations('validation');
    const { token } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ProfileFormData>({
        defaultValues: initialData || {
            address: {}
        }
    });

    const onSubmit = async (data: ProfileFormData) => {
        try {
            setError(null);
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const inputClass = "w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50/50";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const errorClass = "text-xs text-red-500 mt-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
                    {error}
                </div>
            )}

            {/* Personal Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{t('personal_info')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>{t('firstName')}</label>
                        <input
                            {...register('firstName', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('lastName')}</label>
                        <input
                            {...register('lastName', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('dateOfBirth')}</label>
                        <input
                            type="date"
                            {...register('dateOfBirth', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('phoneNumber')}</label>
                        <input
                            type="tel"
                            {...register('phoneNumber', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('nationality')}</label>
                        <input
                            {...register('nationality', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.nationality && <p className={errorClass}>{errors.nationality.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('taxId')}</label>
                        <input
                            {...register('taxId', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.taxId && <p className={errorClass}>{errors.taxId.message}</p>}
                    </div>
                </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{t('address_info')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className={labelClass}>{t('street')}</label>
                        <input
                            {...register('address.street', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.address?.street && <p className={errorClass}>{errors.address.street.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('city')}</label>
                        <input
                            {...register('address.city', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.address?.city && <p className={errorClass}>{errors.address.city.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('postalCode')}</label>
                        <input
                            {...register('address.postalCode', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.address?.postalCode && <p className={errorClass}>{errors.address.postalCode.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('country')}</label>
                        <input
                            {...register('address.country', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.address?.country && <p className={errorClass}>{errors.address.country.message}</p>}
                    </div>
                </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{t('financial_info')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>{t('employmentStatus')}</label>
                        <select
                            {...register('employmentStatus', { required: tValidation('required') })}
                            className={inputClass}
                        >
                            <option value="">{tValidation('select') || 'Select'}</option>
                            <option value="employed">Employed</option>
                            <option value="self_employed">Self Employed</option>
                            <option value="unemployed">Unemployed</option>
                            <option value="student">Student</option>
                            <option value="retired">Retired</option>
                        </select>
                        {errors.employmentStatus && <p className={errorClass}>{errors.employmentStatus.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('sourceOfFunds')}</label>
                        <select
                            {...register('sourceOfFunds', { required: tValidation('required') })}
                            className={inputClass}
                        >
                            <option value="">{tValidation('select') || 'Select'}</option>
                            <option value="salary">Salary</option>
                            <option value="business">Business Income</option>
                            <option value="savings">Savings</option>
                            <option value="investments">Investments</option>
                            <option value="inheritance">Inheritance</option>
                        </select>
                        {errors.sourceOfFunds && <p className={errorClass}>{errors.sourceOfFunds.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>{t('annualIncome')}</label>
                        <input
                            type="number"
                            {...register('annualIncome', { required: tValidation('required') })}
                            className={inputClass}
                        />
                        {errors.annualIncome && <p className={errorClass}>{errors.annualIncome.message}</p>}
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? tValidation('processing') || 'Processing...' : t('save')}
                </button>
            </div>
        </form>
    );
}
