import { ShakeAlertEvent } from '@/services/earthquakeService';
interface USGSShakeAlertProps {
    className?: string;
    onAlertReceived?: (alert: ShakeAlertEvent) => void;
}
declare const USGSShakeAlert: ({ className, onAlertReceived }: USGSShakeAlertProps) => import("react/jsx-runtime").JSX.Element;
export default USGSShakeAlert;
