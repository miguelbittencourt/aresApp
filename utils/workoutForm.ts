
export function getLocalDateISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function parseWeight(input: string) {
    if (!input || input.trim() === "") {
        return { value: 0, unit: "kg" };
    }

    const clean = input.toLowerCase().replace(",", ".").trim();
    const match = clean.match(/^([\d.]+)\s*(kg|kgs|lb|lbs)?$/);

    if (!match) {
        return { value: 0, unit: "kg" };
    }

    const value = parseFloat(match[1]);
    const unit = match[2]?.startsWith("l") ? "lb" : "kg";

    return { value: isNaN(value) ? 0 : value, unit };
}

export function generateId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
