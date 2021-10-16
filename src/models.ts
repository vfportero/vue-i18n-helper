type LocaleMessage = string | LocaleMessageObject | LocaleMessageArray;
export interface LocaleMessageObject { [key: string]: LocaleMessage; }
export interface LocaleMessageArray { [index: number]: LocaleMessage; }
export interface LocaleMessages { [key: string]: LocaleMessageObject; }
export interface LocaleFiles { [key: string]: LocaleMessages; }