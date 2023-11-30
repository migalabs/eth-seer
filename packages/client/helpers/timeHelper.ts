export function getTimeAgo(timestamp: number) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Function to add 's' to the end of a string if the value is greater than 1
    const pluralize = (value: number, unit: string) => `${value} ${unit}${value > 1 ? 's' : ''}`;

    // Function to get the days
    const getDays = (value: number) => pluralize(value, 'day');

    // Function to get the hours
    const getHours = (value: number) => pluralize(value, 'hr');

    // Function to get the minutes
    const getMinutes = (value: number) => pluralize(value, 'min');

    // Function to get the seconds
    const getSeconds = (value: number) => pluralize(value, 'sec');

    if (days > 0) {
        const hoursMinusDays = hours - days * 24;
        return `${getDays(days)} ${getHours(hoursMinusDays)} ago`;
    }

    if (hours > 0) {
        const minutesMinusHours = minutes - hours * 60;
        return `${getHours(hours)} ${getMinutes(minutesMinusHours)} ago`;
    }

    if (minutes > 0) {
        const secondsMinusMinutes = seconds - minutes * 60;
        return `${getMinutes(minutes)} ${getSeconds(secondsMinusMinutes)} ago`;
    }

    return `${getSeconds(seconds)} ago`;
}
