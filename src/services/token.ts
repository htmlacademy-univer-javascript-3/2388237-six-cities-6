import { TokenName } from '../const';

export const getToken = (): string => localStorage.getItem(TokenName) ?? '';
export const saveToken = (token: string): void => localStorage.setItem(TokenName, token);
export const dropToken = (): void => localStorage.removeItem(TokenName);
