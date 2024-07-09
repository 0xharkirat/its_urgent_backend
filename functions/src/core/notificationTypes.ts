// export const notificationTypes = {
//     "getFocusStatus": 0,
//     "sendNotification": 1,
// };

export enum NotificationType {
    userNotFound,
    errorGettingFocusStatus,
    getFocusStatus,
    receivedSuccessfully,
    sentSuccessfully,
    dndOn,
  }

export const notificationTypeMap = {
    [NotificationType.userNotFound]: 101,
    [NotificationType.errorGettingFocusStatus]: 100,
    [NotificationType.getFocusStatus]: 99,
    [NotificationType.receivedSuccessfully]: 98,
    [NotificationType.sentSuccessfully]: 97,
    [NotificationType.dndOn]: 96,
};

// const notificationType = NotificationType.getFocusStatus;
// const value = notificationTypeMap[notificationType];
// console.log(value); // Output: 99


//   const notificationTypeMap = {
//     NotificationType.errorGettingFocusStatus: 100,
//     NotificationType.getFocusStatus: 99,
//     NotificationType.receivedSuccessfully: 98,
//     NotificationType.sentSuccessfully: 97,
//     NotificationType.dndOn: 96,
//   };
