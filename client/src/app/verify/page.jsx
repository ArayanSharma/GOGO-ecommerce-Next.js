import { Suspense } from 'react';
import VerifyContent from './VerifyContent';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center'>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
