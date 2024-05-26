export const getDestructuredTime = timeInSeconds => {
	if (!timeInSeconds) return { time: 1, unit: 60 };

	if (timeInSeconds / 3600 >= 1)
		return { time: Math.floor(timeInSeconds / 3600), unit: 3600 };
	else if (timeInSeconds / 60 >= 1)
		return { time: Math.floor(timeInSeconds / 60), unit: 60 };
	else return { time: timeInSeconds, unit: 1 };
};
