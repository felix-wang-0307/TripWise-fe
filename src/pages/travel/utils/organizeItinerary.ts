export function organizeItinerary(itinerary) {
    const itineraryByDate = {};

    // Sort itinerary by date and time before organizing
    const sortedItinerary = [...itinerary].sort((a, b) => {
        const dateTimeA = `${a.date}${a.time}`;
        const dateTimeB = `${b.date}${b.time}`;

        return dateTimeA.localeCompare(dateTimeB);
    });

    // Organize itinerary by date
    sortedItinerary.forEach(item => {
        if (!itineraryByDate[item.date]) {
            itineraryByDate[item.date] = [];
        }
        itineraryByDate[item.date].push(item);
    });

    return itineraryByDate;
}