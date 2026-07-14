import { apiConfig } from './api/config';

import type { AuthService } from './auth/authService';
import { MockAuthService } from './auth/authService.mock';
import { HttpAuthService } from './auth/authService.http';

import type { UserService } from './user/userService';
import { MockUserService } from './user/userService.mock';
import { HttpUserService } from './user/userService.http';

import type { QrService } from './qr/qrService';
import { MockQrService } from './qr/qrService.mock';
import { HttpQrService } from './qr/qrService.http';

import type { VehicleService } from './vehicle/vehicleService';
import { MockVehicleService } from './vehicle/vehicleService.mock';
import { HttpVehicleService } from './vehicle/vehicleService.http';

import type { BusinessService } from './business/businessService';
import { MockBusinessService } from './business/businessService.mock';
import { HttpBusinessService } from './business/businessService.http';

import type { ContactService } from './contact/contactService';
import { MockContactService } from './contact/contactService.mock';
import { HttpContactService } from './contact/contactService.http';

import type { SubscriptionService } from './subscription/subscriptionService';
import { MockSubscriptionService } from './subscription/subscriptionService.mock';
import { HttpSubscriptionService } from './subscription/subscriptionService.http';

import type { MessageService } from './messaging/messageService';
import { MockMessageService } from './messaging/messageService.mock';
import { HttpMessageService } from './messaging/messageService.http';

import type { NotificationService } from './notifications/notificationService';
import { BrowserNotificationService } from './notifications/notificationService.browser';
import { FcmNotificationService } from './notifications/notificationService.fcm';

const useMock = apiConfig.useMock;

export const authService: AuthService = useMock ? new MockAuthService() : new HttpAuthService();
export const userService: UserService = useMock ? new MockUserService() : new HttpUserService();
export const qrService: QrService = useMock ? new MockQrService() : new HttpQrService();
export const vehicleService: VehicleService = useMock ? new MockVehicleService() : new HttpVehicleService();
export const businessService: BusinessService = useMock ? new MockBusinessService() : new HttpBusinessService();
export const contactService: ContactService = useMock ? new MockContactService() : new HttpContactService();
export const subscriptionService: SubscriptionService = useMock
  ? new MockSubscriptionService()
  : new HttpSubscriptionService();
export const messageService: MessageService = useMock ? new MockMessageService() : new HttpMessageService();
export const notificationService: NotificationService = useMock
  ? new BrowserNotificationService()
  : new FcmNotificationService();
