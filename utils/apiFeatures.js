class APIFeature {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObject = { ...this.queryString };
        const excludeFields = ["page", "sort", "limit", "fields"];

        excludeFields.forEach((field) => delete queryObject[field]);

        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(
            /(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
        
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.replace(/,/g, " ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.replace(/,/g, " "); //je les separe par un espace pour pouvoir les passer a mon select
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__V"); //le moins est une exclusion ici on exclu V qui est utiliser par mongodb
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;

        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeature