import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Settings = () => {
    const { t } = useLanguage();
    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{t('settings') || "Settings"}</h2>
            <p className="text-gray-600">{t('settings_desc') || "Application configuration and preferences."}</p>
        </div>
    );
};

export default Settings;
