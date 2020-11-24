exports.homePage = (req, res) => {
    res.status(200).render("base", {
        tour: "The forest ",
        user: "toto",
    });
};

exports.getOverview = (req, res) => {
    res.status(200).render("overview", {
        title: "All tours",
    });
};

exports.getOneTour = (req, res) => {
    res.status(200).render("tour", {
        title: "The forest hiker",
    });
};
