// Hooks
import useShuffleText from './useShuffleText';

const useCountdownText = (expectedTimestamp?: number) => {
    const generateCountdownText = () => {
        let text = '';

        if (!expectedTimestamp) return text;

        const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

        const minutesMiliseconds = 1000 * 60;
        const hoursMiliseconds = minutesMiliseconds * 60;
        const daysMiliseconds = hoursMiliseconds * 24;
        const yearsMiliseconds = daysMiliseconds * 365;

        if (timeDifference > yearsMiliseconds) {
            const years = Math.floor(timeDifference / yearsMiliseconds);
            text = ` (in ${years} ${years > 1 ? 'years' : 'year'})`;
        } else if (timeDifference > daysMiliseconds) {
            const days = Math.floor(timeDifference / daysMiliseconds);
            text = ` (in ${days} ${days > 1 ? 'days' : 'day'})`;
        } else if (timeDifference > hoursMiliseconds) {
            const hours = Math.floor(timeDifference / hoursMiliseconds);
            text = ` (in ${hours} ${hours > 1 ? 'hours' : 'hour'})`;
        } else if (timeDifference > minutesMiliseconds) {
            const minutes = Math.floor(timeDifference / minutesMiliseconds);
            text = ` (in ${minutes} ${minutes > 1 ? 'minutes' : 'minute'})`;
        } else if (timeDifference > 1000) {
            const seconds = Math.floor(timeDifference / 1000);
            text = ` (in ${seconds} ${seconds > 1 ? 'seconds' : 'second'})`;
        } else if (timeDifference < -10000) {
            text = ' (data not saved)';
        } else {
            text = ' (updating...)';
        }

        return text;
    };

    return useShuffleText(generateCountdownText, 1000);
};

export default useCountdownText;
