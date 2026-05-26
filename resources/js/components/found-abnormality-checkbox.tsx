import HeadingSmall from './heading-small';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export default function FoundAbnormalityCheckbox({
    onChecked,
    hasAbnormality,
    equipmentClassName,
}: {
    onChecked: (checked: boolean) => void;
    hasAbnormality: boolean;
    equipmentClassName: string | undefined;
}) {
    return (
        <div className="flex items-center justify-between">
            <HeadingSmall
                title={`${equipmentClassName ? equipmentClassName.toUpperCase() : 'Inspection'}`}
                description="Equipment inspection form."
            />

            <div className="flex items-center space-x-2 rounded-lg">
                <Checkbox id="abnormality" checked={hasAbnormality} onCheckedChange={onChecked} />
                <Label htmlFor="abnormality" className="cursor-pointer text-sm leading-none font-medium">
                    Found Abnormality?
                </Label>
            </div>
        </div>
    );
}
