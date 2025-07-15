import React from 'react';
import { ButtonProps } from "@/components/ui/button";
interface AnimatedBorderButtonProps extends ButtonProps {
    children: React.ReactNode;
    className?: string;
}
declare const AnimatedBorderButton: React.ForwardRefExoticComponent<AnimatedBorderButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default AnimatedBorderButton;
