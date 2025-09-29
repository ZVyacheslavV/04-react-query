import toast from 'react-hot-toast';

/* interface NotifyOptions {
  message: string;
  icon?: string;
} */

export const notifyFill = (
  message: string = 'Please enter your search query.',
  icon: string = '❕'
): string =>
  toast(message, {
    icon,
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });

export const notifyEmpty = (
  message: string = 'No movies found for your request.',
  icon: string = '❔'
): string =>
  toast(message, {
    icon,
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
