'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '../style/notificationBell.css';

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const lastCheckTimeRef = useRef(null);
  const notificationsRef = useRef([]);
  const dropdownRef = useRef(null);

  // Synchroniser la ref avec le state
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    // Récupérer le dernier timestamp de vérification depuis localStorage
    const stored = localStorage.getItem('lastNotificationCheck');
    const initialTime = stored ? new Date(stored) : new Date(Date.now() - 5 * 60 * 1000); // 5 min par défaut
    lastCheckTimeRef.current = initialTime;
  }, []);

  useEffect(() => {
    // Fonction pour vérifier les nouvelles notifications
    const checkNotifications = async () => {
      if (!lastCheckTimeRef.current) return;

      try {
        const response = await fetch(`/api/admin/notifications?since=${lastCheckTimeRef.current.toISOString()}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            // Session expirée, rediriger vers login
            router.push('/admin/login');
          }
          return;
        }

        const data = await response.json();
        
        // Détecter les NOUVELLES notifications (pas encore vues)
        const newNotifs = data.notifications.filter(notif => {
          return !notificationsRef.current.some(existing => existing.id === notif.id);
        });

        // Afficher notification native uniquement pour les NOUVELLES
        if (newNotifs.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
          const latest = newNotifs[0];
          new Notification('Nouvelle réservation !', {
            body: `${latest.client_firstname} ${latest.client_name} - ${latest.service_name}`,
            icon: '/images/logo/logo.png',
            tag: `booking-${latest.id}`
          });
        }

        // Mettre à jour TOUTES les notifications (pour avoir les statuts à jour)
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
          setUnreadCount(data.count);
        } else if (data.count === 0) {
          // Aucune notification non lue
          setNotifications([]);
          setUnreadCount(0);
        }

        // Mettre à jour le timestamp pour la prochaine requête
        const now = new Date();
        lastCheckTimeRef.current = now;
        localStorage.setItem('lastNotificationCheck', now.toISOString());
      } catch (error) {
        // Erreur silencieuse
      }
    };

    // Vérifier immédiatement
    checkNotifications();

    // Puis toutes les 60 secondes (1 minute)
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [router]); // UNIQUEMENT router dans les dépendances

  useEffect(() => {
    // Demander la permission pour les notifications natives
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    
    if (!showDropdown) {
      // Réinitialiser le compteur de non-lus (visuellement)
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = (notification) => {
    // Rediriger vers la page admin du service
    router.push(`/admin/${notification.service_slug}`);
    setShowDropdown(false);
  };

  const getStatusBadge = (paymentStatus) => {
    switch(paymentStatus) {
      case 'paid':
        return <span className="status-badge paid">Payé</span>;
      case 'pending':
        return <span className="status-badge pending">En attente</span>;
      case 'failed':
        return <span className="status-badge failed">Échoué</span>;
      default:
        return null;
    }
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button 
        className="bell-button" 
        onClick={handleBellClick}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>Aucune nouvelle notification</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className="notification-item"
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="notification-content">
                    <div className="notification-title">
                      <strong>{notif.service_name}</strong>
                      {getStatusBadge(notif.payment_status)}
                    </div>
                    <div className="notification-service">{notif.client_firstname} {notif.client_name}</div>
                    <div className="notification-meta">
                      <span className="notification-price">{notif.total_price}€</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="dropdown-footer">
              <button 
                onClick={() => {
                  const now = new Date();
                  localStorage.setItem('lastNotificationCheck', now.toISOString());
                  lastCheckTimeRef.current = now;
                  setNotifications([]);
                  setUnreadCount(0);
                  setShowDropdown(false);
                }}
                className="mark-read-btn"
              >
                Tout marquer comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
