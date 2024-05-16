import React from 'react';

export default function ServiceItem({ servicesInfo }) {
    return (
        <div>
            <h3 className="text-lg font-bold text-gray-800">Hizmetler Tablosu</h3>
            <table className="w-full mt-4">
                <thead>
                    <tr>
                        <th className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Hizmet Adı</th>
                        <th className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Zaman (Dakika)</th>
                        <th className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Fiyat</th>
                    </tr>
                </thead>
                <tbody>
                    {servicesInfo.map((service, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border border-gray-200">{service.serviceName}</td>
                            <td className="py-2 px-4 border border-gray-200">{service.price}</td>
                            <td className="py-2 px-4 border border-gray-200">{service.time}</td>
                            <td>
                                <button type="button" className="w-12 h-12 border-2 bg-sky-200 hover:bg-sky-900 hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0">
                                    Ekle
                                </button>
                            </td>
                            <td>
                                <button type="button" className="w-12 h-12 border-2 bg-red-700 hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0">
                                    Çıkar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
