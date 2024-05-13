export enum ProjectModule {
  USER = 'user',
  AUTH = 'auth',
  LOCATION = 'location',
  OTP = 'otp',
  CLASS = 'class',
  USER_CLASS_TIME = 'user_class_time',
  NOTIFICATION = 'notification',
}

export enum ProjectTableName {
  USER = 'users',
  LOCATION = 'locations',
  OTP = 'otps',
  CLASS = 'class',
  USER_CLASS_MAPPING = 'user_class_mapping',
  CLASS_TRIGGER_TIME_MAPPING = 'class_trigger_time_mapping',
  CHAT = 'chat',
  NOTIFICATION = 'notification',
}

export enum Assigner {
  CREATED = 'created',
  UPDATED = 'updated',
}
