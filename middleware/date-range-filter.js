const calculateDateBounds = (range, startDate, endDate) => {
    const end = new Date();
    let start = new Date();

    switch (range) {
        case "last-week":
            start.setDate(end.getDate() - 7);
            break;
        case "last-3-months":
            start.setMonth(end.getMonth() - 3);
            break;
        case "last-year":
            start.setFullYear(end.getFullYear() - 1);
            break;
        case "custom":
            start = new Date(startDate);
            return { start, end: new Date(endDate) };
        case "last-month":
        default:
            start.setMonth(end.getMonth() - 1);
            break;
    }
    return { start, end }
};

const dateFilter = (req, res, next) => {
    const { range = "last-month", startDate, endDate } = req.query;
    const { start, end } = calculateDateBounds(range, startDate, endDate);

    req.dateFilter = {
        createdAt: {
            $gte: start,
            $lte: end
        }
    }
    next();
}

export default dateFilter