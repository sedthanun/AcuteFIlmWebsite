'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error
    console.error(error);
    
    // Check if it's a chunk loading error (happens after new deployments when old chunks are requested)
    const isChunkLoadError = 
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('chunk') ||
      error?.message?.includes('Loading chunk');

    if (isChunkLoadError) {
      // Force a hard reload to get the latest assets from the server
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-4 text-white">พบข้อผิดพลาดบางอย่าง</h2>
        <p className="text-gray-400 mb-6">
          อาจมีการอัปเดตเวอร์ชันใหม่ กรุณารีเฟรชหน้าเว็บเพื่อดำเนินการต่อ
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors duration-200"
        >
          รีเฟรชหน้าเว็บ
        </button>
      </div>
    </div>
  );
}
