export function formatRelativeTime(dateString: string) {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
    }).format(new Date(dateString));
}
