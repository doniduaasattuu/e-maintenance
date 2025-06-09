import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
    toggleTabIndex: number;
}

export function InputPassword({ toggleTabIndex, ...props }: InputPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <Input type={showPassword ? 'text' : 'password'} placeholder="Password" className="pr-10" {...props} />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0 hover:bg-transparent"
                tabIndex={toggleTabIndex}
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
        </div>
    );
}
