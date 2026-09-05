import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Finding } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import RequiredLabel from './required-label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface Props {
    finding: Finding;
    children: React.ReactNode | undefined;
    mode: 'standalone' | 'functional-location' | 'equipment';
}

interface DeleteFinding {
    deleted_reason: string;
}

function getEndpointFromFinding(finding: Finding): 'abnormalities' | 'audits' | undefined {
    switch (finding.type?.code) {
        case 'ABN':
            return 'abnormalities';
        case 'AUD':
            return 'audits';
        default:
            return undefined;
    }
}

export function DeleteFindingDialog({ children, finding, mode }: Props) {
    const [open, setOpen] = useState(false);

    function isStandAlone(finding: Finding): boolean {
        return mode == 'standalone' && getEndpointFromFinding(finding) != undefined;
    }

    const {
        data,
        setData,
        delete: destroy,
        errors,
        processing,
    } = useForm<DeleteFinding>({
        deleted_reason: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isStandAlone(finding)) {
            destroy(route(`${getEndpointFromFinding(finding)}.destroy`, finding.id), {
                preserveScroll: true,
                // onSuccess: () => {
                //     setOpen(false);
                // },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit} className="space-y-6">
                    <DialogHeader className="space-y-2">
                        <DialogTitle>Delete Finding</DialogTitle>
                        <DialogDescription>
                            You are about to delete this finding. The finding will be removed from the active list but retained in the system for
                            record and audit purposes. Please provide a reason for deleting this finding.
                        </DialogDescription>
                    </DialogHeader>

                    <Field>
                        <FieldLabel htmlFor="deleted_reason">
                            Deleted reason
                            <RequiredLabel />
                        </FieldLabel>
                        <Textarea
                            className="text-sm"
                            disabled={processing}
                            tabIndex={1}
                            id="deleted_reason"
                            onChange={(val: React.ChangeEvent<HTMLTextAreaElement>) => setData('deleted_reason', val.target.value)}
                            value={data.deleted_reason}
                            placeholder="Enter the reason for deleting this finding (e.g., 'Duplicate finding', 'Incorrect inspection data', or 'Finding is no longer applicable')."
                        />
                        <FieldError>{errors.deleted_reason}</FieldError>
                    </Field>

                    <DialogFooter>
                        <Button disabled={processing || data.deleted_reason == ''} size="sm">
                            Delete
                        </Button>
                        {/* <ButtonSubmit
                            tabIndex={2}
                            processing={processing}
                            disabled={processing || data.deleted_reason == null}
                            label="Delete"
                            // successMessage="Deleted"
                            recentlySuccessful={recentlySuccessful}
                        /> */}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
