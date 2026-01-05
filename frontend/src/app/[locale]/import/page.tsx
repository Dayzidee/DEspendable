"use client";

import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useState, useRef } from "react";

export default function ImportStatement() {
    const t = useTranslations();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        // Check file type (csv, pdf, mt940, camt)
        const validTypes = ['text/csv', 'application/pdf', 'application/json', 'text/xml'];
        // For demo purposes, we accept most text-based files
        setFile(file);
        setError("");
        setUploadSuccess(false);
    };

    const handleUpload = () => {
        if (!file) return;
        setUploading(true);
        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            setUploadSuccess(true);
            setFile(null);
        }, 2000);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#F4F6F8] pb-24">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <ArrowLeft className="w-5 h-5 text-[#0018A8]" />
                        </Link>
                        <h1 className="text-xl font-bold text-[#1C1C1C]">{t('dashboard.import_statement')}</h1>
                    </div>
                </header>

                <div className="max-w-xl mx-auto px-6 py-12">
                    {/* Main Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0018A8]">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">{t('import.title')}</h2>
                            <p className="text-gray-500">{t('import.description')}</p>
                        </div>

                        {/* Success Message */}
                        {uploadSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700"
                            >
                                <CheckCircle className="w-6 h-6 shrink-0" />
                                <div>
                                    <div className="font-semibold">{t('import.success_title')}</div>
                                    <div className="text-sm">{t('import.success_desc')}</div>
                                </div>
                            </motion.div>
                        )}

                        {/* Upload Area */}
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragActive ? 'border-[#0018A8] bg-blue-50' : 'border-gray-300 hover:border-[#0018A8] hover:bg-gray-50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                onChange={handleChange}
                                accept=".csv,.pdf,.mt940,.camt053,.json"
                            />

                            {file ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#0018A8] mb-3">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="font-medium text-[#1C1C1C] mb-1">{file.name}</div>
                                    <div className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center pointer-events-none">
                                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                    <p className="font-medium text-[#1C1C1C] mb-1">{t('import.drag_drop')}</p>
                                    <p className="text-sm text-gray-500">{t('import.supported_formats')}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-8 space-y-3">
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="w-full bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold py-4 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? t('validation.processing') : t('common.upload')}
                            </button>

                            <Link
                                href="/dashboard"
                                className="block w-full text-center py-3 font-semibold text-gray-500 hover:text-[#1C1C1C] transition"
                            >
                                {t('common.cancel')}
                            </Link>
                        </div>

                        <div className="mt-6 text-center">
                            <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {t('import.security_note')}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
