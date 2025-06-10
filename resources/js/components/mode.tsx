// mode.tsx
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';

const getNextAppearance = (current: 'light' | 'dark' | 'system'): 'light' | 'dark' | 'system' => {
    switch (current) {
        case 'system':
            return 'light';
        case 'light':
            return 'dark';
        case 'dark':
            return 'system';
    }
};

export function ModeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const handleToggle = () => {
        updateAppearance(getNextAppearance(appearance));
    };

    const icon = {
        light: <Sun className="h-5 w-5" />,
        dark: <Moon className="h-5 w-5" />,
        system: <Monitor className="h-5 w-5" />,
    };

    return (
        <Button variant="ghost" onClick={handleToggle} title={`Mode: ${appearance}`}>
            {icon[appearance]}
        </Button>
    );
}

// export function ModeDropdown() {
//     const { theme, setAppearance } = useTheme();

//     return (
//         <DropdownMenuGroup>
//             <DropdownMenuSub>
//                 <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
//                 <DropdownMenuPortal>
//                     <DropdownMenuSubContent>
//                         <DropdownMenuItem onClick={() => setAppearance('dark')}>
//                             <div className="flex w-full items-center justify-between">
//                                 <span>Dark</span>
//                                 {theme === 'dark' ? <Check /> : undefined}
//                             </div>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => setAppearance('light')}>
//                             <div className="flex w-full items-center justify-between">
//                                 <span>Light</span>
//                                 {theme === 'light' ? <Check /> : undefined}
//                             </div>
//                         </DropdownMenuItem>
//                     </DropdownMenuSubContent>
//                 </DropdownMenuPortal>
//             </DropdownMenuSub>
//         </DropdownMenuGroup>
//     );
// }

// export function ModeSwitch() {
//     const { theme, setAppearance } = useTheme();
//     const [isDark, setIsDark] = useState(false);

//     // Sync state when theme changes
//     useEffect(() => {
//         setIsDark(theme === 'dark');
//     }, [theme]);

//     return <Switch id="darkmode" checked={isDark} onCheckedChange={(checked) => setAppearance(checked ? 'dark' : 'light')} />;
// }
