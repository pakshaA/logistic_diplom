
import { notification } from 'antd';
import { useEffect } from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationsProps {
  opened: boolean;
  message?: string;
  description?: string;
  type?: NotificationType;
  onClose?: () => void;
}

export const Notifications = ({ opened, message = 'Успех', description = 'Операция выполнена успешно', type = 'success', onClose }: NotificationsProps) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = () => {
    api[type]({
      message,
      description,
      onClose: onClose,
    });
  };

  // Теперь уведомление открывается только при изменении состояния "opened"
  // useEffect(() => {
  //   if (opened) {
  //     openNotificationWithIcon();
  //   }
  // }, []);
  
  return <>{contextHolder}</>;
};