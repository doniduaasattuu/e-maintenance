export function toDateString(date: Date | undefined): string | null {
    if (date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');

        const formatted = `${yyyy}-${mm}-${dd}`;
        return formatted;
    }

    return null;
}
