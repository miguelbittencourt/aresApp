
export function formatWorkoutDate(date: string) {
    const [year, month, day] = date.split("-").map(Number);

    return new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(year, month - 1, day));
}
