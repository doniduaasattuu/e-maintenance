import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
    toggleTabIndex: number;
    className?: string;
}

export function InputPassword({ toggleTabIndex, className, ...props }: InputPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <Input type={showPassword ? 'text' : 'password'} placeholder="password" className={cn('pr-10', className)} {...props} />
            <div className="absolute top-2.5 right-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)} tabIndex={toggleTabIndex}>
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </div>
        </div>
    );
}
