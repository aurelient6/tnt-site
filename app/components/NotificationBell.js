'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './notificationBell.css';

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Récupérer le dernier timestamp de vérification depuis localStorage
    const stored = localStorage.getItem('lastNotificationCheck');
    const initialTime = stored ? new Date(stored) : new Date(Date.now() - 5 * 60 * 1000); // 5 min par défaut
    setLastCheckTime(initialTime);
  }, []);

  useEffect(() => {
    if (!lastCheckTime) return;

    // Fonction pour vérifier les nouvelles notifications
    const checkNotifications = async () => {
      try {
        const response = await fetch(`/api/admin/notifications?since=${lastCheckTime.toISOString()}`);
        
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
          return !notifications.some(existing => existing.id === notif.id);
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
      } catch (error) {
        // Erreur silencieuse
      }
    };

    // Vérifier immédiatement
    checkNotifications();

    // Puis toutes les 30 secondes
    const interval = setInterval(checkNotifications, 30000);

    return () => clearInterval(interval);
  }, [lastCheckTime, router, notifications]);

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
      // Marquer comme lu quand on ouvre le dropdown
      const now = new Date();
      localStorage.setItem('lastNotificationCheck', now.toISOString());
      setLastCheckTime(now);
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

  const formatTimeSince = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
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
                      <strong>{notif.client_firstname} {notif.client_name}</strong>
                      {getStatusBadge(notif.payment_status)}
                    </div>
                    <div className="notification-service">{notif.service_name}</div>
                    <div className="notification-meta">
                      <span className="notification-time">{formatTimeSince(notif.created_at)}</span>
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
                  setLastCheckTime(now);
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
