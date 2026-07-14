import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (iso: string): string => format(new Date(iso), 'dd MMM yyyy');

export const formatDateTime = (iso: string): string => format(new Date(iso), 'dd MMM yyyy, h:mm a');

export const formatRelativeTime = (iso: string): string =>
  formatDistanceToNow(new Date(iso), { addSuffix: true });

export const formatNepalPhoneDisplay = (digits: string): string => digits;
