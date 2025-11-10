'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../app/constantes/routes';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger automatiquement vers le premier service
    router.push(ROUTES.admin + ROUTES.toilettage);
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      Redirection...
    </div>
  );
}
